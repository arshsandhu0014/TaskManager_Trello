// routes/taskRoutes.js
const express = require('express');
const {
    getTasks,
    createTask,
    updateTask,
    updateTaskColumn,
    deleteTask,
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware'); // Updated import
const router = express.Router();

router.route('/')
    .get(protect, getTasks) // Ensure that the user is authenticated before getting tasks
    .post(protect, createTask); // Ensure that the user is authenticated before creating a task

router.route('/:id')
    .put(protect, updateTask) // Ensure that the user is authenticated before updating a task
    .delete(protect, deleteTask); // Ensure that the user is authenticated before deleting a task

router.route('/:id/column')
    .put(protect, updateTaskColumn); // Ensure that the user is authenticated before updating task column

module.exports = router;
