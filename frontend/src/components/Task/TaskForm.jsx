import React, { useState, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [column, setColumn] = useState('Todo'); // Default column

    const { addTask } = useContext(TaskContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.trim() === '') return;

        const newTask = {
            title,
            description,
            column,
        };

        await addTask(newTask);
        setTitle('');
        setDescription('');
        setColumn('Todo'); // Reset to default column
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h2>Add New Task</h2>
            <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <select value={column} onChange={(e) => setColumn(e.target.value)}>
                <option value="Todo">Todo</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskForm;
