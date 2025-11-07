import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { 
  FaPlus, FaFileUpload, FaMicrophoneAlt, 
  FaCheckCircle, FaExclamationTriangle, FaFileAlt, FaRedo
} from 'react-icons/fa';
import { MdOutlineSummarize } from 'react-icons/md';


const attentionItems = [
  {
    id: 1,
    type: 'contradiction',
    icon: <FaExclamationTriangle />,
    text: "Contradiction found in 'ABC v. XYZ Corp'",
    actionText: 'Review Now',
    link: '/case/2025-081'
  },
  {
    id: 2,
    type: 'summary',
    icon: <FaFileAlt />,
    text: "Summary ready for 'Johnson Property Dispute'",
    actionText: 'View Summary',
    link: '/case/2025-079' 
  },
  {
    id: 3,
    type: 'failure',
    icon: <FaRedo />,
    text: "Transcription failed for 'Audio-004.mp3'",
    actionText: 'Re-upload',
    link: '#' 
  }
];

function Dashboard() {
  const [currentUser, setCurrentUser] = useState({ name: 'Guest', initials: 'G' });

  useEffect(() => {
    const savedName = localStorage.getItem('loggedInUserName');
    if (savedName) {
      const initials = savedName.split(' ').map(n => n[0]).join('').toUpperCase();
      setCurrentUser({ name: savedName, initials: initials });
    }
  }, []);

  return (
    <DashboardLayout userName={currentUser.name} userInitials={currentUser.initials}>
      <div className="dashboard-header">
        <h1>Welcome back, {currentUser.name}!</h1>
      </div>
      
      <section className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="action-card">
            <span className="action-icon"><FaPlus /></span>
            Create New Case
          </button>
          <button className="action-card">
            <span className="action-icon"><FaFileUpload /></span>
            Upload Document
          </button>
          <button className="action-card">
            <span className="action-icon"><FaMicrophoneAlt /></span>
            Transcribe Audio
          </button>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent Cases</h2>
        <div className="case-grid">
          <div className="case-card">
            <h4>ABC v. XYZ Corp</h4>
            <p>Case #2025-081</p>
            <span className="case-status ready">
              <FaCheckCircle /> Ready
            </span>
            <p className="case-activity">Last modified: 2 hours ago</p>
            <Link to="/case/2025-081" className="btn btn-secondary btn-small">
              View Summary
            </Link>
          </div>
          <div className="case-card">
            <h4>Johnson Property Dispute</h4>
            <p>Case #2025-079</p>
            <span className="case-status processing">
              <MdOutlineSummarize /> Summarizing...
            </span>
            <p className="case-activity">Last modified: 1 day ago</p>
            <Link to="/case/2025-079" className="btn btn-secondary btn-small">
              View Summary
            </Link>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Attention Required</h2>
        <div className="attention-widget">
          {attentionItems.map(item => (
            <div key={item.id} className={`attention-item ${item.type}`}>
              <div className="attention-icon">
                {item.icon}
              </div>
              <div className="attention-text">
                {item.text}
              </div>
              <Link to={item.link} className="btn btn-secondary btn-small">
                {item.actionText}
              </Link>
            </div>
          ))}
        </div>
      </section>
      
    </DashboardLayout>
  );
}

export default Dashboard;