import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          
          <div className="footer-link-group">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#security">Security</a>
            <a href="#pricing">Pricing</a>
            <a href="#demo">Demo</a>
          </div>

          <div className="footer-link-group">
            <h4>Company</h4>
            <a href="/about">About Us</a>
            <a href="/contact">Contact</a>
            <a href="/careers">Careers</a>
          </div>

          <div className="footer-link-group">
            <h4>Legal</h4>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>

        </div>

        <div className="footer-bottom">
          <span className="footer-logo">Jurisynth</span>
          <span className="footer-copyright">
            © 2025 Jurisynth. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;