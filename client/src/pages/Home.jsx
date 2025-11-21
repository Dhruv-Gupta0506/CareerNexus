import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>CareerNexus</h1>
      <p>Your AI-powered career assistant.</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
