import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Sidebar from './Components/Sidebar'; // Include Sidebar here
import TaskManager from './Components/TaskManager';
import Settings from './Components/Settings';
import Reports from './Reports'

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar /> {/* Sidebar is now outside Routes to persist across all pages */}
        <div className="content" style={{ marginLeft: "200px" }}>
          <Routes>
            <Route path="/" element={<TaskManager />} /> {/* Dashboard */}
            <Route path="/settings" element={<Settings />} /> {/* Settings */}
            <Route path="/insights" element={<Reports />} /> {/* Insights */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
