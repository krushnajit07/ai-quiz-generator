# backend/llm_quiz_generator.py
import os
import json
import re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# ✅ Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("❌ GOOGLE_API_KEY not found in .env file")

# ✅ Initialize Gemini (direct model call — not template-based)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY
)

# ✅ Plain-text prompt — no LangChain variables, no placeholders
PROMPT_TEMPLATE = """
You are an assistant that converts a given article into a structured quiz.

Generate a JSON object in this exact format:

{
  "title": "<short quiz title>",
  "summary": "<2-3 line summary of the article>",
  "questions": [
    {
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "answer": "<the exact correct option text>",
      "difficulty": "<easy|medium|hard>"
    }
  ]
}

Guidelines:
- Always output **valid JSON only** (no markdown, code blocks, or explanations).
- Provide 5–10 questions.
- Assign each question a difficulty level: "easy", "medium", or "hard".
- "easy" = factual recall, "medium" = conceptual understanding, "hard" = reasoning.
- The 'answer' must match exactly one of the options.
"""

def generate_quiz_from_text(title: str, text: str):
    """
    Generate a quiz (with difficulty levels) from a given article.
    Returns structured JSON.
    """
    prompt = f"""{PROMPT_TEMPLATE}

Article Title: {title}

Article Content:
{text[:15000]}
"""

    print("🧠 Sending prompt to Gemini model...")

    try:
        result = llm.invoke(prompt)
        content = result.content.strip()
        print("✅ Gemini response received.")
    except Exception as e:
        print("❌ Gemini API error:", e)
        return None

    # 🧩 Try to parse the JSON cleanly
    try:
        quiz_data = json.loads(content)
    except Exception:
        match = re.search(r"\{.*\}", content, re.S)
        if match:
            quiz_data = json.loads(match.group(0))
        else:
            print("❌ Failed to extract JSON from response.")
            return None

    # 🧠 Ensure the structure is correct
    if "questions" not in quiz_data:
        print("❌ Invalid quiz data: missing 'questions'")
        return None

    # ✅ Normalize difficulty
    for q in quiz_data["questions"]:
        diff = (q.get("difficulty") or "").strip().lower()
        if diff not in ("easy", "medium", "hard"):
            q["difficulty"] = "medium"

    print("✅ Quiz generated successfully with difficulty levels.")
    return quiz_data
