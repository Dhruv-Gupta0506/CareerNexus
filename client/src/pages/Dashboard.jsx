import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          logout(); // token expired or invalid
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .catch((err) => console.error("FETCH USER ERROR:", err));
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {!user ? (
        <p>Loading user...</p>
      ) : (
        <div style={{ marginTop: "10px" }}>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          {user.avatar && (
            <img 
              src={user.avatar}
              alt="Avatar"
              style={{ width: "80px", borderRadius: "50%", marginTop: "10px" }}
            />
          )}
        </div>
      )}

      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
