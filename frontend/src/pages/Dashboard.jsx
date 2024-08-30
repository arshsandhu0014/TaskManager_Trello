import React, { useContext, useEffect, useCallback, useState, useMemo } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskColumn from '../components/Task/TaskColumn';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import TaskNavbar from '../components/Task/TaskNavbar '; // Import TaskNavbar
import "../index.css";
const Dashboard = () => {
    const { tasks, fetchTasks } = useContext(AuthContext);
    const { moveTask } = useContext(TaskContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('newest'); // 'newest' or 'oldest'

    useEffect(() => {
        fetchTasks(); // Fetch tasks when the component mounts
    }, [fetchTasks]);

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

    // Separate tasks by column
    const todoTasks = filteredAndSortedTasks.filter(task => task.column === 'Todo');
    const inProgressTasks = filteredAndSortedTasks.filter(task => task.column === 'InProgress');
    const doneTasks = filteredAndSortedTasks.filter(task => task.column === 'Done');

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
        <div className='d-flex flex-column d-flex justify-content-center align-content-center '>
            
            <TaskNavbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortOption={sortOption}
                onSortChange={setSortOption}
            />

            <div className='d-flex flex-column justify-content-center align-items-center '>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" direction="horizontal" type="COLUMN">
                        {(provided) => (
                            <div
                                className="d-flex justify-content-center  task-board"
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
        </div>
    );
};

export default Dashboard
