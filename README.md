# Wiki Quiz Generator 

## Overview
Wiki Quiz Generator is a full-stack web application that accepts a Wikipedia article URL and automatically generates a quiz using a Large Language Model (LLM).  
The system scrapes article content, generates structured quiz questions with difficulty levels and explanations, and stores past quizzes for future viewing.

---
### 🔗 Live URLs

_First start backend server by clicking on link_

**Backend (Render) :**
**https://ai-quiz-generator-z9in.onrender.com**

**Frontend (Vercel) :** **https://ai-quiz-generator-omega-vert.vercel.app/**

## Setup Instructions

### 1. Clone the Repository
```
git clone <repository-url>
```

### 2. Backend Setup
```
cd backend
python -m venv venv
source venv/bin/activate   
# Windows: venv\Scripts\activate
pip install -r requirements.txt
```
#### Create a .env file with following :

```
GOOGLE_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://username:password@host:port/dbname
MYSQL_USER="db_username"
MYSQL_PASSWORD="yourpass"
MYSQL_HOST="host_link"
MYSQL_DB=="quiz_db"
```

#### Start the backend:
```
uvicorn main:app --reload
```



### 3. Frontend Setup
```
cd frontend
npm install
npm start
```

## API Endpoints

### 1. Preview Wikipedia URL
**Endpoint:** `POST /preview_url`

**Description:** Validates a Wikipedia URL and fetches the article title before quiz generation.

**Sample Request:**
```
{
  "url": "https://en.wikipedia.org/wiki/Artificial_intelligence"
}
```
### 2. Generate Quiz  
**Endpoint:** `POST /generate-quiz`


**Request Body**
```
{
  "url": "https://en.wikipedia.org/wiki/Alan_Turing"
}
```

**Response :** (refer to sample_data/quiz_output_example.json)

- Article title & summary

- Quiz questions with options, answers, difficulty, explanations


### 3. Get Quiz History

**Endpoint:** `GET /quizzes`


**Response :**

- All previously generated quizzes stored in the database.

### 4. Get Quiz by ID

**Endpoint:** `GET /quiz/{id}`

**Description:** Fetches a specific quiz by its ID.

---
## Testing Steps

- Open the frontend in browser

- Paste a Wikipedia URL in Generate Quiz

- Click Generate Quiz

- Use Take Quiz or View Answers

- Open Past Quizzes tab to view history

- Click Details to view full quiz


## Sample Data

### The 'sample_data/' folder contains:

- Example Wikipedia URLs tested

- Corresponding JSON API outputs

---

## Features
- Generate quizzes from any Wikipedia article URL
- URL validation and preview 
- 5–10 multiple-choice questions per quiz
- Difficulty levels: Easy, Medium, Hard
- Correct answers with explanations
- “Take Quiz” mode with scoring
- “View Answers” mode
- History of previously generated Quizzes
- Caching to prevent duplicate scraping of the same URL. 

---

## Tech Stack

### Backend
- Python
- FastAPI
- LangChain
- Gemini (Google Generative AI – Free Tier)
- BeautifulSoup (HTML scraping)
- MySQL

### Frontend
- React
- CSS 


---
