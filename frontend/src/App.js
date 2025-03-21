import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.js';
import ReactionTimePage from './pages/ReactiomTimePage/ReactionTimePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reaction-time" element={<ReactionTimePage />} />
    </Routes>
  );
}

export default App;