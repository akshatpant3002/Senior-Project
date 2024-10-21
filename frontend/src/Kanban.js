import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Ensure this points to the correct file path
import './TaskBoard.css'; // Updated file name for clarity

const TaskBoard = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1); // Pagination for lazy loading

  const fetchDepartmentsData = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/department/departments?page=${page}&limit=10`); // Add pagination
      const formattedDepartments = response.data.map(dept => ({
        ...dept,
        tasks: dept.supportQueries.map(query => ({ id: query._id, title: query.queryText }))
      }));
      if (page === 1) {
        setDepartments(formattedDepartments); // Replace data on first load
      } else {
        setDepartments(prevDepartments => prevDepartments.concat(formattedDepartments)); // Append data on subsequent loads
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentsData(page);
  }, [page]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target.scrollingElement;
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
      await axios.post('http://localhost:4000/api/query/createQuery', { queryText });
      await fetchDepartmentsData(1); // Refresh the department data after adding a query
    } catch (error) {
      console.error('Failed to add query:', error);
      setError(error);
    }
  };

  const handleCreateDepartment = async (departmentName) => {
    try {
      const response = await axios.post('http://localhost:4000/api/department/createDepartment', {
        name: departmentName
      });
      if (response.data) {
        setDepartments([...departments, response.data]);
      }
    } catch (error) {
      console.error('Failed to create department:', error);
      setError(error);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      await axios.delete(`http://localhost:4000/api/department/departments/${departmentId}`);
      setDepartments(departments.filter(dept => dept._id !== departmentId));
    } catch (error) {
      console.error('Failed to delete department:', error);
      setError(error);
    }
  };

  if (isLoading && !departments.length) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (!departments.length) {
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
        {departments.map(department => (
          <div key={department._id} className="task-column">
            <h2>{department.name}</h2>
            {department.tasks.map(task => (
              <div key={task.id} className="task-card">
                <p>{task.title}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskBoard;
