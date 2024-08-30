import React from 'react';
import { Form } from 'react-bootstrap';

const TaskControls = ({ searchQuery, onSearchChange, sortOption, onSortChange }) => {
    return (
        <div className='d-flex flex-column align-items-center'>
            {/* Search bar */}
            <Form.Control
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="mb-3"
            />

            {/* Sort option */}
           
        </div>
    );
};

export default TaskControls;
