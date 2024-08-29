import React, { useContext, useState } from 'react';
import axios from 'axios';
import { TaskContext } from '../../context/TaskContext';

const TaskComponent = ({ task }) => {
    const { updateTaskColumn, fetchTasks } = useContext(TaskContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({ title: task.title, description: task.description });

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

    const handleEditTask = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3000/tasks/${task._id}`,
                editedTask,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            setIsEditing(false);
            fetchTasks(); // Refresh tasks after editing
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/tasks/${task._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            fetchTasks(); // Refresh tasks after deletion
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="task-item h-25 w-25 ">
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <small>{task.column}</small>
            <small>{task.createdAt}</small>
            <button>edit</button>
            <div className="task-actions">
                <button onClick={() => alert('Edit button clicked')}>Edit</button>
                <button onClick={() => alert('Delete button clicked')}>Delete</button>
            </div>
        </div>
    );
};

export default TaskComponent;
