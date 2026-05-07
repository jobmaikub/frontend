import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContexts";

createRoot(document.getElementById("root")!).render(
  <App />
);
