import React, { useContext, useState, useMemo } from 'react';
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
    const [searchQuery] = useState('');
    const [sortOption, setSortOption] = useState('newest');

    const handleEditTask = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `https://taskmanager-trello.onrender.com/tasks/${editingTaskId}`,
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
                await axios.delete(`https://taskmanager-trello.onrender.com/tasks/${taskId}`, {
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

    // Filtered and sorted tasks
    const filteredAndSortedTasks = useMemo(() => {
        const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filteredTasks.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            if (sortOption === 'newest') {
                return dateB - dateA;
            } else if (sortOption === 'oldest') {
                return dateA - dateB;
            }
            return 0;
        });
    }, [tasks, searchQuery, sortOption]);

    // Get column-specific styles
    const getColumnStyle = () => {
        switch (columnName) {
            case 'Todo':
                return { backgroundColor: '#f8d7da', borderColor: '#f5c6cb' };
            case 'InProgress':
                return { backgroundColor: '#fff3cd', borderColor: '#ffeeba' };
            case 'Done':
                return { backgroundColor: '#d4edda', borderColor: '#c3e6cb' };
            default:
                return {};
        }
    };

    return (
        <Droppable droppableId={columnName}>
            {(provided) => (
                <div
                    className="task-column bg-light border border-secondary rounded p-2 mb-4 mx-2"
                    style={{ ...getColumnStyle(), width: '100%', minWidth: '15rem' }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h2 className='text-center mb-3'>{columnName}</h2>

                    {/* Sort option */}
                    <Form.Group className="mb-3">
                        <Form.Label>Sort by:</Form.Label>
                        <Form.Control
                            as="select"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </Form.Control>
                    </Form.Group>

                    {filteredAndSortedTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided) => (
                                <div
                                    className="mb-3"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <Card style={{ ...getColumnStyle(), borderRadius: '8px',width: '18rem' }}>
                                        <Card.Body>
                                            <Card.Title>{task.title}</Card.Title>
                                            <Card.Text>{task.description}</Card.Text>
                                            <div className='d-flex flex-column flex-sm-row justify-content-between'>
                                                <Button
                                                    variant="light"
                                                    onClick={() => handleShowDetails(task)}
                                                    className="mb-2 mb-sm-0"
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="warning"
                                                    onClick={() => handleEditClick(task)}
                                                    className="mb-2 mb-sm-0"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteTask(task._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
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
                    <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Task Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedTask.title}
                                        onChange={(e) =>
                                            setEditedTask({ ...editedTask, title: e.target.value })
                                        }
                                        placeholder="Edit title"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Task Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={editedTask.description}
                                        onChange={(e) =>
                                            setEditedTask({ ...editedTask, description: e.target.value })
                                        }
                                        placeholder="Edit description"
                                        rows={3}
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
