import React from "react";
import './Styles/TaskManager.css'; // Import TaskManager-specific styles
import TaskBoard from './TaskBoard';

const TaskManager = () => {
  return (
    <div className="task-manager-container">
      <div className="content">
        <TaskBoard />
      </div>
    </div>
  );
};

export default TaskManager;
