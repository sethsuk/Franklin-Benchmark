import React, { useState, useEffect, useRef } from 'react';
import './ReactionTimePage.css';

import Header from '../../components/Header/Header';

const GAME_STATES = {
  WAITING: 'waiting',
  READY: 'ready',
  CLICKED: 'clicked',
  SUBMIT: 'submit',
};

function ReactionTimePage() {
  const [userData, setUserData] = useState(null);

  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);
  
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(-1);
  const [rank, setRank] = useState(-1);
  
  // Store the timeout ID to clear if user clicks too early
  const timeoutIdRef = useRef(null);

  const fetchLeaderboard = async () => {
    try {
      console.log("fetchLeaderboard() called!");
      const response = await fetch("http://localhost:5000/reaction/leaderboard", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      console.log("API Response Status:", response.status);
      const data = await response.json();
      console.log("Leaderboard Data:", data);

      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      } else {
        setLeaderboard([]);
      }
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
  };

  const handleSubmit = async () => {
    // Require the user to enter a name
    if (!name.trim()) {
      alert("Please enter your name before submitting TEST TEST TEST!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reaction/record-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, reactionTime }),
      });

      if (response.ok) {
        console.log("Score submitted!");
        const data = await response.json();

        // Mark as submitted and fetch updated leaderboard
        setSubmitted(true);
        fetchLeaderboard();

        // Update high score & rank from server response
        setHighScore(data.highScore);
        setRank(data.rank);
      } else {
        console.error("Failed to submit score");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };


  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATES.READY) {
      const randomDelay = Math.floor(Math.random() * 3000) + 1000; // 1-3 seconds
      timeoutIdRef.current = setTimeout(() => {
        setGameState(GAME_STATES.CLICKED);
        setStartTime(Date.now());
      }, randomDelay);

      // Cleanup if user clicks early
      return () => clearTimeout(timeoutIdRef.current);
    }
  }, [gameState]);


  const handleClick = () => {
    switch (gameState) {
      case GAME_STATES.WAITING:
        setGameState(GAME_STATES.READY);
        break;
      
      case GAME_STATES.READY:
        // User clicked too early
        alert("You clicked too early!");
        setGameState(GAME_STATES.WAITING);

        // Clear the randomDelay timeout
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        break;
      
      case GAME_STATES.CLICKED:
        // User clicked green -> record reaction time
        setReactionTime(Date.now() - startTime);
        setGameState(GAME_STATES.SUBMIT);
        break;
      
      default:
        break;
    }
  };


  return (
    <div className="reaction-container">
      <Header userData={userData} setUserData={setUserData} />
      <h1>Reaction Time</h1>

      {/*WAITING (Blue)*/}
      {gameState === GAME_STATES.WAITING && (
        <div className="reaction-box blue" onClick={handleClick}>
          Click anywhere to start.
        </div>
      )}

      {/*READY (Red)*/}
      {gameState === GAME_STATES.READY && (
        <div className="reaction-box red" onClick={handleClick}>
          Wait for green...
        </div>
      )}

      {/*CLICKED (Green)*/}
      {gameState === GAME_STATES.CLICKED && (
        <div className="reaction-box green" onClick={handleClick}>
          {reactionTime ? `${reactionTime} ms` : 'Click!'}
        </div>
      )}

      {/*SUBMIT*/}
      {gameState === GAME_STATES.SUBMIT && (
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

          {/* If not submitted, show the form. Otherwise, show "Submitted!" + Play Again */}
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
              <button onClick={resetGame}>
                Play Again?
              </button>
            </>
          )}
        </div>
      )}

      {/* Leaderboard */}
      <div className="leaderboard-container">
        <h2>Leaderboard</h2>
        <ul className="leaderboard-list">
          {leaderboard.length > 0 ? (
            leaderboard.map((player, index) => (
              <li key={index}>
                {index + 1}.{" "}
                <strong
                  className={player.username === name ? "highlighted-username" : ""}
                >
                  {player.username}
                </strong>
                {" - "} 
                {player.reactionTime} ms
              </li>
            ))
          ) : (
            <p>No scores available yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ReactionTimePage;
