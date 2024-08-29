import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; // Ensure Profile is used or remove if not needed
import ErrorBoundary from './components/ErrorBoundary';
import Home from "./pages/Home";
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [user, setUser] = useState(null);

  // Function to handle user login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Function to handle user logout
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path='/dashboard' element={
            <PrivateRoute element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            } user={user} />
          } />
          {/* Add other routes here */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
