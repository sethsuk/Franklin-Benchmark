import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.js';
import ReactionTimePage from './pages/ReactionTimePage/ReactionTimePage';
import ButtonMasherPage from './pages/ButtonMasher/ButtonMasherPage.jsx';
import QuickMathPage from './pages/QuickMath/QuickMathPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reaction-time" element={<ReactionTimePage />} />
      <Route path="/button-masher" element={<ButtonMasherPage />} />
      <Route path="/quick-math" element={<QuickMathPage />} />
    </Routes>
  );
}

export default App;