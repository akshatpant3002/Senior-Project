import React, { useState } from 'react';
import './Styles/Modal.css';  

const QueryModal = ({ isOpen, onClose, onSubmit }) => {
  const [queryText, setQueryText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(queryText);
    setQueryText(''); // Clear the input after submission
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Add a New Query</h2>
        <input
          type="text"
          placeholder="Enter your query"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default QueryModal;
