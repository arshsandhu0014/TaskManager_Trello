import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import Footer from './components/Footer';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';


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
         
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
