import React, { useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom'; 
import {
  FaHome, FaFolder, FaSearch, FaUpload, FaCog, FaSignOutAlt, FaPlus
} from 'react-icons/fa';

function Sidebar({ userName, userInitials }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserName');
    alert('You have been logged out.');
    navigate('/auth');
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('File selected:', selectedFile.name);
      alert(`You selected: ${selectedFile.name}`);
    }
  };

  return (
    <aside className="sidebar">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="sidebar-top">
        <NavLink to="/dashboard" className="sidebar-logo">
          Jurisynth
        </NavLink>
        <button className="btn btn-primary sidebar-new-case">
          <FaPlus /> <span>New Case</span>
        </button>
        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item">
              <NavLink to="/dashboard" end> 
                <FaHome />
                <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/all-cases">
                <FaFolder />
                <span className="nav-text">All Cases</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/search">
                <FaSearch />
                <span className="nav-text">Global Search</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <button className="nav-button-link" onClick={handleUploadClick}>
                <FaUpload />
                <span className="nav-text">Upload</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <ul className="sidebar-bottom">
        <li className="sidebar-user">
          <span className="user-avatar">{userInitials}</span>
          <span className="user-name">{userName}</span>
        </li>
        <li className="nav-item">
          <NavLink to="/settings">
            <FaCog />
            <span className="nav-text">Settings</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-button-link nav-item-logout">
            <FaSignOutAlt />
            <span className="nav-text">Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;

