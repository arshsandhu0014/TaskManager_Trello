import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null); // To manage the user state
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To manage error state

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get('https://taskmanager-trello.onrender.com/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setTasks(response.data);
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error fetching tasks:', error.response.data);
                setError(`Failed to fetch tasks: ${error.response.data.message || 'Please try again later.'}`);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error fetching tasks: No response received', error.request);
                setError('Failed to fetch tasks: No response from server.');
            } else {
                // Other errors (e.g., network issues)
                console.error('Error fetching tasks:', error.message);
                setError(`Failed to fetch tasks: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    useEffect(() => {
        loadUser(); // Load user from localStorage on mount
        if (localStorage.getItem('token')) {
            fetchTasks(); // Fetch tasks if token is present
        } else {
            setLoading(false); // Stop loading if no token
        }
    }, []);

    return (
        <AuthContext.Provider value={{ tasks, fetchTasks, user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
