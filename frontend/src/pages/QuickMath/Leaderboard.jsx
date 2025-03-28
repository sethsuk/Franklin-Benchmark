import React from "react";

export default function Leaderboard({ leaderboard, lastSubmittedPlayer }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
      <ul className="space-y-1">
        {leaderboard.map((entry, index) => (
          <li
            key={index}
            className={`${
              lastSubmittedPlayer?.username === entry.username &&
              lastSubmittedPlayer?.score === entry.score
                ? "font-bold text-green-600"
                : ""
            }`}
          >
            #{index + 1} - {entry.username}: {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
}