import { useState } from "react";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (selected && selected.type !== "application/pdf") {
      alert("Only PDF files are allowed!");
      e.target.value = ""; 
      return;
    }

    setFile(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    alert("PDF uploaded successfully (backend API not added yet)");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resume Analyzer</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        
        {/* Label + Input */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Select Resume (PDF only):
          </label>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ padding: "5px" }}
          />
        </div>

        {/* Show selected file name */}
        {file && (
          <p style={{ marginBottom: "20px", color: "green" }}>
            Selected File: <b>{file.name}</b>
          </p>
        )}

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Analyze Resume
        </button>
      </form>
    </div>
  );
}
