import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const TaskColumn = ({ columnName, tasks }) => {
    return (
        <Droppable droppableId={columnName}>
            {(provided) => (
                <div
                    className="task-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h2>{columnName}</h2>
                    {tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided) => (
                                <div
                                    className="task-item"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default TaskColumn;
