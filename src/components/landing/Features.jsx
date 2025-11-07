import React from 'react';
import { FaFileUpload, FaBrain, FaSearch } from 'react-icons/fa';

function Features() {
  return (
    <section id="features" className="page-section features-section">
      <div className="features-container">
        
        <div className="features-header">
          <h2>How It Works</h2>
          <p>A simple, powerful 3-step process to get you from document to decision.</p>
        </div>

        <div className="features-grid">
          {/* --- Card 1 --- */}
          <div 
            className="feature-card animate-fade-in-up" 
            style={{ animationDelay: '0.2s' }}
          >
            <div className="feature-icon">
              <FaFileUpload />
            </div>
            <h3>1. Ingest Everything</h3>
            <p>
              Drag-and-drop PDFs, scanned contracts, handwritten notes, and hours of 
              courtroom audio. Our platform handles it all.
            </p>
          </div>
          
          {/* --- Card 2 --- */}
          <div 
            className="feature-card animate-fade-in-up" 
            style={{ animationDelay: '0.4s' }}
          >
            <div className="feature-icon">
              <FaBrain />
            </div>
            <h3>2. AI Finds What Matters</h3>
            <p>
              Our Legal-NLP model reads and tags laws, parties, and evidence. 
              It automatically finds contradictions and key connections.
            </p>
          </div>

          {/* --- Card 3 --- */}
          <div 
            className="feature-card animate-fade-in-up" 
            style={{ animationDelay: '0.6s' }}
          >
            <div className="feature-icon">
              <FaSearch />
            </div>
            <h3>3. Review & Search</h3>
            <p>
              Get a concise case summary in seconds. Use natural language 
              to search all your files: "Show me all testimony about the medical report."
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Features;
