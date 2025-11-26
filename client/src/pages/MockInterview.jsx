import { useState, useRef } from "react";
import axios from "axios";
import API_URL from "../api/api";

export default function MockInterview() {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCount, setQuestionCount] = useState(1);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [parsedEvaluation, setParsedEvaluation] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const resultRef = useRef(null);

  // Remove numbering "1. " etc.
  const clean = (q) => q.replace(/^\s*\d+[\).\:-]?\s*/g, "").trim();

  // ------------------------------------------
  // GENERATE QUESTIONS
  // ------------------------------------------
  const generateQuestions = async () => {
    if (!role.trim()) {
      alert("Please enter a role.");
      return;
    }

    try {
      setLoading(true);
      setQuestions([]);
      setAnswers({});
      setParsedEvaluation(null);
      setScore(null);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/interview/generate`,
        { role, difficulty, questionCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const cleaned = res.data.questions
        .map((q) => clean(q))
        .filter((q) => q.length > 2)
        .slice(0, questionCount);

      setQuestions(cleaned);
    } catch (err) {
      console.error(err);
      alert("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  // EVALUATE INTERVIEW
  // ------------------------------------------
  const evaluateInterview = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/interview/evaluate`,
        {
          role,
          difficulty,
          questionCount,
          questions,
          answers: Object.values(answers),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScore(res.data.score);
      const parsed = parseEvaluation(res.data.evaluation);
      setParsedEvaluation(parsed);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate interview.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  // PARSE EVALUATION
  // ------------------------------------------
  const normalize = (content) => {
    return content.replace(/```(\w+)?\s*([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || "Code";
      return `\n${language}:\n${code.trim()}\n`;
    });
  };

  const parseEvaluation = (text) => {
    const parts = text.split(/Q\d+/).slice(1);

    const sections = parts.map((block, idx) => {
      const cleaned = block.replace(/Overall Summary[\s\S]*/i, "").trim();

      return {
        title: `Question ${idx + 1}`,
        content: normalize(cleaned),
        open: false,
      };
    });

    const summaryBlock = text.match(/Overall Summary[\s\S]*/i);
    const summary = summaryBlock ? normalize(summaryBlock[0]) : "Summary unavailable";

    return { sections, summary };
  };

  const toggle = (i) => {
    setParsedEvaluation((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, idx) =>
        idx === i ? { ...sec, open: !sec.open } : sec
      ),
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mock Interview</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Role:</label><br />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Frontend Developer, Backend Developer, SDE1, Java Developer"
          style={{ padding: "8px", width: "300px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Number of Questions:</label><br />
        <select
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          style={{ padding: "8px", width: "200px" }}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Difficulty:</label><br />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button
        onClick={generateQuestions}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: loading ? "#999" : "#000",
          color: "white",
          cursor: "pointer",
          border: "none"
        }}
      >
        {loading ? "Generating..." : "Generate Questions"}
      </button>

      {questions.length > 0 && (
        <div style={{ marginTop: "25px" }}>
          <h3>Interview Questions</h3>

          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: "25px" }}>
              <p style={{ fontWeight: "bold" }}>
                {i + 1}. {q}
              </p>

              <textarea
                rows={4}
                style={{ width: "100%", maxWidth: "600px", padding: "10px" }}
                placeholder="Write your answer..."
                value={answers[i] || ""}
                onChange={(e) =>
                  setAnswers({ ...answers, [i]: e.target.value })
                }
              />
            </div>
          ))}

          <button
            onClick={evaluateInterview}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: loading ? "#999" : "darkred",
              color: "white",
              cursor: "pointer",
              border: "none"
            }}
          >
            {loading ? "Evaluating..." : "Submit for Evaluation"}
          </button>
        </div>
      )}

      {parsedEvaluation && (
        <div ref={resultRef} style={{ marginTop: "30px", whiteSpace: "pre-wrap" }}>
          <h3>Evaluation Result</h3>
          <p><strong>Score:</strong> {score}/100</p>

          {parsedEvaluation.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <div
                onClick={() => toggle(i)}
                style={{
                  cursor: "pointer",
                  padding: "6px",
                  background: "#eee",
                  fontWeight: "bold"
                }}
              >
                {sec.title} {sec.open ? "▲" : "▼"}
              </div>

              {sec.open && (
                <div
                  style={{
                    padding: "12px",
                    border: "1px solid #ccc",
                    background: "white"
                  }}
                >
                  {sec.content}
                </div>
              )}
            </div>
          ))}

          <h3>Overall Summary</h3>
          <div
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              background: "#fafafa"
            }}
          >
            {parsedEvaluation.summary}
          </div>
        </div>
      )}
    </div>
  );
}
