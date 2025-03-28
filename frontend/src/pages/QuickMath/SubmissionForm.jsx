import React from "react";

export default function SubmissionForm({
  name,
  setName,
  handleSubmit,
  submitted,
  resetGame,
  score,
  highScore,
  rank,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl">Your Score: {score}</h2>
      {!submitted ? (
        <div>
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={handleSubmit}
            className="ml-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p>Submitted! High Score: {highScore}</p>
          <p>Your Rank: #{rank}</p>
          <button
            onClick={resetGame}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}