import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import App from "./App";
import LoadingScreen from "./components/LoadingScreen"; // Import the new component

export default function AppLoader() {
  const { loading } = useAuth();

  // ✅ FIX: Show visual loader instead of blank screen while checking token
  if (loading) {
    return <LoadingScreen fullscreen={true} />;
  }

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}