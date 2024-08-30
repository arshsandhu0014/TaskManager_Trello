import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is imported
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  const validateForm = () => {
    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((message) => showToast(message, 'error'));
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Login successful!', response.data);
      onLogin(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data.message : error.message);
      const errorMessage = error.response ? error.response.data.message : 'Login failed';
      showToast(errorMessage, 'error');
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
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error.response ? error.response.data.message : error.message);
      const errorMessage = error.response ? error.response.data.message : 'Google login failed';
      showToast(errorMessage, 'error');
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
                <div className="d-flex justify-content-center mt-3 mb-3">
                  <button type="submit" className="btn btn-primary w-50">Login</button>
                </div>
              </form>
              <div className="d-flex justify-content-center">
                <h5>or</h5>
              </div>
              <div className="d-flex justify-content-center mb-3">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onFailure={(error) => {
                    console.error('Google login error:', error);
                    showToast('Google login failed', 'error');
                  }}
                />
              </div>
              {/* Bootstrap Toast Container */}
              <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                <div
                  className={`toast ${toastType === 'success' ? 'bg-success text-light' : 'bg-danger text-light'}`}
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                  style={{ display: toastMessage ? 'block' : 'none' }}
                >
                  <div className="toast-body">
                    {toastMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
