import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Contact() {
  return (
    <section id="contact" className="page-section contact-section">
      <div className="contact-container">
        <div className="features-header">
          <h2>Get in Touch</h2>
          <p>Have questions about features, pricing, or enterprise solutions? We'd love to hear from you.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info animate-fade-in-up animate-delay-1">
            <h3>Contact Information</h3>
            <p>Fill out the form, or reach us directly at:</p>
            <ul className="contact-details">
              <li>
                <FaEnvelope />
                <span>support@jurisynth.com</span>
              </li>
              <li>
                <FaPhone />
                <span>+91 (875) 123-4567</span>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>Pune, Maharashtra</span>
              </li>
            </ul>
          </div>

          <form className="contact-form animate-fade-in-up animate-delay-2">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" name="message" rows="6" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;

