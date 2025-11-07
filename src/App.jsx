import React from 'react';
import './styles.css'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import CaseViewPage from './pages/CaseViewPage';
import AllCasesPage from './pages/AllCasesPage';
import GlobalSearchPage from './pages/GlobalSearchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Your Homepage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Your Login/Register Page */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Your Main Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* The Page for a Single Case */}
        <Route path="/case/:caseId" element={<CaseViewPage />} />
        
        {/* The Page for Listing All Cases */}
        <Route path="/all-cases" element={<AllCasesPage />} /> 

        {/* The Page for Global Search */}
        <Route path="/search" element={<GlobalSearchPage />} /> 

        {/* You can add more routes here later */}
        <Route path="/settings" element={<div>Settings Page</div>} />
        <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;