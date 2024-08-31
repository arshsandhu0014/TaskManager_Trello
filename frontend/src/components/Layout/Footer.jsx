import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="bg-light text-center py-3 mt-5">
            <div className="container">
                <p className="mb-0">
                    &copy; {new Date().getFullYear()} Task Manager App. All rights reserved. Created by <strong>Arshdeep Singh Sandhu </strong>.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
