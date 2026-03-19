import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { 
  FaPlus, FaFileUpload, FaMicrophoneAlt, 
  FaCheckCircle, FaExclamationTriangle, FaArchive 
} from 'react-icons/fa';
import { MdOutlineSummarize } from 'react-icons/md';

function Dashboard() {

  const [currentUser, setCurrentUser] = useState({ name: 'Guest', initials: 'G' });
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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

    if (!savedName) {
      navigate('/auth');
      return;
    }

    const initials = savedName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    setCurrentUser({
      name: savedName,
      initials
    });

    const fetchCases = async () => {

      try {

        const response = await fetch('http://localhost:5000/api/cases', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch cases');
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



  const handleCreateCase = async (e) => {

    e.preventDefault();

    setModalError(null);
    setIsSubmitting(true);

    try {

      const response = await fetch('http://localhost:5000/api/cases', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        credentials: 'include',

        body: JSON.stringify(formData)

      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create case');
      }

      setCases([data, ...cases]);

      setIsModalOpen(false);

      setFormData({
        title: '',
        caseNumber: '',
        description: ''
      });

    } catch (err) {

      setModalError(err.message);

    } finally {

      setIsSubmitting(false);

    }
  };



  // NEW: stage-based display
  const getStageDisplay = (stage) => {

    switch (stage) {

      case 'created':
        return { text: 'Created', icon: <MdOutlineSummarize />, cssClass: 'processing' };

      case 'documents_uploaded':
        return { text: 'Docs Uploaded', icon: <FaFileUpload />, cssClass: 'processing' };

      case 'under_review':
        return { text: 'Under Review', icon: <MdOutlineSummarize />, cssClass: 'processing' };

      case 'ai_processed':
        return { text: 'AI Processed', icon: <FaCheckCircle />, cssClass: 'ready' };

      case 'ready':
        return { text: 'Ready', icon: <FaCheckCircle />, cssClass: 'ready' };

      case 'closed':
        return { text: 'Closed', icon: <FaArchive />, cssClass: 'closed' };

      default:
        return { text: 'Processing', icon: <MdOutlineSummarize />, cssClass: 'processing' };
    }
  };


  // NEW: sort by latest activity
  const sortedCases = [...cases].sort((a, b) => {
    const aTime = a.timeline?.length
      ? new Date(a.timeline[a.timeline.length - 1].createdAt)
      : new Date(a.createdAt);

    const bTime = b.timeline?.length
      ? new Date(b.timeline[b.timeline.length - 1].createdAt)
      : new Date(b.createdAt);

    return bTime - aTime;
  });


  // NEW: dynamic attention items
  const attentionItems = sortedCases
    .filter(c => c.stage === "documents_uploaded" || c.stage === "ai_processed")
    .slice(0, 2)
    .map((c, index) => ({
      id: index,
      type: 'warning',
      icon: <FaExclamationTriangle />,
      text:
        c.stage === "documents_uploaded"
          ? `Documents uploaded for "${c.title}"`
          : `AI summary ready for "${c.title}"`,
      actionText: 'View Case',
      link: `/case/${c._id}`
    }));



  return (

    <DashboardLayout
      userName={currentUser.name}
      userInitials={currentUser.initials}
    >

      <div className="dashboard-header">
        <h1>Welcome back, {currentUser.name}!</h1>
      </div>



      <section className="dashboard-section">

        <h2>Quick Actions</h2>

        <div className="quick-actions-grid">

          <button
            className="action-card"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="action-icon">
              <FaPlus />
            </span>
            Create New Case
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/upload")}
          >
            <span className="action-icon">
              <FaFileUpload />
            </span>
            Upload Document
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/transcribe")}
          >
            <span className="action-icon">
              <FaMicrophoneAlt />
            </span>
            Transcribe Audio
          </button>

        </div>

      </section>



      <section className="dashboard-section">

        <h2>Recent Cases</h2>

        {isLoading && (
          <p style={{ color: 'var(--text-secondary)' }}>
            Loading your cases...
          </p>
        )}

        {error && (
          <div style={{
            color: '#F87171',
            background: 'rgba(248,113,113,0.1)',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {!isLoading && !error && cases.length === 0 && (

          <div style={{
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>

            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '1rem'
            }}>
              You don't have any cases yet.
            </p>

            <button
              className="btn btn-primary btn-small"
              onClick={() => setIsModalOpen(true)}
            >
              Create Your First Case
            </button>

          </div>

        )}

        {!isLoading && !error && cases.length > 0 && (

          <div className="case-grid">

            {sortedCases.slice(0, 3).map((caseItem) => {

              const statusDisplay = getStageDisplay(caseItem.stage);

              const latestEvent = caseItem.timeline?.length
                ? caseItem.timeline[caseItem.timeline.length - 1]
                : null;

              return (

                <div className="case-card" key={caseItem._id}>

                  <h4>{caseItem.title}</h4>

                  <p>Case #{caseItem.caseNumber}</p>

                  <span className={`case-status ${statusDisplay.cssClass}`}>
                    {statusDisplay.icon} {statusDisplay.text}
                  </span>

                  <p className="case-activity">
                    {latestEvent
                      ? latestEvent.message
                      : `Created: ${new Date(caseItem.createdAt).toLocaleDateString()}`}
                  </p>

                  <p style={{ fontSize: "12px", color: "gray" }}>
                    {latestEvent &&
                      new Date(latestEvent.createdAt).toLocaleString()}
                  </p>

                  <Link
  to={`/case/${caseItem._id}`}
  className="btn btn-secondary btn-small"
>
  View Details
</Link>

                </div>

              );

            })}

          </div>

        )}

      </section>



      <section className="dashboard-section">

        <h2>Attention Required</h2>

        <div className="attention-widget">

          {attentionItems.length === 0 && (
            <p style={{ color: "gray" }}>No immediate actions required</p>
          )}

          {attentionItems.map(item => (

            <div
              key={item.id}
              className={`attention-item ${item.type}`}
            >

              <div className="attention-icon">
                {item.icon}
              </div>

              <div className="attention-text">
                {item.text}
              </div>

              <Link
                to={item.link}
                className="btn btn-secondary btn-small"
              >
                {item.actionText}
              </Link>

            </div>

          ))}

        </div>

      </section>



      {isModalOpen && (

        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>

          <div style={{
            background: "#1e293b",
            padding: "30px",
            borderRadius: "10px",
            width: "400px"
          }}>

            <h2>Create New Case</h2>

            <form onSubmit={handleCreateCase}>

              <input
                type="text"
                placeholder="Case Title"
                value={formData.title}
                onChange={(e)=>setFormData({...formData,title:e.target.value})}
                style={{width:"100%",padding:"10px",marginBottom:"10px"}}
              />

              <input
                type="text"
                placeholder="Case Number"
                value={formData.caseNumber}
                onChange={(e)=>setFormData({...formData,caseNumber:e.target.value})}
                style={{width:"100%",padding:"10px",marginBottom:"10px"}}
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e)=>setFormData({...formData,description:e.target.value})}
                style={{width:"100%",padding:"10px",marginBottom:"10px"}}
              />

              <div style={{display:"flex",gap:"10px"}}>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={()=>setIsModalOpen(false)}
                >
                  Cancel
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