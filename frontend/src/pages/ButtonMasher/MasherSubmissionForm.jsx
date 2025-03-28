import React from "react";

const MasherSubmissionForm = ({
  name,
  setName,
  handleSubmit,
  submitted,
  resetGame,
  mashes,
  highScore,
  rank
}) => {
  return (
    <div className="submission-container">
      {!submitted ? (
        <>
          <input
            className="name-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="submit-button" onClick={handleSubmit}>
            Submit Score
          </button>
        </>
      ) : (
        <>
          <p className="submitted-message">Submitted!</p>
          <p>High Score: {highScore} mashes</p>
          <p>Your Rank: {rank === -1 ? "N/A" : `#${rank}`}</p>
          <button className="submit-button" onClick={resetGame}>
            Play Again
          </button>
        </>
      )}
    </div>
  );
};

export default MasherSubmissionForm;