import React from "react";

const SubmissionForm = ({ name, setName, handleSubmit, submitted, resetGame, reactionTime, highScore, rank }) => {
  return (
    <div className="submission-container">
      <p>
        Your Reaction Time: <strong>{reactionTime} ms</strong>
        {submitted && highScore !== -1 && rank !== -1 && (
          <>
            , High Score: <strong>{highScore}</strong>
            , Rank: <strong>{rank}</strong>
          </>
        )}
      </p>

      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
          />
          <button className="submit-button" type="submit">Submit</button>
        </form>
      ) : (
        <>
          <p className="submitted-message">Submitted!</p>
          <button onClick={resetGame}>Play Again?</button>
        </>
      )}
    </div>
  );
};

export default SubmissionForm;