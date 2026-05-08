import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function start() {
  try {
    const response = await fetch(`${API_BASE}/api/bootstrap`);
    if (response.ok) {
      window.__ACADEMIC_DMS_DATA__ = await response.json();
    }
  } catch {
    window.__ACADEMIC_DMS_DATA__ = undefined;
  }

  const { default: App } = await import("./App.jsx");
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

start();
