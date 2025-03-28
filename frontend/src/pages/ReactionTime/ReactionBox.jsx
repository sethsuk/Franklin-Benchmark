import React from "react";

const ReactionBox = ({ gameState, handleClick, reactionTime }) => {
  return (
    <>
      {gameState === "waiting" && (
        <div className="reaction-box blue" onClick={handleClick}>
          Click anywhere to start.
        </div>
      )}
      {gameState === "ready" && (
        <div className="reaction-box red" onClick={handleClick}>
          Wait for green...
        </div>
      )}
      {gameState === "clicked" && (
        <div className="reaction-box green" onClick={handleClick}>
          {reactionTime ? `${reactionTime} ms` : "Click!"}
        </div>
      )}
    </>
  );
};

export default ReactionBox;