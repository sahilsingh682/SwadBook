import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Hide preloader once app mounts
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader")?.classList.add("loaded");
  }, 1200);

  // Register PWA Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("Service worker registration failed:", err);
    });
  }
});
