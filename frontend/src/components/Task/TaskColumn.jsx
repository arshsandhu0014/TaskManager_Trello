import React, { useContext, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { TaskContext } from '../../context/TaskContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Form, Modal } from 'react-bootstrap';

const TaskColumn = ({ columnName, tasks }) => {
    const { fetchTasks } = useContext(TaskContext);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({ title: '', description: '' });
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleEditTask = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:3000/tasks/${editingTaskId}`,
                editedTask,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            setShowEditModal(false);
            setEditingTaskId(null);
            fetchTasks(); // Refresh tasks after editing
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const handleEditClick = (task) => {
        setEditedTask({
            title: task.title,
            description: task.description
        });
        setEditingTaskId(task._id);
        setShowEditModal(true);
    };

    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/tasks/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                fetchTasks(); // Refresh tasks after deletion
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleShowDetails = (task) => {
        setSelectedTask(task);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedTask(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingTaskId(null);
    };

    return (
        <Droppable droppableId={columnName}>
            {(provided) => (
                <div
                    className="d-flex flex-column mx-4 task-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h2>{columnName}</h2>
                    {tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided) => (
                                <div
                                    className="mb-3"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{task.title}</Card.Title>
                                            <Card.Text>{task.description}</Card.Text>
                                            <Button
                                                variant="info"
                                                onClick={() => handleShowDetails(task)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant="warning"
                                                onClick={() => handleEditClick(task)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteTask(task._id)}
                                            >
                                                Delete
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Modal for displaying task details */}
                    <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Task Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedTask && (
                                <div>
                                    <h4>{selectedTask.title}</h4>
                                    <p>{selectedTask.description}</p>
                                    <p><strong>Created At:</strong> {selectedTask.createdAt}</p>
                                    <p><strong>Due Date:</strong> {selectedTask.dueDate}</p>
                                    {/* Add more fields as needed */}
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseDetailsModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal for editing tasks */}
                    <Modal show={showEditModal} onHide={handleCloseEditModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group>
                                    <Form.Control
                                        type="text"
                                        value={editedTask.title}
                                        onChange={(e) =>
                                            setEditedTask({ ...editedTask, title: e.target.value })
                                        }
                                        placeholder="Edit title"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        value={editedTask.description}
                                        onChange={(e) =>
                                            setEditedTask({ ...editedTask, description: e.target.value })
                                        }
                                        placeholder="Edit description"
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEditModal}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleEditTask}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </Droppable>
    );
};

export default TaskColumn;
