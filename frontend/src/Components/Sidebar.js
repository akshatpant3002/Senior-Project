import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">Dashboard</Link></li> {/* Link to Dashboard */}
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/settings">Settings</Link></li> {/* Link to Settings */}
      </ul>
    </div>
  );
};

export default Sidebar;
