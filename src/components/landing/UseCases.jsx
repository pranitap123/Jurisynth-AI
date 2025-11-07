import React, { useState } from 'react';
import { FaGavel, FaBalanceScale, FaUserGraduate } from 'react-icons/fa'; 

function UseCases() {
  const [activeTab, setActiveTab] = useState('advocates'); 

  return (
    <section id="use-cases" className="page-section use-cases-section">
      <div className="use-cases-container">
        <div className="features-header">
          <h2>A Tool Tailored For You</h2>
          <p>Jurisynth is built to serve the unique needs of every role within the legal ecosystem.</p>
        </div>

        <div className="use-case-tabs">
          <button
            className={`tab-link ${activeTab === 'advocates' ? 'active' : ''}`}
            onClick={() => setActiveTab('advocates')}
          >
            <FaGavel />
            For Advocates
          </button>
          <button
            className={`tab-link ${activeTab === 'judges' ? 'active' : ''}`}
            onClick={() => setActiveTab('judges')}
          >
            <FaBalanceScale />
            For Judges
          </button>
          <button
            className={`tab-link ${activeTab === 'paralegals' ? 'active' : ''}`}
            onClick={() => setActiveTab('paralegals')}
          >
            <FaUserGraduate />
            For Paralegals
          </button> 
        </div>

        <div className="tab-content-container">
          
          {activeTab === 'advocates' && (
            <div className="tab-content active animate-fade-in-up">
              <div className="tab-icon"><FaGavel /></div>
              <h3>Find the 'Smoking Gun' in Minutes</h3>
              <p>
                Stop manually cross-referencing hundreds of documents. Our AI reads everything and instantly flags contradictions between spoken testimony and written evidence, helping you build a stronger, fact-checked case.
              </p>
              <ul>
                <li><span className="check">✓</span> Instantly find contradictions.</li>
                <li><span className="check">✓</span> Search all case files with natural language.</li>
                <li><span className="check">✓</span> Prepare for cross-examinations faster.</li>
              </ul>
            </div>
          )}

         
          {activeTab === 'judges' && (
            <div className="tab-content active animate-fade-in-up">
              <div className="tab-icon"><FaBalanceScale /></div>
              <h3>Get the Full Picture, Fast</h3>
              <p>
                Receive a neutral, AI-generated summary of all evidence and arguments in a complex case before you even enter the courtroom. Understand the core facts without bias, saving valuable judicial time.
              </p>
              <ul>
                <li><span className="check">✓</span> Unbiased executive summaries.</li>
                <li><span className="check">✓</span> View timelines of key evidence.</li>
                <li><span className="check">✓</span> Reduce pre-hearing reading load.</li>
              </ul>
            </div>
          )}

          {activeTab === 'paralegals' && (
            <div className="tab-content active animate-fade-in-up">
              <div className="tab-icon"><FaUserGraduate /></div>
              <h3>Stop Organizing, Start Analyzing</h3>
              <p>
                Instantly OCR, transcribe, and index thousands of documents, from handwritten notes to multi-hour audio files. Our system automatically categorizes everything so you can find what you need in seconds, not days.
              </p>
              <ul>
                <li><span className="check">✓</span> Automated document indexing.</li>
                <li><span className="check">✓</span> High-accuracy transcription.</li>
                <li><span className="check">✓</span> Lightning-fast search across all data.</li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default UseCases;