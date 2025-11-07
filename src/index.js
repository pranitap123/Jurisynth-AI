import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';

// 1. Import the Google Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

// 2. PASTE YOUR CLIENT ID HERE
// Replace the text inside the quotes with your actual long Client ID string
const YOUR_GOOGLE_CLIENT_ID = "142419293707-monq563ues13gbh4a1bjarvpeogbfquo.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 3. Wrap your App in the provider */}
    <GoogleOAuthProvider clientId={YOUR_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();