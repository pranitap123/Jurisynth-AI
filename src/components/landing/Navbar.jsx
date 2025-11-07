import React from 'react';
import { FaGavel, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
       
        <Link to="/" className="navbar-logo">
          Jurisynth
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
           
            <a href="/#features" className="nav-link">Features</a>
          </li>
          <li className="nav-item">
            <a href="/#security" className="nav-link">Security</a>
          </li>
          <li className="nav-item">
            <a href="/#pricing" className="nav-link">Pricing</a>
          </li>
          <li className="nav-item">
            <a href="/#contact" className="nav-link">Contact</a>
          </li>
        </ul>
        
        <div className="nav-buttons">
          <div className="nav-dropdown-wrapper">
            <button className="btn btn-secondary nav-login-btn">
              Login
            </button>
            <ul className="dropdown-menu">
            
              <li>
                <Link to="/auth">
                  <FaUser /> Login as User
                </Link>
              </li>
              <li>
                <Link to="/auth">
                  <FaGavel /> Login as Advocate
                </Link>
              </li>
            </ul>
          </div>
          
          <a href="/#demo" className="btn btn-primary">Request a Demo</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

