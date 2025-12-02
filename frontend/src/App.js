import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ReactionTimePage from './pages/ReactionTimePage/ReactionTimePage';
import ButtonMasherPage from './pages/ButtonMasher/ButtonMasherPage';
import QuickMathPage from './pages/QuickMath/QuickMathPage';
import AccountPage from './pages/AccountPage/AccountPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reaction-time" element={<ReactionTimePage />} />
        <Route path="/button-masher" element={<ButtonMasherPage />} />
        <Route path="/quick-math" element={<QuickMathPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;