import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    return (
        <div className="container text-center mt-5">
            <div className="jumbotron bg-light p-5 rounded">
                <h1 className="display-4">Welcome to Task Manager App!</h1>
                <p className="lead">This task manager is made by <strong>Arshdeep Singh</strong>.</p>
                <hr className="my-4" />
                <p className="mb-4">
                    Manage your tasks efficiently with our intuitive and easy-to-use interface.
                    Organize your work, track progress, and stay on top of deadlines effortlessly.
                </p>
                <a className="btn btn-primary btn-lg" href="/dashboard" role="button">Get Started</a>
            </div>
        </div>
    );
};

export default Home;
