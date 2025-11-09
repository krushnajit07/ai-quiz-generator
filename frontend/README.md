# 🧠 AI Quiz Generator (DeepKlarity Assignment)

An AI-powered web application that automatically generates interactive quizzes from **Wikipedia articles** using **Google Gemini (via LangChain)**.  
Built with a **FastAPI + MySQL backend** and a **React frontend**, this project showcases full-stack AI integration, real-time URL validation, intelligent caching, and dynamic quiz generation.

---

## 🚀 Features

✅ **Automatic Quiz Generation**
- Paste a Wikipedia article URL — the system scrapes, summarizes, and generates a quiz.  
- Each question includes **difficulty levels** (Easy / Medium / Hard).

✅ **URL Validation & Preview**
- Live validation and preview before quiz generation.
- Displays article title and status (“Valid Wikipedia Article”).

✅ **Interactive Quiz Mode**
- Users can **take the quiz** or **view answers**.  
- Instant feedback (green for correct, red for incorrect).

✅ **History Management**
- All generated quizzes are stored in MySQL.  
- You can view previously generated quizzes instantly (cached for speed).

✅ **Caching**
- Prevents duplicate scraping and LLM calls for the same article.

✅ **Clean UI**
- Fully modular React components (`/components` and `/tabs`).  
- Responsive design with difficulty badges, color-coded results, and smooth animations.

---

## 🏗️ Tech Stack

### 💻 Frontend
- React (Vite)
- JavaScript (ES6+)
- Tailwind / Custom CSS
- Fetch API for backend communication

### ⚙️ Backend
- FastAPI (Python)
- LangChain + Google Gemini API
- SQLAlchemy ORM
- BeautifulSoup (for scraping)
- Requests, dotenv, JSON, Re

### 🗄️ Database
- MySQL

---

## 🧠 Architecture Overview

User → React Frontend → FastAPI Backend → LangChain + Gemini → Quiz JSON → MySQL


**Flow:**
1. User enters Wikipedia URL.
2. Backend validates & scrapes article content.
3. Gemini LLM generates quiz questions.
4. Result is parsed, stored in MySQL, and sent back to frontend.
5. Frontend displays interactive quiz UI with difficulty badges.

---

## 🧩 Folder Structure


**Flow:**
1. User enters Wikipedia URL.
2. Backend validates & scrapes article content.
3. Gemini LLM generates quiz questions.
4. Result is parsed, stored in MySQL, and sent back to frontend.
5. Frontend displays interactive quiz UI with difficulty badges.

---

## 🧩 Folder Structure

```bash
ai-quiz-generator/
├── backend/
│ ├── main.py # FastAPI entry point
│ ├── database.py # SQLAlchemy + MySQL setup
│ ├── scraper.py # Wikipedia content scraper
│ ├── llm_quiz_generator.py # Gemini integration + quiz generation
│ ├── requirements.txt
│ └── .env # API key + DB credentials
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── QuizDisplay/
│ │ │ │ ├── index.jsx
│ │ │ │ └── index.css
│ │ │ └── Modal/
│ │ │ ├── index.jsx
│ │ │ └── index.css
│ │ ├── tabs/
│ │ │ ├── GenerateQuizTab/
│ │ │ │ ├── index.jsx
│ │ │ │ └── index.css
│ │ │ └── HistoryTab/
│ │ │ ├── index.jsx
│ │ │ └── index.css
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── package.json
│ ├── vite.config.js
│ └── postcss.config.cjs
└── README.md
```

---


### 🧠 Example Output

Input:
https://en.wikipedia.org/wiki/Artificial_intelligence

```bash
Output:
{
  "title": "Artificial Intelligence Quiz",
  "summary": "Artificial intelligence is the simulation of human intelligence in machines...",
  "questions": [
    {
      "question": "What does AI stand for?",
      "options": ["Artificial Intelligence", "Automated Input", "Active Interface", "Augmented Insight"],
      "answer": "Artificial Intelligence",
      "difficulty": "easy"
    }
  ]
}
```
---

### 🎨 UI Preview (Screenshots)

### 👨‍💻 Developed By

#### Krushnajit Bhavar
#### DeepKlarity AI Assignment | 2025
#### Tech Stack: FastAPI • React • LangChain • Gemini • MySQL


---
### ⭐ “Turning knowledge into interactive learning — powered by AI.”