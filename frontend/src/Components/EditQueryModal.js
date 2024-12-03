import React, { useEffect, useState } from 'react';
import './Styles/EditQueryModal.css';

const EditQueryModal = ({ isOpen, onClose, query, onSubmit }) => {
    const [priority, setPriority] = useState("low");
    const [completed, setCompleted] = useState(false);
  
    // Set default values when the modal is opened or the query changes
    React.useEffect(() => {
      if (query) {
        setPriority(query.priority || "low");
        setCompleted(query.completed || false);
      }
    }, [query]);
  
    if (!isOpen || !query) return null;
  
    const handleSubmit = () => {
      const sanitizedData = {
        priority,
        completed, // Use the local completed state
      };
  
      onSubmit(query.id, sanitizedData); // Pass sanitized data to onSubmit
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>Edit Query</h2>
          <div>
            <label>Priority:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="checkbox-container">
            <input
                type="checkbox"
                id="completed-checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)} // Update the completed state
            />
            <label htmlFor="completed-checkbox">Completed</label>
            </div>
          <div className="modal-actions">
            <button onClick={handleSubmit}>Save</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default EditQueryModal;
  
