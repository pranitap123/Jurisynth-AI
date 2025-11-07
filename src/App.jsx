import React from 'react';
import './styles.css'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import CaseViewPage from './pages/CaseViewPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        
        <Route path="/auth" element={<AuthPage />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/case/:caseId" element={<CaseViewPage />} />
        
        <Route path="/all-cases" element={
          <div style={{ padding: '2rem', color: 'white' }}>All Cases Page (Coming Soon)</div>
        } />
        
        <Route path="/search" element={
          <div style={{ padding: '2rem', color: 'white' }}>Global Search Page (Coming Soon)</div>
        } />
        
        <Route path="/settings" element={
          <div style={{ padding: '2rem', color: 'white' }}>Settings Page (Coming Soon)</div>
        } />

        <Route path="/forgot-password" element={
          <div style={{ padding: '2rem', color: 'white' }}>Forgot Password Page (Coming Soon)</div>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

