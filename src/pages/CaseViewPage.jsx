import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { FaFilePdf, FaMicrophoneAlt, FaExclamationTriangle, FaArrowLeft, FaUpload, FaTimes } from 'react-icons/fa';

function CaseViewPage() {
  const { caseId } = useParams(); 
  const [caseDetails, setCaseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Upload State ---
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });

  const userName = localStorage.getItem('loggedInUserName') || 'Guest';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'G';

  const fetchCaseData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/cases/${caseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch case details');
      }

      setCaseDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  // --- Upload Handlers ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus({ type: '', message: '' }); // Clear previous messages
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const cancelSelection = () => {
    setSelectedFile(null);
    setUploadStatus({ type: '', message: '' });
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus({ type: '', message: '' });

    const formData = new FormData();
    // 'document' is the field name your backend multer setup will likely expect. 
    formData.append('document', selectedFile); 

    try {
      const token = localStorage.getItem('token');
      
      // IMPORTANT: Notice we DO NOT set 'Content-Type' here. 
      // When using FormData, the browser automatically sets it to 'multipart/form-data' with the correct boundary.
      const response = await fetch(`http://localhost:5000/api/cases/${caseId}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setUploadStatus({ type: 'success', message: 'Document uploaded successfully!' });
      setSelectedFile(null); // Reset selection
      
      // Refetch the case data so the new document appears in the list
      fetchCaseData(); 

    } catch (err) {
      setUploadStatus({ type: 'error', message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <DashboardLayout userName={userName} userInitials={userInitials}>
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading case details...
        </div>
      </DashboardLayout>
    );
  }

  // --- Render Error State ---
  if (error || !caseDetails) {
    return (
      <DashboardLayout userName={userName} userInitials={userInitials}>
        <div className="case-view-container">
          <div className="case-view-header">
            <Link to="/dashboard" className="back-button">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1>Case Not Found</h1>
          </div>
          <div style={{ color: '#F87171', background: 'rgba(248, 113, 113, 0.1)', padding: '15px', borderRadius: '8px' }}>
            {error || "The details for this case could not be retrieved. Please check the ID."}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- Render Actual Case Data ---
  return (
    <DashboardLayout userName={userName} userInitials={userInitials}>
      <div className="case-view-container">
        <div className="case-view-header">
          <Link to="/dashboard" className="back-button">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1>{caseDetails.title}</h1>
          <span className="case-id">Case #{caseDetails.caseNumber}</span>
        </div>

        <div className="case-view-layout">
          {/* --- Left Column: Summary --- */}
          <div className="summary-content">
            <div className="summary-card">
              <h3>Description</h3>
              <p>{caseDetails.description || 'No description provided for this case.'}</p>
            </div>
            
            {/* These are placeholders until we build the AI extraction features */}
            <div className="summary-card" style={{ opacity: 0.5 }}>
              <h3>Key Facts (AI Generated)</h3>
              <p>Upload documents to automatically generate key facts.</p>
            </div>

            <div className="summary-card-grid" style={{ opacity: 0.5 }}>
              <div className="summary-card">
                <h3>Plaintiff's Arguments</h3>
                <p>Pending document analysis...</p>
              </div>
              <div className="summary-card">
                <h3>Defendant's Arguments</h3>
                <p>Pending document analysis...</p>
              </div>
            </div>
          </div>

          {/* --- Right Column: Evidence & Uploads --- */}
          <div className="evidence-sidebar">
            <div className="summary-card">
              <h3>Documents & Evidence</h3>
              
              {/* HIDDEN FILE INPUT */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png" 
              />

              {/* UPLOAD UI STATE MACHINE */}
              {!selectedFile ? (
                // State 1: Ready to select a file
                <>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {caseDetails.documents?.length > 0 
                      ? `${caseDetails.documents.length} document(s) uploaded.` 
                      : 'No documents uploaded yet.'}
                  </p>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    onClick={triggerFileInput}
                  >
                    <FaUpload /> Select File to Upload
                  </button>
                </>
              ) : (
                // State 2: File selected, ready to confirm
                <div style={{ background: 'var(--bg-primary)', padding: '15px', borderRadius: '8px', border: '1px dashed var(--primary-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                      📄 {selectedFile.name}
                    </span>
                    <button 
                      onClick={cancelSelection} 
                      disabled={isUploading}
                      style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    onClick={handleUploadSubmit}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Confirm & Upload'}
                  </button>
                </div>
              )}

              {/* Upload Status Messages */}
              {uploadStatus.message && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  fontSize: '0.85rem',
                  color: uploadStatus.type === 'error' ? '#F87171' : '#10B981',
                  background: uploadStatus.type === 'error' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(16, 185, 129, 0.1)' 
                }}>
                  {uploadStatus.message}
                </div>
              )}
            </div>

            <div className="summary-card contradiction-card" style={{ opacity: 0.5 }}>
              <h3><FaExclamationTriangle /> Contradictions</h3>
              <p style={{ fontSize: '0.9rem' }}>AI will flag contradictions here once evidence is processed.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CaseViewPage;