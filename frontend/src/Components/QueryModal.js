import React, { useState } from 'react';
import './Styles/QueryModal.css';

const QueryModal = ({ isOpen, onClose, onSubmit }) => {
  const [queryText, setQueryText] = useState('');
  const [priority, setPriority] = useState('low'); // Default priority

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (queryText.trim() === '') {
      alert('Query description cannot be empty.');
      return;
    }

    onSubmit(queryText, priority); // Pass queryText and priority to parent
    setQueryText(''); // Clear the query text input
    setPriority('low'); // Reset priority to default
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Add a New Query</h2>
        <textarea
          placeholder="Enter your query description"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <div className="priority-selector">
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default QueryModal;
