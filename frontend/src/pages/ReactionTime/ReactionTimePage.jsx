import React, { useState, useEffect, useRef } from "react";
import ReactionBox from "./ReactionBox";
import SubmissionForm from "./SubmissionForm";
import Leaderboard from "./Leaderboard";

const GAME_STATES = {
  WAITING: "waiting",
  READY: "ready",
  CLICKED: "clicked",
  SUBMIT: "submit",
};

function ReactionTimePage() {
  // -------------------------
  // State Management
  // -------------------------
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);

  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(-1);
  const [rank, setRank] = useState(-1);
  const [lastSubmittedPlayer, setLastSubmittedPlayer] = useState(null);

  const timeoutIdRef = useRef(null);

  // -------------------------
  // Helper Functions
  // -------------------------
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/reaction/leaderboard");
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const resetGame = () => {
    setGameState(GAME_STATES.WAITING);
    setReactionTime(null);
    setName('');
    setSubmitted(false);
    setHighScore(-1);
    setRank(-1);
    setLastSubmittedPlayer(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name before submitting!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reaction/record-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, reactionTime }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitted(true);
        setLastSubmittedPlayer({ username: name, reactionTime });
        fetchLeaderboard();
        setHighScore(data.highScore);
        setRank(data.rank);
      } else {
        console.error("Failed to submit score");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATES.READY) {
      const randomDelay = Math.floor(Math.random() * 3000) + 1000;
      timeoutIdRef.current = setTimeout(() => {
        setGameState(GAME_STATES.CLICKED);
        setStartTime(Date.now());
      }, randomDelay);

      return () => clearTimeout(timeoutIdRef.current);
    }
  }, [gameState]);

  // -------------------------
  // Click Handler
  // -------------------------
  const handleClick = () => {
    switch (gameState) {
      case GAME_STATES.WAITING:
        setGameState(GAME_STATES.READY);
        break;

      case GAME_STATES.READY:
        alert("You clicked too early!");
        setGameState(GAME_STATES.WAITING);
        clearTimeout(timeoutIdRef.current);
        break;

      case GAME_STATES.CLICKED:
        setReactionTime(Date.now() - startTime);
        setGameState(GAME_STATES.SUBMIT);
        break;

      default:
        break;
    }
  };

  // -------------------------
  // Rendering
  // -------------------------
  return (
    <div className="reaction-container">
      <h1>Reaction Time</h1>

      <ReactionBox
        gameState={gameState}
        handleClick={handleClick}
        reactionTime={reactionTime}
      />

      {gameState === GAME_STATES.SUBMIT && (
        <SubmissionForm
          name={name}
          setName={setName}
          handleSubmit={handleSubmit}
          submitted={submitted}
          resetGame={resetGame}
          reactionTime={reactionTime}
          highScore={highScore}
          rank={rank}
        />
      )}

      <Leaderboard
        leaderboard={leaderboard}
        lastSubmittedPlayer={lastSubmittedPlayer}
      />
    </div>
  );
}

export default ReactionTimePage;