import React, { useState, useEffect } from 'react';
import '../styles/ReactionTimePage.css';

function ReactionTimePage() {
  const [gameState, setGameState] = useState('waiting');
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    if (gameState === 'ready') {
      const randomDelay = Math.floor(Math.random() * 3000) + 1000;
      setTimeout(() => {
        setGameState('clicked');
        setStartTime(Date.now());
      }, randomDelay);
    }
  }, [gameState]);

  const handleClick = () => {
    if (gameState === 'waiting') {
      setGameState('ready');
    } else if (gameState === 'clicked') {
      setReactionTime(Date.now() - startTime);
      setGameState('waiting');
    }
  };

  return (
    <div className="reaction-container">
      <h1>Reaction Time</h1>
      {gameState === 'waiting' && (
        <div className="reaction-box blue" onClick={handleClick}>
          Click anywhere to start.
        </div>
      )}
      {gameState === 'ready' && (
        <div className="reaction-box red">
          Wait for green...
        </div>
      )}
      {gameState === 'clicked' && (
        <div className="reaction-box green" onClick={handleClick}>
          {reactionTime ? `${reactionTime} ms` : 'Click!'}
        </div>
      )}
    </div>
  );
}

export default ReactionTimePage;