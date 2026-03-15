import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { FaArrowLeft, FaRobot, FaTimes, FaCheck, FaUpload, FaEye, FaFileAlt } from 'react-icons/fa';

function CaseViewPage() {
  const { caseId } = useParams();
  
  const [caseDetails, setCaseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isUploading, setIsUploading] = useState(false); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef(null);

  const userName = localStorage.getItem('loggedInUserName') || 'Guest';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'G';

  const fetchCaseData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cases/${caseId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCaseDetails(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchCaseData();
  }, [fetchCaseData]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('caseId', caseId); 
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/cases/${caseId}/documents`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      setSelectedFile(null);
      fetchCaseData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/summary/${caseId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCaseData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatus = () => {
    if (isAnalyzing) return { label: 'Processing...', class: 'status-processing' };
    if (caseDetails?.status === 'ready') return { label: 'Analysis Ready', class: 'status-ready' };
    if (caseDetails?.documents?.length > 0) return { label: 'Pending Analysis', class: 'status-pending' };
    return { label: 'Awaiting Documents', class: 'status-new' };
  };

  if (isLoading || !caseDetails) return <DashboardLayout userName={userName} userInitials={userInitials}><div>Loading...</div></DashboardLayout>;

  const status = getStatus();

  return (
    <DashboardLayout userName={userName} userInitials={userInitials}>
      <div className="case-view-container">
        <div className="case-view-header">
          <Link to="/dashboard" className="back-link"><FaArrowLeft /> Back to Dashboard</Link>
          <div className="header-split">
            <div className="header-title">
              <div className="title-row">
                <h1>{caseDetails.title}</h1>
                <span className={`status-badge ${status.class}`}>{status.label}</span>
              </div>
              <span className="case-number-badge">Case #{caseDetails.caseNumber}</span>
            </div>
            {caseDetails.documents?.length > 0 && (
              <button 
                className={`generate-ai-btn ${isAnalyzing ? 'pulse' : ''}`} 
                onClick={handleGenerateAI} 
                disabled={isAnalyzing}
              >
                <FaRobot /> {isAnalyzing ? 'Analyzing...' : 'Generate AI Insights'}
              </button>
            )}
          </div>
        </div>

        <div className="case-view-grid">
          <div className="main-content-area">
            <div className="case-card">
              <h3>Case Description</h3>
              <p>{caseDetails.description || 'No description provided.'}</p>
            </div>
            
            <div className="case-card">
              <h3>Key Facts (AI Generated)</h3>
              {isAnalyzing ? (
                <div className="skeleton-loader">AI is scanning documents...</div>
              ) : caseDetails.keyPoints?.length > 0 ? (
                <ul className="points-list">
                  {caseDetails.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              ) : (
                <p className="placeholder">Upload documents and click Generate to extract facts.</p>
              )}
            </div>

            <div className="case-card">
              <h3>AI Legal Analysis</h3>
              {isAnalyzing ? (
                <div className="skeleton-loader-text">Analyzing legal implications...</div>
              ) : (
                <p className="analysis-text">{caseDetails.aiSummary || 'Pending analysis...'}</p>
              )}
            </div>
          </div>

          <div className="sidebar-area">
            <div className="case-card">
              <h3>Documents & Evidence</h3>
              
              <div className="uploaded-docs-list">
                {caseDetails.documents?.map((doc, idx) => (
                  <div key={idx} className="doc-list-item">
                    <div className="doc-info">
                      <FaFileAlt className="doc-icon" />
                      <span title={doc.fileName || doc.filename}>{doc.fileName || doc.filename}</span>
                    </div>
                    <a 
                      href={`http://localhost:5000/${(doc.filePath || doc.path)?.replace(/\\/g, '/')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="view-btn"
                    >
                      <FaEye /> View
                    </a>
                  </div>
                ))}
              </div>

              <hr className="divider" />

              {!selectedFile ? (
                <button className="select-file-btn" onClick={() => fileInputRef.current.click()}>
                  <FaUpload /> Add Document
                </button>
              ) : (
                <div className="upload-confirmation-ui">
                  <p className="file-preview">📄 {selectedFile.name}</p>
                  <div className="confirmation-actions">
                    <button className="confirm-btn" onClick={handleUploadSubmit} disabled={isUploading}>
                      <FaCheck /> {isUploading ? 'Uploading...' : 'Confirm'}
                    </button>
                    <button className="cancel-btn" onClick={() => setSelectedFile(null)}><FaTimes /></button>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.docx,.txt" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CaseViewPage;