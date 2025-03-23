import React from "react";

const MasherLeaderboard = ({ leaderboard, lastSubmittedPlayer }) => {
  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <ul className="leaderboard-list">
        {leaderboard.length > 0 ? (
          leaderboard.map((player, index) => {
            const isHighlighted =
              lastSubmittedPlayer &&
              player.username === lastSubmittedPlayer.username &&
              player.masherScore === lastSubmittedPlayer.masherScore;

            return (
              <li key={index}>
                {index + 1}. {" "}
                <strong className={isHighlighted ? "highlighted-username" : ""}>
                  {player.username}
                </strong>{" "}
                - {player.masherScore} mashes
              </li>
            );
          })
        ) : (
          <p>No scores available yet.</p>
        )}
      </ul>
    </div>
  );
};

export default MasherLeaderboard;