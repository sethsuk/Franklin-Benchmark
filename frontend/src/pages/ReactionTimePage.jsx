import React, { useState, useEffect } from 'react';
import '../styles/ReactionTimePage.css';

function ReactionTimePage() {
  const [gameState, setGameState] = useState('waiting');
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);

  // Fetch leaderboard from backend
  const fetchLeaderboard = async () => {
    console.log("fetchLeaderboard() called!");
  
    try {
      const response = await fetch("http://localhost:5000/reaction/leaderboard", {
        method: "POST",
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
    console.log("\n\nuse effect triggered\n\n");
    fetchLeaderboard();
  }, []);
    
  useEffect(() => {
    if (gameState === 'ready') {
      const delay = Math.floor(Math.random() * 3000) + 1000;
      const id = setTimeout(() => {
        setGameState('go');
        setStartTime(Date.now());
      }, delay);
      setTimeoutId(id);
    }

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [gameState]);

  const handleClick = () => {
    if (gameState === 'waiting') {
      setGameState('ready');
    } else if (gameState === 'ready') {
      // Penalize early clicks
      setGameState('waiting');
      alert("Too early! Click to try again.");
    } else if (gameState === 'go') {
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

      console.log(response);

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
        <div className="reaction-box red">
          Wait for green...
        </div>
      )}

      {gameState === 'go' && (
        <div className="reaction-box green" onClick={handleClick}>
          {reactionTime ? `${reactionTime} ms` : 'Click!'}
        </div>
      )}

      {gameState === 'submit' && (
        <div className="submission-container">
          <p>Your Reaction Time: <strong>{reactionTime} ms</strong></p>
          {!submitted ? (
            <>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="name-input"
              />
              <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </>
          ) : (
            <p className="submitted-message">Submitted!</p>
          )}
        </div>
      )}

      <div className="leaderboard-container">
        <h2>Leaderboard</h2>
        {leaderboard.length > 0 ? (
          <ul>
            {leaderboard.map((player, index) => (
              <li key={index}>
              {index + 1}. 
              <strong 
                className={player.reaction_time === reactionTime ? "highlighted-username" : ""}
              >
                {player.username}
              </strong> 
              - {player.reaction_time} ms
            </li>
            ))}
          </ul>
        ) : (
          <p>No scores available yet.</p>
        )}
      </div>
    </div>
  );
}

export default ReactionTimePage;