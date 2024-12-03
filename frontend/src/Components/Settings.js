import React, { useState } from "react";
import "./Styles/Settings.css";

const mockUsers = {
  IT: [
    "Alice Johnson", "Bob Smith", "Charlie Brown", "Derek Lee", "Ella Wilson",
    "Felicity Harper", "Gregory Miles", "Hannah Adams", "Isla Fisher",
    "Jack Monroe",
  ],
  HR: [
    "Dana White", "Evan Taylor", "Fiona Green", "George King", "Helen Adams",
    "Ivy Bell", "Jake Hill", "Karen Brooks", "Laura Chen", "Martin Lewis",
  ],
  "Customer Service": [
    "Noah Walker", "Olivia Parker", "Patrick Cruz", "Quinn Rivers", "Rachel Evans",
    "Sophia Young", "Thomas Garcia", "Uma Patel", "Victor Gomez", "Willow Hayes",
  ],
};

const Settings = () => {
  const [departments, setDepartments] = useState(mockUsers);

  const handleInviteUser = (department) => {
    const userName = prompt(`Enter the new user's name for the ${department} department:`);
    const userEmail = prompt(`Enter the email for ${userName}:`);
    if (userName && userEmail) {
      setDepartments({
        ...departments,
        [department]: [...departments[department], `${userName} (${userEmail})`],
      });
      alert("Email sent");
    }
  };

  const handleRemoveUser = (department, user) => {
    setDepartments({
      ...departments,
      [department]: departments[department].filter((u) => u !== user),
    });
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <p>Manage users in each department. Invite users or remove them from the list.</p>
      <div className="departments">
        {Object.keys(departments).map((department) => (
          <div key={department} className="department-card">
            <h2>{department}</h2>
            <ul>
              {departments[department].map((user) => (
                <li key={user} className="user-item">
                  {user}
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveUser(department, user)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="add-btn"
              onClick={() => handleInviteUser(department)}
            >
              Invite User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
