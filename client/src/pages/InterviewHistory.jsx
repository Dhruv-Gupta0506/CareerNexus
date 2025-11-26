import { useEffect, useState, useRef } from "react";
import axios from "axios";
import API_URL from "../api/api";

export default function InterviewHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [parsedEvaluation, setParsedEvaluation] = useState(null);

  const resultRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/interview/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHistory(res.data.history);
      } catch (err) {
        console.error(err);
        alert("Failed to load interview history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ---- Normalizer ----
  const normalize = (content) =>
    content.replace(/```(\w+)?\s*([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || "Code";
      return `\n${language}:\n${code.trim()}\n`;
    });

  const parseEvaluation = (text) => {
    const parts = text.split(/Q\d+/).slice(1);

    const sections = parts.map((part, index) => {
      const cleaned = part.replace(/Overall Summary[\s\S]*/i, "").trim();
      return {
        title: `Question ${index + 1}`,
        content: normalize(cleaned),
        open: false,
      };
    });

    const summaryBlock = text.match(/Overall Summary[\s\S]*/i);
    const summary = summaryBlock
      ? normalize(summaryBlock[0])
      : "Summary unavailable";

    return { sections, summary };
  };

  const handleSelect = (item) => {
    setSelected(item);
    setParsedEvaluation(parseEvaluation(item.evaluationText));

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const toggle = (i) => {
    setParsedEvaluation((prev) => ({
      ...prev,
      sections: prev.sections.map((sec, idx) =>
        idx === i ? { ...sec, open: !sec.open } : sec
      ),
    }));
  };

  if (loading)
    return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Interview History</h2>

      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul>
          {history.map((item) => (
            <li
              key={item._id}
              style={{
                margin: "10px 0",
                cursor: "pointer",
                textDecoration: "underline",
                color: selected?._id === item._id ? "darkblue" : "blue"
              }}
              onClick={() => handleSelect(item)}
            >
              🎤 {item.role} — {item.difficulty.toUpperCase()} —
              Score: {item.score}/100 — {new Date(item.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      {selected && parsedEvaluation && (
        <div ref={resultRef} style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          <h3>Interview Details</h3>
          <p><strong>Role:</strong> {selected.role}</p>
          <p><strong>Difficulty:</strong> {selected.difficulty}</p>
          <p><strong>Score:</strong> {selected.score}/100</p>
          <p><strong>Date:</strong> {new Date(selected.createdAt).toLocaleString()}</p>

          <h3 style={{ marginTop: "20px" }}>Per Question Feedback</h3>

          {parsedEvaluation.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: "15px" }}>
              <div
                onClick={() => toggle(i)}
                style={{
                  padding: "6px",
                  cursor: "pointer",
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

          <button
            onClick={() => {
              setSelected(null);
              setParsedEvaluation(null);
            }}
            style={{ marginTop: "15px", padding: "8px 12px" }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
