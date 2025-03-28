import React from 'react';
import './GameButton.css';

function GameButton({ text, onClick }) {
  return (
    <button className="game-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default GameButton;