import React, { createContext, useState } from 'react';
import axios from 'axios';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const addTask = async (task) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debugging log
            const response = await axios.post(
                'http://localhost:3000/tasks',
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

    const updateTaskColumn = async (updatedTask) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debugging log
            const response = await axios.put(
                `http://localhost:3000/tasks/${updatedTask._id}`,
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

    const moveTask = async ({ id, fromColumn, toColumn }) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debugging log
            const response = await axios.put(
                `http://localhost:3000/tasks/${id}`,
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

    return (
        <TaskContext.Provider value={{ tasks, setTasks, addTask, updateTaskColumn, moveTask }}>
            {children}
        </TaskContext.Provider>
    );
};
