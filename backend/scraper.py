import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str):
    """
    Fetches and cleans the main content of a Wikipedia article.
    Returns a tuple: (title, cleaned_text)
    """
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        title = soup.find("h1", {"id": "firstHeading"}).get_text(strip=True)

        content_div = soup.find("div", {"id": "mw-content-text"})
        if not content_div:
            raise ValueError("Could not find main article content.")

        for tag in content_div.find_all(["sup", "table", "script", "style"]):
            tag.decompose()

        paragraphs = [p.get_text(" ", strip=True) for p in content_div.find_all("p")]
        clean_text = "\n".join(paragraphs)

        return title, clean_text

    except Exception as e:
        print(f"Error scraping article: {e}")
        return None, None


# Test code
if __name__ == "__main__":
    test_url = "https://en.wikipedia.org/wiki/Artificial_intelligence"
    title, text = scrape_wikipedia(test_url)
    if text:
        print(f"Title: {title}")
        print(f"Content sample:\n{text[:500]}...")
