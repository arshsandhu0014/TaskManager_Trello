import React from 'react';
import TaskForm from './TaskForm';
import TaskControls from './TaskControls';
import 'bootstrap/dist/css/bootstrap.min.css';

const TaskNavbar = ({ searchQuery, onSearchChange, sortOption, onSortChange }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light d-flex justify-content-around      w-50 ">
            <div className="container-fluid d-flex flex-row justify-content-center align-items-center">
                {/* TaskForm aligned to the left */}
                <div className=" mx-2">
                    <TaskForm />
                </div>
                
                {/* TaskControls aligned to the right */}
                <div className="mt-3">
                    <TaskControls
                        searchQuery={searchQuery}
                        onSearchChange={onSearchChange}
                        sortOption={sortOption}
                        onSortChange={onSortChange}
                    />
                </div>
            </div>
        </nav>
    );
};

export default TaskNavbar;
