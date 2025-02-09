import React, { useState, useEffect } from 'react';
import '../styles/ReactionTimePage.css';

function ReactionTimePage() {
  const [gameState, setGameState] = useState('waiting');
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
      setGameState('submit');
    }
  };

  const handleSubmit = () => {
    if (name.trim() !== '') {
      setSubmitted(true);
      setTimeout(() => {
        setGameState('waiting');
        setReactionTime(null);
        setName('');
        setSubmitted(false);
      }, 2000);
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

      {gameState === 'submit' && (
        <div className="submission-container">
          <p>Your Reaction Time: <strong>{reactionTime} ms</strong></p>
          {!submitted ? (
            <>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="name-input"
              />
              <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </>
          ) : (
            <p className="submitted-message">Submitted!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ReactionTimePage;
