import React from 'react';

function Pricing() {
  return (
    <section id="pricing" className="page-section pricing-section">
      <div className="pricing-container">
        <div className="features-header">
          <h2>Flexible Pricing for Every Need</h2>
          <p>Choose the plan that's right for your practice, from solo work to large-scale court systems.</p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card animate-fade-in-up animate-delay-1">
            <h3>Solo Practitioner</h3>
            <p className="price">$49 <span>/ month</span></p>
            <p className="description">Ideal for individual lawyers and small private practices.</p>
            <ul>
              <li><span className="check">✓</span> 20 Cases per Month</li>
              <li><span className="check">✓</span> 5 GB Document Storage</li>
              <li><span className="check">✓</span> OCR & Speech-to-Text</li>
              <li><span className="check">✓</span> Standard Case Summarization</li>
              <li><span className="check">✓</span> Email Support</li>
            </ul>
            <button className="btn btn-secondary">Get Started</button>
          </div>

          <div className="pricing-card popular animate-fade-in-up animate-delay-2">
            <span className="popular-badge">Most Popular</span>
            <h3>Law Firm</h3>
            <p className="price">$199 <span>/ month</span></p>
            <p className="description">For established firms managing multiple clients and advocates.</p>
            <ul>
              <li><span className="check">✓</span> <strong>Unlimited</strong> Cases</li>
              <li><span className="check">✓</span> 50 GB Secure Storage</li>
              <li><span className="check">✓</span> Advanced NLP & Search</li>
              <li><span className="check">✓</span> Contradiction Highlighting</li>
              <li><span className="check">✓</span> Priority Phone & Email Support</li>
            </ul>
            <button className="btn btn-primary">Choose Firm Plan</button>
          </div>

          <div className="pricing-card animate-fade-in-up animate-delay-3">
            <h3>Enterprise</h3>
            <p className="price">Custom</p>
            <p className="description">For large firms, judicial bodies, and court systems.</p>
            <ul>
              <li><span className="check">✓</span> Unlimited Cases & Storage</li>
              <li><span className="check">✓</span> On-Premise Deployment Option</li>
              <li><span className="check">✓</span> Custom AI Model Training</li>
              <li><span className="check">✓</span> Dedicated Support & SLA</li>
              <li><span className="check">✓</span> Full API Access</li>
            </ul>
            <button className="btn btn-secondary">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;

