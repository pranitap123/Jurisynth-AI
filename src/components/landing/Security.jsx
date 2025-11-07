import React from 'react';
// Import the icons
import { FaLock, FaUserShield, FaDatabase } from 'react-icons/fa';

function Security() {
  return (
    <section id="security" className="page-section security-section">
      <div className="security-container">
        <div className="security-header">
          <h2>Security & Confidentiality by Design</h2>
          <p>Your data is sensitive. We're built to protect it.</p>
        </div>
        <div className="security-grid">
          {/* --- Item 1 --- */}
          <div className="security-item">
            <div className="security-icon">
              <FaLock /> {/* <-- Icon added */}
            </div>
            <h4>End-to-End Encryption</h4>
            <p>
              All data, whether at rest or in transit, is encrypted using
              industry-leading AES-256 encryption.
            </p>
          </div>
          {/* --- Item 2 --- */}
          <div className="security-item">
            <div className="security-icon">
              <FaUserShield /> {/* <-- Icon added */}
            </div>
            <h4>Role-Based Access</h4>
            <p>
              You have full control. Decide exactly who can view, edit, or
              access specific cases and documents within your firm.
            </p>
          </div>
          {/* --- Item 3 --- */}
          <div className="security-item">
            <div className="security-icon">
              <FaDatabase /> {/* <-- Icon added */}
            </div>
            <h4>Data Sovereignty</h4>
            <p>
              Your data is yours, always. We provide clear data processing
              agreements and never use your case data for other purposes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Security;