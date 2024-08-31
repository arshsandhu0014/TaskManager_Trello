import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track error state

   
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            
          
            const response = await axios.get('https://taskmanager-trello.onrender.com/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    // Function to add a new task
    const addTask = async (task) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            console.log('Adding task with token:', token); // Debugging log
            const response = await axios.post(
                'https://taskmanager-trello.onrender.com/tasks',
                task,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            setTasks([...tasks, response.data]);
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task');
        }
    };

    // Function to update a task's column
    const updateTaskColumn = async (updatedTask) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            
            const response = await axios.put(
                `https://taskmanager-trello.onrender.com/tasks/${updatedTask._id}/column`,
                { column: updatedTask.column },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === updatedTask._id ? response.data : task
                )
            );
        } catch (error) {
            console.error('Error updating task column:', error);
            setError('Failed to update task');
        }
    };

    // Function to move a task to a different column
    const moveTask = async ({ id, toColumn }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

           
            const response = await axios.put(
                `https://taskmanager-trello.onrender.com/tasks/${id}/column`,
                { column: toColumn },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === id ? response.data : task
                )
            );
        } catch (error) {
            console.error('Error moving task:', error);
            setError('Failed to move task');
        }
    };

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, setTasks, addTask, updateTaskColumn, moveTask, fetchTasks, loading, error }}>
            {children}
        </TaskContext.Provider>
    );
};
