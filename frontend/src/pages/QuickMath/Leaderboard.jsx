import React from "react";

export default function Leaderboard({ leaderboard, lastSubmittedPlayer }) {
  return (
    <div className="leaderboard-card">
      <h3>Leaderboard</h3>
      <ul className="leaderboard-list">
        {leaderboard.map((entry, index) => {
          const isHighlighted =
            lastSubmittedPlayer?.username === entry.username &&
            lastSubmittedPlayer?.score === entry.score;

          return (
            <li key={index} className={`ranked-item rank-${index + 1}`}>
              <span className="rank-number">{index + 1}.</span>
              <span
                className={
                  isHighlighted
                    ? "highlighted-username"
                    : "player-name"
                }
              >
                {entry.username}
              </span>
              <span className="score">{entry.score} pts</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}