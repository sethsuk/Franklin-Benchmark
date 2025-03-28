import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Franklin Benchmark</h1>
      <p>Measure your abilities to compete against yourself and others</p>
      <div className="game-selection">
        <button className="game-button" onClick={() => navigate('/reaction-time')}>Reaction Time</button>
        <button className="game-button" onClick={() => navigate('/button-masher')}>Button Masher</button>
        <button className="game-button" onClick={() => navigate('/quick-math')}>Quick Math</button>
      </div>
    </div>
  );
}

export default HomePage;