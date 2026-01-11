const API_BASE = "http://127.0.0.1:8000";

export async function generateQuiz(url) {
  const res = await fetch(`${API_BASE}/generate_quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Failed to generate quiz");
  return await res.json();
}

export async function getHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error("Failed to load history");
  return await res.json();
}

export async function getQuizById(id) {
  const res = await fetch(`${API_BASE}/quiz/${id}`);
  if (!res.ok) throw new Error("Failed to load quiz");
  return await res.json();
}

export async function previewURL(url) {
  const res = await fetch(`${API_BASE}/preview_url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Invalid URL");
  }
  return await res.json();
}
