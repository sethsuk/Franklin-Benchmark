import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { Routes, Route, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.js';
import ReactionTimePage from './pages/ReactionTimePage/ReactionTimePage.jsx';
import ButtonMasherPage from './pages/ButtonMasher/ButtonMasherPage.jsx';
import QuickMathPage from './pages/QuickMath/QuickMathPage.jsx';

import Header from './components/Header/Header';
import UsernameForm from './components/UsernameForm/UsernameForm';

function App() {
  const [userData, setUserData] = useState(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    if (userData && userData.status === 'new_user') {
      setShowUsernameModal(true);
    }
  }, [userData]);

  return (
    <AuthProvider>
      <Header userData={userData} setUserData={setUserData} />
      {showUsernameModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '300px',
          }}>
            <UsernameForm userData={userData} setUserData={setUserData} />
            <button onClick={() => setShowUsernameModal(false)} style={{ marginTop: '1rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reaction-time" element={<ReactionTimePage />} />
        <Route path="/button-masher" element={<ButtonMasherPage />} />
        <Route path="/quick-math" element={<QuickMathPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
