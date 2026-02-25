import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";          // unused? consider removing or streamlining
import "./index.css";
import { AuthProvider } from "./authcontext.jsx";
import ProjectRoutes from "./Routes.jsx";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Router>
      <ProjectRoutes />
    </Router>
  </AuthProvider>
);
