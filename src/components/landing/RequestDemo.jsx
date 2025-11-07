import React from 'react';

// This component will have the ID "demo" so the nav link works
function RequestDemo() {
  return (
    <section id="demo" className="page-section demo-section">
      <div className="demo-container">
        <div className="demo-content">
          <h2 className="animate-fade-in-up">See Jurisynthn Action</h2>
          <p className="animate-fade-in-up animate-delay-1">
            Schedule a live, personalized demo with our team. We'll show you how 
            our AI can read, summarize, and connect your case files in minutes, 
            not hours.
          </p>
          <ul className="demo-perks">
            <li className="animate-fade-in-up animate-delay-2">
              <span className="check">✓</span> Find hidden evidence & contradictions
            </li>
            <li className="animate-fade-in-up animate-delay-3">
              <span className="check">✓</span> Automate your document review
            </li>
            <li className="animate-fade-in-up animate-delay-3">
              <span className="check">✓</span> Ask questions in natural language
            </li>
          </ul>
        </div>

        <form className="demo-form animate-fade-in-up animate-delay-2">
          <h3>Request Your Demo</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input type="text" id="first-name" name="first-name" required />
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input type="text" id="last-name" name="last-name" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="work-email">Work Email</label>
            <input type="email" id="work-email" name="work-email" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="organization">Law Firm / Organization</label>
            <input type="text" id="organization" name="organization" />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="role">Your Role</label>
              <select id="role" name="role">
                <option value="advocate">Advocate</option>
                <option value="judge">Judge</option>
                <option value="paralegal">Paralegal</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="users">Number of Users</label>
              <select id="users" name="users">
                <option value="1">Just Me</option>
                <option value="2-10">2-10</option>
                <option value="11-50">11-50</option>
                <option value="50+">50+</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary">Submit Demo Request</button>
          <p className="form-footer">
            We'll contact you within one business day to schedule.
          </p>
        </form>
      </div>
    </section>
  );
}

export default RequestDemo;

