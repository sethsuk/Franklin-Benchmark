import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "../../components/Header/Header";
import { AuthContext } from "../../context/AuthContext";
import "./ReactionTimePage.css";

const GAME_STATES = {
  WAITING: "waiting",
  READY: "ready",
  CLICKED: "clicked",
  SUBMIT: "submit",
  TOO_SOON: "too_soon",
};

export default function ReactionTimePage() {
  const { token, userData } = useContext(AuthContext);

  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [reactionTime, setReactionTime] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(null);
  const [rank, setRank] = useState(null);

  const timeoutIdRef = useRef(null);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => { fetchLeaderboard(); }, []);

  useEffect(() => {
    if (gameState !== GAME_STATES.READY) return;

    const delay = Math.floor(Math.random() * 3000) + 1000;
    timeoutIdRef.current = setTimeout(() => {
      setGameState(GAME_STATES.CLICKED);
      setReactionTime(null);
      setStartTime(Date.now());
    }, delay);

    return () => clearTimeout(timeoutIdRef.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState === GAME_STATES.SUBMIT) fetchLeaderboard();
  }, [gameState]);

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
        clearTimeout(timeoutIdRef.current);
        setGameState(GAME_STATES.TOO_SOON);
        break;

      case GAME_STATES.CLICKED:
        setReactionTime(Date.now() - startTime);
        setGameState(GAME_STATES.SUBMIT);
        break;

      case GAME_STATES.TOO_SOON:
        resetGame();
        break;

      default:
        break;
    }
  };

  const resetGame = () => {
    setGameState(GAME_STATES.WAITING);
    setReactionTime(null);
    setSubmitted(false);
    setHighScore(null);
    setRank(null);
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("Log in to record scores.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/reaction/record-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reactionTime }),
      });

      if (res.ok) {
        const { highScore, rank } = await res.json();
        setSubmitted(true);
        setHighScore(highScore);
        setRank(rank);
        fetchLeaderboard();
      } else {
        console.error(await res.text());
      }
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  };

  const SubmissionPanel = () => (
    <div className="submission-container">
      <p>
        Score: <strong>{reactionTime}</strong> ms
        {submitted && highScore !== null && rank !== null && (
          <>
            , High Score: <strong>{highScore}</strong>
            , Rank: <strong>{rank}</strong>
          </>
        )}
      </p>

      {!submitted ? (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Score
        </button>
      ) : (
        <>
          <p className="submitted-message">Submitted!</p>
          <button onClick={resetGame}>Play Again?</button>
        </>
      )}
    </div>
  );

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
        <p className="reaction-prompt">Click!</p>
      )}

      {gameState === GAME_STATES.TOO_SOON && (
        <div className="too-soon-text">
          <p className="main-text">You Clicked Too Early!</p>
          <p className="sub-text">Click anywhere to restart.</p>
        </div>
      )}

      {gameState === GAME_STATES.SUBMIT && <SubmissionPanel />}
    </div>
  );

  const Leaderboard = () => (
    <div className="leaderboard-container">
      <h3>Leaderboard</h3>
      <ul className="leaderboard-list">
        {leaderboard.length === 0 && <p>No scores yet.</p>}
        {leaderboard.map((player, idx) => {
          const isYou = userData && player.username === userData.username;
          return (
            <li
              key={idx}
              className={`leaderboard-item rank-${idx + 1} ${
                isYou ? "highlighted" : ""
              }`}
            >
              <span>{idx + 1}. {player.username}</span>
              <span>{player.reactionTime} ms</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="reaction-page-wrapper">
      <Header />
      <div className="reaction-container">
        <ReactionBox />
      </div>
      <div className="leaderboard-wrapper">
        <Leaderboard />
      </div>
    </div>
  );
}