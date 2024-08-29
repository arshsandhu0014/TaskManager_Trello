import axios from 'axios';

const API_URL = '/api/tasks/';

const getTasks = async () => {
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        }
    });
    return response.data;
};

const createTask = async (task) => {
    const response = await axios.post(API_URL, task, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        }
    });
    return response.data;
};

const updateTask = async (id, task) => {
    const response = await axios.put(`${API_URL}${id}`, task, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        }
    });
    return response.data;
};

const deleteTask = async (id) => {
    const response = await axios.delete(`${API_URL}${id}`, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        }
    });
    return response.data;
};

export default {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
