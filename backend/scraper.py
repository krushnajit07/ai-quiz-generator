import requests
from bs4 import BeautifulSoup

MAX_CONTENT_LENGTH = 10_000  

def scrape_wikipedia(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Title
    title = soup.find("h1", id="firstHeading").get_text(strip=True)

    # Extract readable paragraphs
    paragraphs = soup.select("div.mw-parser-output > p")
    content = " ".join(
        p.get_text(" ", strip=True)
        for p in paragraphs
        if len(p.get_text(strip=True)) > 40
    )

    # ✅ HARD LIMIT content size
    content = content[:MAX_CONTENT_LENGTH]

    return title, content
