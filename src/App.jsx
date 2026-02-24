import React from 'react';
import './styles.css'; 
import { HashRouter, Routes, Route } from 'react-router-dom';
// NEW: Import Google Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

// Import your pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import CaseViewPage from './pages/CaseViewPage';
import AllCasesPage from './pages/AllCasesPage';
import GlobalSearchPage from './pages/GlobalSearchPage';

function App() {
  // IMPORTANT: Pulling the Client ID from your .env file
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    // Wrap the entire app so Google Auth is available anywhere
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/case/:caseId" element={<CaseViewPage />} />
          <Route path="/all-cases" element={<AllCasesPage />} /> 
          <Route path="/search" element={<GlobalSearchPage />} /> 
          
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
        </Routes>
      </HashRouter>
    </GoogleOAuthProvider>
  );
}

export default App;