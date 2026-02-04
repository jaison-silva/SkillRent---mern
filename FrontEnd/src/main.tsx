import React from "react";
import reactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { AuthInitializer } from "./api/authInitializer";

reactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AuthInitializer />
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </AuthProvider>,
);
