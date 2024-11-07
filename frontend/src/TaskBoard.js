import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Ensure this points to the correct file path
import './TaskBoard.css'; // Updated file name for clarity

const TaskBoard = () => {
  const [divisions, setDivisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1); // Pagination for lazy loading

  const fetchDivisionsData = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/division/divisions?page=${page}&limit=10`); // Adjusted to match '/divisions'
      const formattedDivisions = response.data.map(division => ({
        ...division,
        tasks: division.supportQueries?.map(query => ({ id: query._id, title: query.queryText })) || []
      }));
      if (page === 1) {
        setDivisions(formattedDivisions); // Replace data on first load
      } else {
        setDivisions(prevDivisions => prevDivisions.concat(formattedDivisions)); // Append data on subsequent loads
      }
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

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
      setPage(prevPage => prevPage + 1); // Load more data on scroll
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddQuery = async (queryText) => {
    setIsModalOpen(false);
    try {
      await axios.post('http://localhost:4000/api/customerIssue/submitIssue', { queryText }); // Adjusted to match 'submitIssue' route
      await fetchDivisionsData(1); // Refresh the division data after adding a query
    } catch (error) {
      console.error('Failed to add query:', error);
      setError(error);
    }
  };

  const handleDeleteQuery = async (queryId) => {
    try {
      await axios.post('http://localhost:4000/api/customerIssue/deleteIssue', { id: queryId }); // Adjusted to match 'deleteIssue' route
      // Optionally re-fetch divisions or update state after deleting
      await fetchDivisionsData(1);
    } catch (error) {
      console.error('Failed to delete query:', error);
      setError(error);
    }
  };

  if (isLoading && !divisions.length) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (!divisions.length) {
    return <div>No data found. Click "Add Query" to create a new query.</div>;
  }

  return (
    <>
      <div className="task-board-header">
        <button onClick={handleOpenModal}>Add Query</button>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleAddQuery} />
      <div className="title">
        Query Board
      </div>
      <div className="task-board">
        {divisions.map(division => (
          <div key={division._id} className="task-column">
            <h2>{division.name}</h2>
            {division.tasks.map(task => (
              <div key={task.id} className="task-card">
                <p>{task.title}</p>
                <button onClick={() => handleDeleteQuery(task.id)}>Delete Query</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskBoard;
