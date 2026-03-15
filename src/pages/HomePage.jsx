import React from 'react';

import Navbar from '../components/landing/Navbar'; 
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Security from '../components/landing/Security';
import UseCases from '../components/landing/UseCases'; 
import Pricing from '../components/landing/Pricing';
import Contact from '../components/landing/Contact';
import FAQ from '../components/landing/faq';
import RequestDemo from '../components/landing/RequestDemo';
import Footer from '../components/landing/Footer';

function HomePage() {
  return (
    <div className="App"> 
      <Navbar /> 
      <Hero />
      <Features />
      <Security />
      <UseCases />
      <Pricing />
      <Contact />
      <FAQ />
      <RequestDemo />
      <Footer />
    </div>
  );
}

export default HomePage;