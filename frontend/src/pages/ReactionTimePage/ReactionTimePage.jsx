import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import "./ReactionTimePage.css";
import { ReactComponent as PennBenchmarkIcon } from './PennBenchmarkIcon.svg'

const GAME_STATES = {
  WAITING: "waiting",
  READY: "ready",
  CLICKED: "clicked",
  SUBMIT: "submit",
};

function ReactionTimePage() {
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(-1);
  const [rank, setRank] = useState(-1);
  const [lastSubmittedPlayer, setLastSubmittedPlayer] = useState(null);

  const timeoutIdRef = useRef(null);

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

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/reaction/leaderboard");
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

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

  const resetGame = () => {
    setGameState(GAME_STATES.WAITING);
    setReactionTime(null);
    setName("");
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
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const ReactionBox = () => (
    <div className={`reaction-box ${gameState.toLowerCase()}`} onClick={handleClick}>
      {gameState === GAME_STATES.WAITING && (
        <>
          <p className="reaction-text">When the red box turns green, click as quickly as you can.</p>
          <p className="click-start">Click anywhere to start.</p>
        </>
      )}
      {gameState === GAME_STATES.READY && <p className="reaction-prompt">Wait for Green</p>}
      {gameState === GAME_STATES.CLICKED && (
        <p className="reaction-prompt">{reactionTime ? `${reactionTime} ms` : "Click!!"}</p>
      )}
    </div>
  );

  const SubmissionForm = () => (
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

  const Leaderboard = () => (
    <div className="leaderboard-card">
      <h3>Leaderboard</h3>
      <ul className="leaderboard-list">
        {leaderboard.length > 0 ? (
          leaderboard.map((player, index) => {
            const isHighlighted =
              lastSubmittedPlayer &&
              player.username === lastSubmittedPlayer.username &&
              player.reactionTime === lastSubmittedPlayer.reactionTime;
            return (
              <li key={index} className={`ranked-item rank-${index + 1}`}> 
                <span className="rank-number">{index + 1}.</span>
                <span className={isHighlighted ? "highlighted-username" : "player-name"}>{player.username}</span>
                <span className="score">{player.reactionTime} ms</span>
              </li>
            );
          })
        ) : (
          <p>No scores yet.</p>
        )}
      </ul>
    </div>
  );

  return (
    <div className={`reaction-page-wrapper ${gameState.toLowerCase()}-bg`}>
      <div className="header-row">
        <div className="header-left">
          <div className="hamburger">&#9776;</div>
          <PennBenchmarkIcon className="svg-PennBenchmark" />
          <span className="brand-name">Franklin Benchmark</span>
        </div>
        <Header userData={{}} setUserData={() => {}} />
      </div>

      <div className="reaction-container">
        <ReactionBox />

        {gameState === GAME_STATES.SUBMIT && (
          <>
            <SubmissionForm />
            {submitted && <Leaderboard />}
          </>
        )}
      </div>
    </div>
  );
}

export default ReactionTimePage;