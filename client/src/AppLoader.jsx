import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import App from "./App";

export default function AppLoader() {
  const { loading } = useAuth();

  // ⛔ Stop rendering EVERYTHING until token finishes loading
  if (loading) return null;

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
