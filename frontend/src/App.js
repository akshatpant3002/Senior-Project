import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Sidebar from './Components/Sidebar';
import TaskManager from './Components/TaskManager';
import Settings from './Components/Settings';
import Reports from './Reports';
import Login from './Components/Login';
import Signup from './Components/Signup';

function App() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Retrieve login state from localStorage on app load
  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn");
    if (storedLoginState === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true"); // Save login state to localStorage
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn"); // Remove login state from localStorage
  };

  return (
    <Router>
      {isLoggedIn ? (
        // Main layout with sidebar and routes after login
        <div className="app">
          <Sidebar handleLogout={handleLogout} /> {/* Pass logout handler to Sidebar */}
          <div className="content" style={{ marginLeft: "200px" }}>
            <Routes>
              <Route path="/" element={<TaskManager />} /> {/* Dashboard */}
              <Route path="/settings" element={<Settings />} /> {/* Settings */}
              <Route path="/insights" element={<Reports />} /> {/* Insights */}
              <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
            </Routes>
          </div>
        </div>
      ) : (
        // Login page before authentication
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to login */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
