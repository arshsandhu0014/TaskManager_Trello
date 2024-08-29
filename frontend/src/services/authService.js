import axios from 'axios';

const API_URL = '/api/auth/';

const register = async (firstName, lastName, username, password) => {
    try {
        const response = await axios.post( 'register', {
            firstName,
            lastName,
            username,
            password,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error registering user');
    }
};

const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + 'login', {
            username,
            password,
        });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error logging in');
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
};
