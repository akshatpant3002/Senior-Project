import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Styles/Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (username && password) {
      onLogin();
    } else {
      alert("Please enter both username and password");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Login</button>
      </div>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Request Access</Link>
      </p>
    </div>
  );
};

export default Login;
