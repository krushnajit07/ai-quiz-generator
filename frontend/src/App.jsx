import { useState } from "react";
import GenerateQuizTab from "./tabs/GenerateQuizTab";
import HistoryTab from "./tabs/HistoryTab";
import "./App.css";

function App() {
  const [tab, setTab] = useState("generate");

  return (
    <div className="app-container">
      <h1 className="app-title">AI Wiki Quiz Generator</h1>

      <nav className="app-nav">
        <button
          className={`nav-button ${tab === "generate" ? "active" : ""}`}
          onClick={() => setTab("generate")}
        >
          Generate Quiz
        </button>
        <button
          className={`nav-button ${tab === "history" ? "active" : ""}`}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </nav>

      <div className="tab-content">
        {tab === "generate" ? <GenerateQuizTab /> : <HistoryTab />}
      </div>
    </div>
  );
}

export default App;
