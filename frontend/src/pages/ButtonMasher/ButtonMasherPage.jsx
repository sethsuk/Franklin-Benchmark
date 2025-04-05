import React, { useState, useEffect } from "react";
import MasherSubmissionForm from "./MasherSubmissionForm";
import MasherLeaderboard from "./MasherLeaderboard";

function ButtonMasherPage() {
  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(-1);
  const [rank, setRank] = useState(-1);
  const [lastSubmittedPlayer, setLastSubmittedPlayer] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/masher/leaderboard", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name before submitting!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/masher/record-mashes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, mashes: clickCount })
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitted(true);
        setHighScore(data.highScore);
        setRank(data.rank);
        setLastSubmittedPlayer({ username: name, mashes: data.highScore });
        fetchLeaderboard();
      } else {
        console.error("Failed to submit score");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const startGame = () => {
    setClickCount(0);
    setTimeLeft(20);
    setGameOver(false);
    setSubmitted(false);
    setHighScore(-1);
    setRank(-1);
    setLastSubmittedPlayer(null);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(interval);
          setGameOver(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="reaction-container">
      <h1>Button Masher</h1>

      {!gameOver ? (
        <>
          <p className="timer-text">Time Left: {timeLeft}s</p>
          <button
            className="mash-button-box"
            onClick={() => setClickCount((count) => count + 1)}
            disabled={timeLeft <= 0}
          >
            Click Me!
          </button>
          <p className="click-count-text">Click Count: {clickCount}</p>
          {timeLeft === 20 && (
            <button className="submit-button" onClick={startGame}>
              Start Game
            </button>
          )}
        </>
      ) : (
        <>
          <div className="game-over">
            <h2>Time's Up!</h2>
            <p>You clicked {clickCount} times!</p>
          </div>

          <MasherSubmissionForm
            name={name}
            setName={setName}
            handleSubmit={handleSubmit}
            submitted={submitted}
            resetGame={startGame}
            mashes={clickCount}
            highScore={highScore}
            rank={rank}
          />
        </>
      )}

      <MasherLeaderboard leaderboard={leaderboard} lastSubmittedPlayer={lastSubmittedPlayer} />
    </div>
  );
}

export default ButtonMasherPage;