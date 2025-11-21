import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        padding: "15px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
      }}
    >
      <Link to="/" style={{ marginRight: "20px" }}>Home</Link>

      {!token && (
        <>
          <Link to="/login" style={{ marginRight: "20px" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {token && (
        <>
          <Link to="/dashboard" style={{ marginRight: "20px" }}>Dashboard</Link>
          <Link to="/resume" style={{ marginRight: "20px" }}>Resume Analyzer</Link>
          <button onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}
