import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import AppLoader from "./AppLoader";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppLoader />
    </AuthProvider>
  </React.StrictMode>
);
