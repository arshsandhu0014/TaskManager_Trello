import React, { useContext } from 'react';
import axios from 'axios';
import { TaskContext } from '../../context/TaskContext';

const TaskComponent = ({ task }) => {
    const { updateTaskColumn } = useContext(TaskContext);

    const handleColumnChange = async (newColumn) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3000/tasks/${task._id}/column`,
                { column: newColumn },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            updateTaskColumn(response.data);
        } catch (error) {
            console.error('Error updating task column:', error);
        }
    };

    return (
        <div
            draggable
            onDragEnd={(e) => handleColumnChange(/* newColumn value based on drop */)}
            className="task-item"
        >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <small>{task.column}</small>
        </div>
    );
};

export default TaskComponent;
