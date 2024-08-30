import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    // Function to fetch tasks from the server
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debugging log
            const response = await axios.get('https://task-manager-trello-backend.vercel.app/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Function to add a new task
    const addTask = async (task) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debugging log
            const response = await axios.post(
                'https://task-manager-trello-backend.vercel.app/tasks',
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
        }
    };

    // Function to update a task's column
    const updateTaskColumn = async (updatedTask) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debugging log
            const response = await axios.put(
                `https://task-manager-trello-backend.vercel.app/tasks/${updatedTask._id}/column`,
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
            console.error('Error updating task:', error);
        }
    };

    // Function to move a task to a different column
    const moveTask = async ({ id, fromColumn, toColumn }) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debugging log
            const response = await axios.put(
                `https://task-manager-trello-backend.vercel.app/tasks/${id}/column`,
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
        }
    };

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, setTasks, addTask, updateTaskColumn, moveTask, fetchTasks }}>
            {children}
        </TaskContext.Provider>
    );
};
