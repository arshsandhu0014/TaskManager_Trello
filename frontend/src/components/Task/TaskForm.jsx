import React, { useState, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [column, setColumn] = useState('Todo'); // Default column
    const [showModal, setShowModal] = useState(false);

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
        setShowModal(false); // Close the modal
    };

    return (
        <>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                Add New Task
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTaskTitle">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Task Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTaskDescription">
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Task Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTaskColumn">
                            <Form.Label>Column</Form.Label>
                            <Form.Control
                                as="select"
                                value={column}
                                onChange={(e) => setColumn(e.target.value)}
                            >
                                <option value="Todo">Todo</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Done">Done</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Task
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TaskForm;
