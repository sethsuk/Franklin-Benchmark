import React, { useState, useEffect, useRef } from 'react';
import '../styles/ReactionTimePage.css';

function ReactionTimePage() {
  const [gameState, setGameState] = useState('waiting');
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const timeoutIdRef = useRef(null);

  const fetchLeaderboard = async () => {
    console.log("fetchLeaderboard() called!");
    try {
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

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (gameState === 'ready') {
      const randomDelay = Math.floor(Math.random() * 3000) + 1000;
      timeoutIdRef.current = setTimeout(() => {
        setGameState('clicked');
        setStartTime(Date.now());
      }, randomDelay);

      return () => clearTimeout(timeoutIdRef.current);
    }
  }, [gameState]);

  const handleClick = () => {
    if (gameState === 'waiting') {
      setGameState('ready');
    } 
    else if (gameState === 'ready') {
      alert("You clicked too early!");
      setGameState('waiting');

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    }
    else if (gameState === 'clicked') {
      setReactionTime(Date.now() - startTime);
      setGameState('submit');
    }
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
        console.log("Score submitted!");
        setSubmitted(true);
        fetchLeaderboard();
      } else {
        console.error("Failed to submit score");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="reaction-container">
      <h1>Reaction Time</h1>

      {gameState === 'waiting' && (
        <div className="reaction-box blue" onClick={handleClick}>
          Click anywhere to start.
        </div>
      )}

    {gameState === 'ready' && (
    <div className="reaction-box red" onClick={handleClick}>
      Wait for green...
    </div>
  )}


      {gameState === 'clicked' && (
        <div className="reaction-box green" onClick={handleClick}>
          {reactionTime ? `${reactionTime} ms` : 'Click!'}
        </div>
      )}

{gameState === 'submit' && (
  <div className="submission-container">
    <p>Your Reaction Time: <strong>{reactionTime} ms</strong></p>
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
        <button
          onClick={() => {
            setGameState('waiting');
            setReactionTime(null);
            setName('');
            setSubmitted(false);
          }}
        >
          Play Again?
        </button>
      </>
    )}
  </div>
)}


      <div className="leaderboard-container">
        <h2>Leaderboard</h2>
        <ul className="leaderboard-list">
          {leaderboard.length > 0 ? (
            leaderboard.map((player, index) => (
              <li key={index}>
                {index + 1}. 
                <strong 
                  className={player.username === name ? "highlighted-username" : ""}
                > {player.username}
                </strong> 
                - {player.reactionTime} ms
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