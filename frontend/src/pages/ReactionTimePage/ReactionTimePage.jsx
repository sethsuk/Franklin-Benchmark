import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "../../components/Header/Header";
import { AuthContext } from "../../context/AuthContext";
import "./ReactionTimePage.css";

const GAME_STATES = {
  WAITING: "waiting",
  READY: "ready",
  CLICKED: "clicked",
  SUBMIT: "submit",
};

function ReactionTimePage() {
  // retrieving user data from the context
  const { token, userData } = useContext(AuthContext);

  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [reactionTime, setReactionTime] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // leaderboard & personal stats
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(-1);
  const [rank, setRank] = useState(-1);

  const timeoutIdRef = useRef(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // game logic
  useEffect(() => {
    if (gameState === GAME_STATES.READY) {
      const randomDelay = Math.floor(Math.random() * 3000) + 1000; // 1‑4 s

      timeoutIdRef.current = setTimeout(() => {
        setGameState(GAME_STATES.CLICKED);
        setReactionTime(null);
        setStartTime(Date.now());
      }, randomDelay);

      return () => clearTimeout(timeoutIdRef.current);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === GAME_STATES.SUBMIT) {
      fetchLeaderboard();
    }
  }, [gameState]);

  const [startTime, setStartTime] = useState(0);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/reaction/leaderboard");
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  const handleClick = () => {
    switch (gameState) {
      case GAME_STATES.WAITING:
        setGameState(GAME_STATES.READY);
        break;

      case GAME_STATES.READY:
        alert("You clicked too early!");
        clearTimeout(timeoutIdRef.current);
        setGameState(GAME_STATES.WAITING);
        break;

      case GAME_STATES.CLICKED:
        setReactionTime(Date.now() - startTime);
        setGameState(GAME_STATES.SUBMIT);
        break;

      default:
        break;
    }
  };

  const resetGame = () => {
    setGameState(GAME_STATES.WAITING);
    setReactionTime(null);
    setSubmitted(false);
    setHighScore(-1);
    setRank(-1);
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("You must be logged in to record scores.");
      return;
    }

    try {
      // recording the time if the user is logged in
      const res = await fetch("http://localhost:5000/reaction/record-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reactionTime }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitted(true);
        setHighScore(data.highScore);
        setRank(data.rank);
        fetchLeaderboard();
      } else {
        const msg = await res.text();
        console.error(msg);
      }
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  };

  const ReactionBox = () => (
    <div
      className={`reaction-box ${gameState.toLowerCase()}`}
      onClick={handleClick}
    >
      {gameState === GAME_STATES.WAITING && (
        <>
          <p className="reaction-text">
            When the red box turns green, click as quickly as you can.
          </p>
          <p className="click-start">Click anywhere to start.</p>
        </>
      )}

      {gameState === GAME_STATES.READY && (
        <p className="reaction-prompt">Wait for Green</p>
      )}

      {gameState === GAME_STATES.CLICKED && (
        <p className="reaction-prompt">
          {reactionTime ? `${reactionTime} ms` : "Click!"}
        </p>
      )}
    </div>
  );

  const SubmissionPanel = () => (
    <div className="submission-container">
      <p>
        Your Reaction Time: <strong>{reactionTime} ms</strong>
        {submitted && highScore !== -1 && (
          <>
            &nbsp;— High Score: <strong>{highScore}</strong> (rank&nbsp;
            <strong>{rank}</strong>)
          </>
        )}
      </p>

      {!submitted ? (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Score
        </button>
      ) : (
        <>
          <p className="submitted-message">Submitted!</p>
          <button onClick={resetGame}>Play Again?</button>
        </>
      )}
    </div>
  );

  const Leaderboard = () => (
    <div className="leaderboard-card">
      <h3>Leaderboard</h3>
      <ul className="leaderboard-list">
        {leaderboard.length === 0 && <p>No scores yet.</p>}
        {leaderboard.map((player, idx) => {
          const isYou =
            userData &&
            player.username === userData.username &&
            player.reactionTime === highScore;

          return (
            <li
              key={idx}
              className={`ranked-item rank-${idx + 1}${
                isYou ? " highlighted-row" : ""
              }`}
            >
              <span className="rank-number">{idx + 1}.</span>
              <span
                className={
                  isYou ? "highlighted-username" : "player-name"
                }
              >
                {player.username}
              </span>
              <span className="score">{player.reactionTime} ms</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className={`reaction-page-wrapper ${gameState.toLowerCase()}-bg`}>
      <Header />

      {/* game */}
      <div className="reaction-container">
        <ReactionBox />

        {gameState === GAME_STATES.SUBMIT && <SubmissionPanel />}

        <Leaderboard />
      </div>
    </div>
  );
}

export default ReactionTimePage;
