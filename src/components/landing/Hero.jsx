import React from 'react';
import heroImage from '../../assets/hero-gavel.jpeg'; 

function Hero() {
  return (
    <header className="hero">
      <div className="hero-container">
        
        <div className="hero-content">
          <h1 className="hero-headline animate-fade-in-up">
            Turn Thousands of Case Pages into Actionable Insights in Minutes.
          </h1>
          <p className="hero-subheadline animate-fade-in-up animate-delay-1">
            Our AI reads, transcribes, and summarizes your case files, 
            highlighting critical evidence, contradictions, and legal precedents.
          </p>
          
          <a href="#demo" className="btn btn-primary btn-large animate-fade-in-up animate-delay-2">
            Request a Demo
          </a>
        </div>
        
        <div className="hero-visual animate-fade-in animate-delay-3">
          <img 
            src={heroImage} 
            alt="Gavel and legal books" 
            className="software-mockup-img" 
          />
        </div>

      </div>
    </header>
  );
}

export default Hero;

