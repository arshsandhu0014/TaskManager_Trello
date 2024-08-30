import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Login successful!', response.data);
      onLogin(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data.message : error.message);
      setError(error.response ? error.response.data.message : 'Login failed');
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post('http://localhost:3000/auth/google', {
        id_token: response.credential
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      console.log('Google login successful!', res.data);
      onLogin(res.data.user);
      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error.response ? error.response.data.message : error.message);
      setError(error.response ? error.response.data.message : 'Google login failed');
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
              <div className="mt-3">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onFailure={(error) => {
                    console.error('Google login error:', error);
                    setError('Google login failed');
                  }}
                />
              </div>
              {error && <div className="mt-3 text-danger">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
