import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

import "./Login.css"

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password
      });
      console.log('Login successful!', response.data);
      // Call the onLogin function passed from the parent component to handle authentication
      onLogin(response.data);
      // Redirect to dashboard after successful login
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username:</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
              </form>
              {error && <div className="mt-3 text-danger">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
