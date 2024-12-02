import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Sidebar from './Components/Sidebar';
import TaskManager from './Components/TaskManager';
import Settings from './Components/Settings';
import Login from './Components/Login';
import Signup from './Components/Signup'; // Import Signup component

function App() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
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
