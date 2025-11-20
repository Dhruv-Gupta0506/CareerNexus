import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="text-3xl p-10">Home Page</div>} />
      <Route path="/login" element={<div className="text-3xl p-10">Login Page</div>} />
      <Route path="/dashboard" element={<div className="text-3xl p-10">Dashboard</div>} />
    </Routes>
  );
}
