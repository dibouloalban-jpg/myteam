import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TeamPage from "./pages/TeamPage";
import TaskPage from "./pages/TaskPage";

export default function App() {
  return (
    <div>
      <Toaster position="top-right" />
      
      {/* Navigation de démo: tu peux la retirer si tu as déjà ton header/menu */}
      <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/">Home</Link>
        <Link to="/auth">Auth</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/team">Team</Link>
        <Link to="/task">Task</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Si TeamPage/TaskPage gèrent des sous-routes, on peut laisser le wildcard */}
        <Route path="/team/*" element={<TeamPage />} />
        <Route path="/task/*" element={<TaskPage />} />

        {/* Redirections utiles depuis des anciens liens hash éventuels */}
        <Route path="/#/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/#/auth" element={<Navigate to="/auth" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}