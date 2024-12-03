import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './QueryModal'; // Ensure this points to the correct file path
import _ from 'lodash'; // Install lodash: npm install lodash
import './Styles/TaskBoard.css'; // Updated file name for clarity

const TaskBoard = () => {
  const [divisions, setDivisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const fetchDivisionsData = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/division/divisions?page=${page}&limit=10`);
      const formattedDivisions = response.data.map(division => ({
        ...division,
        tasks: division.customerIssues?.map(issue => ({
          id: issue._id,
          title: issue.issueDescription,
          submittedAt: issue.submittedAt,
          priority: issue.priority, // Include priority
          completed: issue.completed, // Include completed status
        })) || [],
      }));
  
      setDivisions(formattedDivisions); // Set the formatted data to state
    } catch (error) {
      console.error('Error fetching divisions:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisionsData(page);
  }, [page]);

  const handleScroll = _.throttle(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, 300);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddQuery = async (description, priority = "low") => {
    try {
      const payload = {
        description,
        priority,
      };
  
      console.log("Adding query with payload:", payload);
  
      const response = await axios.post(
        "http://localhost:4000/api/customerIssue/submitIssue",
        payload
      );
  
      if (response.status === 201) {
        console.log("Query added successfully:", response.data);
  
        const newQuery = {
          id: response.data.issueId,
          title: description,
          submittedAt: new Date().toISOString(),
          priority,
          completed: false, // Default value for completed status
        };
  
        setDivisions((prevDivisions) =>
          prevDivisions.map((division) =>
            division.title === response.data.team.title
              ? { ...division, tasks: [...division.tasks, newQuery] }
              : division
          )
        );
  
        setIsModalOpen(false);
      } else {
        console.error("Failed to add query. Response status:", response.status);
        setError(new Error("Failed to add query. Please try again later."));
      }
    } catch (error) {
      console.error("Failed to add query:", error.response?.data || error.message);
      setError(error);
    }
  };

  const handleDeleteQuery = async (queryId) => {
    try {
      const response = await axios.delete(
        "http://localhost:4000/api/customerIssue/deleteIssue",
        {
          data: { issueId: queryId },
        }
      );
  
      if (response.status === 200) {
        console.log("Query deleted successfully:", response.data);
  
        setDivisions((prevDivisions) =>
          prevDivisions.map((division) => ({
            ...division,
            tasks: division.tasks.filter((task) => task.id !== queryId),
          }))
        );
      } else {
        console.error("Failed to delete query. Response status:", response.status);
      }
    } catch (error) {
      console.error("Failed to delete query:", error.response?.data || error.message);
    }
  };

  const handleToggleCompleted = async (queryId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Toggle completed status
      const payload = {
        issueId: queryId,
        completed: updatedStatus,
      };
  
      console.log("Updating completed status with payload:", payload);
  
      const response = await axios.patch(
        "http://localhost:4000/api/customerIssue/updateStatus",
        payload
      );
  
      if (response.status === 200) {
        console.log("Completed status updated successfully:", response.data);
  
        // Update the state with the new completed status
        setDivisions((prevDivisions) =>
          prevDivisions.map((division) => ({
            ...division,
            tasks: division.tasks.map((task) =>
              task.id === queryId ? { ...task, completed: updatedStatus } : task
            ),
          }))
        );
      } else {
        console.error("Failed to update completed status. Response status:", response.status);
      }
    } catch (error) {
      console.error("Failed to update completed status:", error.response?.data || error.message);
    }
  };
  

  if (isLoading && !divisions.length) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!divisions.length) return <div>No data found. Click "Add Query" to create a new query.</div>;

  return (
    <div className="content">
      <div className="task-board-header">
        <button onClick={handleOpenModal}>Add Query</button>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleAddQuery} />
      <div className="title">Task Board</div>
      <div className="task-board">
        {divisions.map(division => (
          <div key={division._id} className="task-column">
            <h2>{division.title}</h2>
            {division.tasks.map(task => (
              <div key={task.id} className="task-card">
                <p><strong>Query:</strong> {task.title}</p>
                <p><strong>Priority:</strong> <span style={{ color: getPriorityColor(task.priority) }}>{task.priority}</span></p>
                <p><strong>Completed:</strong> {task.completed ? "Yes" : "No"}</p>
                <p><strong>Submitted at:</strong> {new Date(task.submittedAt).toLocaleString()}</p>
                <button onClick={() => handleDeleteQuery(task.id)}>Delete Query</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to style priority colors
const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case "low":
      return "green";
    case "medium":
      return "orange";
    case "high":
      return "red";
    default:
      return "black";
  }
};

export default TaskBoard;
