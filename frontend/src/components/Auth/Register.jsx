import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is imported

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 5000); // Hide toast after 5 seconds
  };

  const validateForm = () => {
    const errors = {};
    if (!firstName) errors.firstName = 'First Name is required';
    if (!lastName) errors.lastName = 'Last Name is required';
    if (!username) errors.username = 'Username is required';
    
    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // At least 8 characters, 1 uppercase letter, 1 number
    if (!password) errors.password = 'Password is required';
    else if (!passwordRegex.test(password)) errors.password = 'Password must be at least 8 characters long and include at least one uppercase letter and one number';

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
      const response = await axios.post('https://taskmanager-trello.onrender.com/auth/register', {
        firstName,
        lastName,
        username,
        password,
      });
      console.log('Registration successful!', response.data);
      showToast('Registration successful! Please login with your credentials.', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data.message : error.message);
      const errorMessage = error.response ? error.response.data.message : 'Registration failed';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="container mt-2 mb-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Register</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
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
                <button type="submit" className="btn btn-primary">Register</button>
              </form>
             
            </div>
          </div>
        </div>
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
  );
};

export default Register;
