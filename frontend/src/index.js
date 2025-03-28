import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './pages/HomePage/HomePage.css';
import './pages/ReactiomTimePage/ReactionTimePage.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  <Router>
  <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
</Router>
);
