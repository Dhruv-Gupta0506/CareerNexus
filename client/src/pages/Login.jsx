import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✔ Save JWT token
      localStorage.setItem("token", data.token);

      alert("Login Successful!");
      console.log(data);

      // ✔ Redirect to Dashboard
      window.location.href = "/dashboard";

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            style={{ padding: "8px", width: "250px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            style={{ padding: "8px", width: "250px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
