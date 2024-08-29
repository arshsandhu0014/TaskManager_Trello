// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTasks(response.data);
           
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks(); // Fetch tasks on mount
    }, []);

    return (
        <AuthContext.Provider value={{ tasks, fetchTasks }}>
            {children}
        </AuthContext.Provider>
    );
};
