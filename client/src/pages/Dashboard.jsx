import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        "Authorization": token
      }
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {!user ? (
        <p>Loading user...</p>
      ) : (
        <div style={{ marginTop: "10px" }}>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}
