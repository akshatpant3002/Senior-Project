import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Sidebar.css";

const Sidebar = ({ handleLogout }) => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">Tasks</Link></li>
        <li><Link to="/insights">Insights</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Sidebar;
