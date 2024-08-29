// src/components/Dashboard/Dashboard.js

import React, { useContext, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskColumn from '../components/Task/TaskColumn';
import TaskForm from '../components/Task/TaskForm';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';

const Dashboard = () => {
    const { tasks, fetchTasks } = useContext(AuthContext);
    const { moveTask } = useContext(TaskContext);

    useEffect(() => {
        fetchTasks(); // Fetch tasks when the component mounts
    }, [fetchTasks]);

    const todoTasks = tasks.filter(task => task.column === 'Todo');
    const inProgressTasks = tasks.filter(task => task.column === 'InProgress');
    const doneTasks = tasks.filter(task => task.column === 'Done');

    // Update the task state in the backend and reflect changes in real-time
    const onDragEnd = useCallback(async (result) => {
        const { destination, source, draggableId } = result;

        // Exit if there's no destination
        if (!destination) return;

        // Exit if the item is dropped in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Move the task to a new column
        await moveTask({
            id: draggableId,
            fromColumn: source.droppableId,
            toColumn: destination.droppableId,
        });

        // Fetch tasks again to reflect the change in real-time
        fetchTasks();
    }, [moveTask, fetchTasks]);

    return (
        <div className='d-flex flex-column justify-content-center align-content-center align-items-center'>
            <TaskForm />
            <div className='d-flex flex-column justify-content-center align-items-center m-4 mt-lg-4'>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" direction="horizontal" type="COLUMN">
                        {(provided) => (
                            <div
                                className="d-flex justify-content-center m-4 task-board"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <TaskColumn className="d-flex justify-content-center m-2 mx-5" columnName="Todo" tasks={todoTasks} />
                                <TaskColumn className="d-flex justify-content-center m-2 mx-5" columnName="InProgress" tasks={inProgressTasks} />
                                <TaskColumn className="d-flex justify-content-center m-2 mx-5" columnName="Done" tasks={doneTasks} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default Dashboard;
