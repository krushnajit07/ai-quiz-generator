from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import json

from database import SessionLocal, init_db, Quiz
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz_from_text
import re
from fastapi import Request


# Initialize DB 
init_db()

# Create FastAPI app
app = FastAPI(title="AI Wiki Quiz Generator API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your React URL later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency: get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# 1 Endpoint: Generate Quiz

@app.post("/generate_quiz")
def generate_quiz(payload: dict, db: Session = Depends(get_db)):
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="Missing 'url' field")

    # 1. URL validation
    wiki_pattern = r"^https?:\/\/(en\.)?wikipedia\.org\/wiki\/[A-Za-z0-9_\-()%,.]+$"
    if not re.match(wiki_pattern, url):
        raise HTTPException(status_code=400, detail="Invalid Wikipedia URL")

    # 2. Caching: check if this URL already exists
    existing = db.query(Quiz).filter(Quiz.url == url).first()
    if existing:
        print("Cache hit: returning stored quiz")
        return {"quiz_id": existing.id, "quiz_data": json.loads(existing.full_quiz_data)}

    # 3. Scrape fresh data
    from scraper import scrape_wikipedia
    import requests
    from bs4 import BeautifulSoup

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    title, text = scrape_wikipedia(url)

    quiz_data = generate_quiz_from_text(title, text)

    quiz_record = Quiz(
        url=url,
        title=quiz_data["title"],
        scraped_content=text,            
        full_quiz_data=json.dumps(quiz_data)
    )

    db.add(quiz_record)
    db.commit()
    db.refresh(quiz_record)


    return {"quiz_id": quiz_record.id, "quiz_data": quiz_data}



@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).order_by(Quiz.date_generated.desc()).all()
    return [
        {
            "id": q.id,
            "url": q.url,
            "title": q.title,
            "date_generated": q.date_generated
        }
        for q in quizzes
    ]



@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    quiz_data = json.loads(quiz.full_quiz_data)
    return {"id": quiz.id, "title": quiz.title, "quiz_data": quiz_data}


@app.post("/preview_url")
def preview_url(payload: dict):
    url = payload.get("url", "").strip()

    # Check if it’s a valid Wikipedia link
    wiki_pattern = r"^https?:\/\/(en\.)?wikipedia\.org\/wiki\/[A-Za-z0-9_\-()%,.]+$"
    if not re.match(wiki_pattern, url):
        raise HTTPException(status_code=400, detail="Invalid Wikipedia URL")

    # Try fetching just the title for preview
    try:
        import requests
        from bs4 import BeautifulSoup

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        }
        resp = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")
        title = soup.find("h1", {"id": "firstHeading"}).get_text(strip=True)
        return {"valid": True, "title": title, "url": url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error previewing article: {str(e)}")


# Root endpoint
@app.get("/")
def root():
    return {"message": "AI Wiki Quiz Generator API is running.."}
