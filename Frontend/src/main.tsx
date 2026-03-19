import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing in index.html");
}

const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
);

