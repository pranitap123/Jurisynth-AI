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
  const [animatedStep, setAnimatedStep] = useState(0);

  const fileInputRef = useRef(null);

  const userName = localStorage.getItem('loggedInUserName') || 'Guest';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'G';

  const fetchCaseData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/cases/${caseId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  // 🔥 STEP LOGIC
  let targetStep = 0;

  if (caseDetails) targetStep = 1;
  if (caseDetails?.documents?.length > 0) targetStep = 2;
  if (caseDetails?.proofs?.length > 0) targetStep = 3;
  if (caseDetails?.judgement) targetStep = 4;
  if (caseDetails?.status === "closed") targetStep = 5;

  // ✅ FIXED HOOK POSITION + DEPENDENCY
  useEffect(() => {
    if (!caseDetails) return;

    let i = 0;

    const interval = setInterval(() => {
      i++;
      setAnimatedStep(i);

      if (i >= targetStep) {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [caseDetails, targetStep]);

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

    try {
      const token = localStorage.getItem('token');

      await fetch(`http://localhost:5000/api/cases/${caseId}/documents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
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

      await fetch(`http://localhost:5000/api/cases/summary/${caseId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchCaseData();

    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading || !caseDetails) {
    return (
      <DashboardLayout userName={userName} userInitials={userInitials}>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  const steps = [
    "Case Created",
    "Registered",
    "Docs Uploaded",
    "Proof Added",
    "Judgement",
    "Case Closed",
  ];

  return (
    <DashboardLayout userName={userName} userInitials={userInitials}>

      <div className="case-view-container">

        <div className="case-view-header">

          <Link to="/dashboard" className="back-link">
            <FaArrowLeft /> Back to Dashboard
          </Link>

          <div className="header-split">

            <div className="header-title">

              <div className="title-row" style={{ marginBottom: "12px" }}>
                <h1>{caseDetails.title}</h1>
              </div>

              <span className="case-number-badge">
                Case #{caseDetails.caseNumber}
              </span>

            </div>

            <div style={{ marginLeft: "40px" }}>
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
        </div>

        <div className="case-view-grid">

          <div className="main-content-area">

            <div className="case-card">
              <h3>Case Timeline</h3>

              {steps.map((step, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>

                  <div style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: index <= animatedStep ? "#00d4ff" : "#374151",
                    boxShadow: index === animatedStep ? "0 0 18px #00d4ff" : "none",
                    marginRight: "15px",
                    transition: "all 0.4s ease"
                  }} />

                  <span style={{
                    fontSize: "15px",
                    color: index <= animatedStep ? "#fff" : "#9ca3af",
                    fontWeight: index <= animatedStep ? "600" : "400"
                  }}>
                    {step}
                  </span>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default CaseViewPage;