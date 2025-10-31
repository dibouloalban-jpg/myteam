import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <main style={{ padding: 16 }}>
      <h1>Dashboard</h1>
      <p>Vue d’ensemble.</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => navigate("/team")}>Voir Team</button>
        <button onClick={() => navigate("/task")}>Voir Task</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <Link to="/">Home</Link>
      </div>
    </main>
  );
}