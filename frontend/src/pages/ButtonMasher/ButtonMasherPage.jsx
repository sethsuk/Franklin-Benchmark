import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { ReactComponent as PennBenchmarkIcon } from './PennBenchmarkIcon.svg';
import "./ButtonMasher.css";

export default function ButtonMasherPage() {
  const [duration, setDuration] = useState(10);
  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(-1);
  const [rank, setRank] = useState(-1);
  const [lastSubmittedPlayer, setLastSubmittedPlayer] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            setGameStarted(false);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, gameStarted]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/masher/leaderboard");
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  };

  const handleStart = () => {
    setClickCount(0);
    setTimeLeft(duration);
    setGameOver(false);
    setGameStarted(true);
    setSubmitted(false);
    setHighScore(-1);
    setRank(-1);
    setLastSubmittedPlayer(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/masher/record-mashes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, mashes: clickCount }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitted(true);
        setLastSubmittedPlayer({ username: name, mashes: clickCount });
        setHighScore(data.highScore);
        setRank(data.rank);
        fetchLeaderboard();
      }
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  };

  const getRankClass = (index) => {
    if (index === 0) return "gold";
    if (index === 1) return "silver";
    if (index === 2) return "bronze";
    return "";
  };

  return (
    <div className="buttonmasher-wrapper">
      <div className="header-row">
        <div className="header-left">
          <div className="hamburger">&#9776;</div>
          <PennBenchmarkIcon className="svg-PennBenchmark" />
          <span className="brand-name">Franklin Benchmark</span>
        </div>
        <Header userData={{}} setUserData={() => {}} />
      </div>

      <div className="buttonmasher-container">
        <div className="duration-buttons">
          {[10, 30, 60].map((d) => (
            <button
              key={d}
              className={`duration-button ${duration === d ? "active" : ""}`}
              onClick={() => setDuration(d)}
              disabled={gameStarted}
            >
              {d === 60 ? "1 minute" : `${d} seconds`}
            </button>
          ))}
        </div>

        <div className="game-box">
          {!gameOver ? (
            <>
              <p className="instruction">
                Click the <span className="red">button</span> as fast as you can!
              </p>
              <button
                className="start-button"
                onClick={gameStarted ? () => setClickCount(c => c + 1) : handleStart}
              >
                {gameStarted ? "CLICK!" : "START"}
              </button>
              <div className="stats">
                <span>Time: {timeLeft.toFixed(2)} s</span>
                <span>High Score: {clickCount}</span>
              </div>
            </>
          ) : (
            <>
              <h2>Time's Up!</h2>
              <p>You clicked <strong>{clickCount}</strong> times!</p>

              {!submitted ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="name-input"
                  />
                  <button className="start-button" onClick={handleSubmit}>Submit</button>
                </>
              ) : (
                <>
                  <p className="submitted-message">Submitted!</p>
                  <button className="start-button" onClick={handleStart}>Play Again</button>
                </>
              )}
            </>
          )}
        </div>

        {gameOver && submitted && (
          <div className="leaderboard-container">
            <h3>Leaderboard</h3>
            <ul className="leaderboard-list">
              {leaderboard.map((entry, index) => {
                const isUser =
                  lastSubmittedPlayer?.username === entry.username &&
                  lastSubmittedPlayer?.mashes === entry.mashes;
                return (
                  <li
                    key={index}
                    className={`leaderboard-item ${getRankClass(index)} ${
                      isUser ? "highlighted" : ""
                    }`}
                  >
                    <span>{index + 1}. {entry.username}</span>
                    <span>{entry.mashes} clicks</span>
                  </li>
                );
              })}
            </ul>
            <p className="leaderboard-footer">click to view more</p>
          </div>
        )}
      </div>
    </div>
  );
}
