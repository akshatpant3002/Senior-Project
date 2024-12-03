import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./Styles/Signup.css";

const Signup = () => {
  const [companyEmail, setCompanyEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const navigate = useNavigate(); // Initialize navigate function

  const handleSignup = () => {
    if (companyEmail && firstName && lastName && department && employeeId) {
      alert("Your request has been submitted for approval!");
      navigate("/"); // Redirect to the login page
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="signup-container">
      <h1>Request Access</h1>
      <p>
        Please fill out the form below to request access. Your request will be
        sent to the administrators for approval.
      </p>
      <div className="signup-form">
        <input
          type="email"
          placeholder="Company Email"
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Legal First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Legal Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Customer Service">Customer Service</option>
          <option value="Finance">Finance</option>
          <option value="Legal">Legal</option>
        </select>
        <button onClick={handleSignup}>Submit Request</button>
      </div>
      <p className="login-link">
        Already authorized? <Link to="/">Access Login Portal</Link>
      </p>
    </div>
  );
};

export default Signup;
