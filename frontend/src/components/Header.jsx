import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  console.log(user);

  const handleLogout = () => {
    onLogout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <Navbar bg="light" expand="lg">
      <div className="container">
        <Navbar.Brand as={Link} to="/">S-cure</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <>
            
                <NavDropdown title={`${user.firstName} ${user.lastName} (${user.role})`} id="basic-nav-dropdown">
                  <NavDropdown.Item as={Button} onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
