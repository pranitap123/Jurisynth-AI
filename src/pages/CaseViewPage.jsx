import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { FaFilePdf, FaMicrophoneAlt, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

// Mock data for the demo. Later, you'll fetch this based on the caseId.
const caseData = {
  '2025-081': {
    name: 'ABC v. XYZ Corp',
    summary: 'A contract dispute regarding the non-delivery of specified goods (Model X-1000) by XYZ Corp. on the agreed-upon date (Oct 15, 2024). Plaintiff (ABC) alleges breach of contract and seeks damages. Defendant (XYZ Corp.) claims unforeseen supply chain disruptions as a "Force Majeure" event.',
    keyFacts: [
      'Contract signed: July 1, 2024.',
      'Delivery date: October 15, 2024.',
      'Defendant sent notification of delay: October 14, 2024.',
      'Plaintiff claims $1.2M in damages from operational downtime.'
    ],
    plaintiffArgs: [
      'Defendant failed to provide adequate warning of delay.',
      '"Force Majeure" clause does not cover standard supply chain issues.'
    ],
    defendantArgs: [
      'A global shipping container shortage constitutes a valid Force Majeure event.',
      'Notification was provided as soon as the delay was confirmed.'
    ],
    evidence: [
      { id: 1, type: 'pdf', title: 'Original Contract', source: 'Doc-001.pdf' },
      { id: 2, type: 'audio', title: 'Witness Testimony (J. Doe)', source: 'Audio-001.mp3' },
      { id: 3, type: 'pdf', title: 'Email Correspondence', source: 'Doc-002.pdf' }
    ],
    contradictions: [
      { id: 1, text: 'Witness J. Doe stated delivery was "expected in September" (Audio-001, 04:15), contradicting the contract\'s October 15 date (Doc-001, Sec 2.a).' }
    ]
  },
  '2025-079': {
    name: 'Johnson Property Dispute',
    summary: 'A dispute over property line boundaries and a shared driveway. Plaintiff (Johnson) alleges encroachment by the defendant. Defendant claims "adverse possession" of the disputed strip of land for over 12 years.',
    keyFacts: [
      'Property survey (2005) shows line in favor of Plaintiff.',
      'Defendant built a fence in 2010, allegedly 3 feet onto Plaintiff\'s property.',
      'Local statute for adverse possession is 10 years.'
    ],
    plaintiffArgs: [
      'The 2005 survey is the definitive legal boundary.',
      'Defendant\'s fence is a clear and knowing encroachment.'
    ],
    defendantArgs: [
      'Fence has been in place, unchallenged, for 14 years (2010-2024).',
      'Plaintiff was aware of the fence and did not contest it until now.'
    ],
    evidence: [
      { id: 1, type: 'pdf', title: '2005 Property Survey', source: 'Doc-A.pdf' },
      { id: 2, type: 'pdf', title: 'Defendant Fence Receipt (2010)', source: 'Doc-B.pdf' },
    ],
    contradictions: []
  }
};

const notFoundData = {
  name: "Case Not Found",
  summary: "The details for this case could not be retrieved. Please check the case ID and try again.",
  keyFacts: [],
  plaintiffArgs: [],
  defendantArgs: [],
  evidence: [],
  contradictions: []
};


function CaseViewPage() {
  const { caseId } = useParams(); 
  
  const caseDetails = caseData[caseId] || notFoundData;

  const userName = localStorage.getItem('loggedInUserName') || 'Guest';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'G';

  return (
    <DashboardLayout userName={userName} userInitials={userInitials}>
      <div className="case-view-container">
        <div className="case-view-header">
          <Link to="/dashboard" className="back-button">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1>{caseDetails.name}</h1>
          <span className="case-id">Case #{caseId}</span>
        </div>

        {/* This is the div that was broken. The '==' are gone. */}
        <div className="case-view-layout">
          <div className="summary-content">
            <div className="summary-card">
              <h3>Executive Summary</h3>
              <p>{caseDetails.summary}</p>
            </div>
            
            {caseDetails.keyFacts.length > 0 && (
              <div className="summary-card">
                <h3>Key Facts</h3>
                <ul>
                  {caseDetails.keyFacts.map((fact, index) => <li key={index}>{fact}</li>)}
                </ul>
              </div>
            )}

            {caseDetails.plaintiffArgs.length > 0 && (
              <div className="summary-card-grid">
                <div className="summary-card">
                  <h3>Plaintiff's Arguments</h3>
                  <ul>
                    {caseDetails.plaintiffArgs.map((arg, index) => <li key={index}>{arg}</li>)}
                  </ul>
                </div>
                <div className="summary-card">
                  <h3>Defendant's Arguments</h3>
                  <ul>
                    {caseDetails.defendantArgs.map((arg, index) => <li key={index}>{arg}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* --- Right Column: Evidence & Contradictions --- */}
          <div className="evidence-sidebar">
            {caseDetails.evidence.length > 0 && (
              <div className="summary-card">
                <h3>Key Evidence</h3>
                <ul className="evidence-list">
                  {caseDetails.evidence.map(item => (
                    <li key={item.id} className="evidence-item">
                      {item.type === 'pdf' ? <FaFilePdf /> : <FaMicrophoneAlt />}
                      <div className="evidence-info">
                        <strong>{item.title}</strong>
                        <span>Source: {item.source}</span>
                      </div>
                      <button className="btn btn-secondary btn-small">View</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {caseDetails.contradictions.length > 0 && (
              <div className="summary-card contradiction-card">
                <h3><FaExclamationTriangle /> Contradictions Found</h3>
                <ul className="contradiction-list">
                  {caseDetails.contradictions.map(item => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CaseViewPage;