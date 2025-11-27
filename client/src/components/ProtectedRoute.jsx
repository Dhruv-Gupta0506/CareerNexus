import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  // 🚀 DO NOT REMOVE THIS
  if (loading) return null;

  if (!token) return <Navigate to="/" replace />;

  return children;
}
