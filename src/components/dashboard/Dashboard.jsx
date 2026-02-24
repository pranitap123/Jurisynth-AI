import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { 
  FaPlus, FaFileUpload, FaMicrophoneAlt, 
  FaCheckCircle, FaExclamationTriangle, FaArchive, FaTimes 
} from 'react-icons/fa';
import { MdOutlineSummarize } from 'react-icons/md';

// Mock Data for the attention widget (we will make this dynamic later)
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
    icon: <FaExclamationTriangle />,
    text: "Summary ready for 'Johnson Property Dispute'",
    actionText: 'View Summary',
    link: '/case/2025-079'
  }
];

function Dashboard() {
  const [currentUser, setCurrentUser] = useState({ name: 'Guest', initials: 'G' });
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    caseNumber: '',
    description: ''
  });

  useEffect(() => {
    const savedName = localStorage.getItem('loggedInUserName');
    const token = localStorage.getItem('token');

    // Security check: If there's no token, kick them back to login
    if (!token) {
      navigate('/auth');
      return;
    }

    if (savedName) {
      const initials = savedName.split(' ').map(n => n[0]).join('').toUpperCase();
      setCurrentUser({ name: savedName, initials: initials });
    }

    // Fetch real cases from your backend
    const fetchCases = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cases', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send the JWT token
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch cases from server');
        }

        setCases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, [navigate]);

  // --- Create Case Handler ---
  const handleCreateCase = async (e) => {
    e.preventDefault();
    setModalError(null);
    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create case');
      }

      // Success! Add new case to the top of the list
      setCases([data, ...cases]);
      
      // Close modal and reset form
      setIsModalOpen(false);
      setFormData({ title: '', caseNumber: '', description: '' });

    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to dynamically style the status badges based on DB enum
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'ready':
        return { text: 'Ready', icon: <FaCheckCircle />, cssClass: 'ready' };
      case 'closed':
        return { text: 'Closed', icon: <FaArchive />, cssClass: 'closed' };
      case 'processing':
      default:
        return { text: 'Processing', icon: <MdOutlineSummarize />, cssClass: 'processing' };
    }
  };

  return (
    <DashboardLayout userName={currentUser.name} userInitials={currentUser.initials}>
      <div className="dashboard-header">
        <h1>Welcome back, {currentUser.name}!</h1>
      </div>
      
      {/* === QUICK ACTIONS === */}
      <section className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="action-card" onClick={() => setIsModalOpen(true)}>
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

      {/* === RECENT CASES (NOW DYNAMIC) === */}
      <section className="dashboard-section">
        <h2>Recent Cases</h2>
        
        {/* State 1: Loading */}
        {isLoading && <p style={{ color: 'var(--text-secondary)' }}>Loading your cases...</p>}
        
        {/* State 2: Error fetching */}
        {error && (
          <div style={{ color: '#F87171', background: 'rgba(248, 113, 113, 0.1)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* State 3: Empty State (No cases in database) */}
        {!isLoading && !error && cases.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You don't have any cases yet.</p>
            <button className="btn btn-primary btn-small" onClick={() => setIsModalOpen(true)}>
              Create Your First Case
            </button>
          </div>
        )}

        {/* State 4: Data loaded successfully */}
        {!isLoading && !error && cases.length > 0 && (
          <div className="case-grid">
            {/* Show only the 3 most recent cases on the dashboard */}
            {cases.slice(0, 3).map((caseItem) => {
              const statusDisplay = getStatusDisplay(caseItem.status);
              
              return (
                <div className="case-card" key={caseItem._id}>
                  <h4>{caseItem.title}</h4>
                  <p>Case #{caseItem.caseNumber}</p>
                  
                  {/* Dynamic Status Badge */}
                  <span className={`case-status ${statusDisplay.cssClass}`}>
                    {statusDisplay.icon} {statusDisplay.text}
                  </span>
                  
                  <p className="case-activity">
                    Created: {new Date(caseItem.createdAt).toLocaleDateString()}
                  </p>
                  <Link to={`/case/${caseItem._id}`} className="btn btn-secondary btn-small">
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* === "ATTENTION REQUIRED" WIDGET === */}
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

      {/* === CREATE CASE MODAL === */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px',
            width: '100%', maxWidth: '500px', border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative'
          }}>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              <FaTimes />
            </button>

            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', marginTop: 0 }}>Create New Case</h2>

            {modalError && (
              <div style={{ color: '#F87171', background: 'rgba(248, 113, 113, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateCase}>
              <div className="form-group">
                <label>Case Title / Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Smith v. State" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', marginBottom: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label>Case Number</label>
                <input 
                  type="text" 
                  placeholder="e.g., 2025-CV-0104" 
                  value={formData.caseNumber}
                  onChange={(e) => setFormData({...formData, caseNumber: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', marginBottom: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  rows="3"
                  placeholder="Brief summary or notes about this case..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', marginBottom: '1.5rem', resize: 'vertical' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default Dashboard;