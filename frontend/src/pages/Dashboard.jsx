import React, { useContext } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskColumn from '../components/Task/TaskColumn';
import TaskForm from '../components/Task/TaskForm';
import { TaskContext } from '../context/TaskContext';

const Dashboard = () => {
    const { tasks, moveTask } = useContext(TaskContext);

    const todoTasks = tasks.filter(task => task.column === 'Todo');
    const inProgressTasks = tasks.filter(task => task.column === 'InProgress');
    const doneTasks = tasks.filter(task => task.column === 'Done');

    const onDragEnd = (result) => {
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
        moveTask({
            id: draggableId,
            fromColumn: source.droppableId,
            toColumn: destination.droppableId,
        });
    };

    return (
        <div>
            <TaskForm />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="board" direction="horizontal" type="COLUMN">
                    {(provided) => (
                        <div
                            className="task-board"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <TaskColumn columnName="Todo" tasks={todoTasks} />
                            <TaskColumn columnName="InProgress" tasks={inProgressTasks} />
                            <TaskColumn columnName="Done" tasks={doneTasks} />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Dashboard;
