import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ButtonMasherPage from './pages/ButtonMasher/ButtonMasherPage';
import ReactionTimePage from './pages/ReactionTime/ReactionTimePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reaction-time" element={<ReactionTimePage />} />
      <Route path="/button-masher" element={<ButtonMasherPage />} />
    </Routes>
  );
}

export default App;