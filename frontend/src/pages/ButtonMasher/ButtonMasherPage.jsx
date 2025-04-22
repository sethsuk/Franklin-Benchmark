import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/Header/Header";
import { AuthContext } from "../../context/AuthContext";

import "./ButtonMasher.css";
import { ReactComponent as MashButtonSVG } from "./BUTTON.svg";

export default function ButtonMasherPage() {
  const { token, userData } = useContext(AuthContext);

  // const [duration, setDuration] = useState(10);
  const [clickCount, setClickCount] = useState(0);

  const DURATION = 10;

  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(-1);
  const [rank, setRank] = useState(-1);
  const [lastSubmittedPlayer, setLastSubmittedPlayer] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/masher/leaderboard");
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  };

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
          return prev - 1 >= 0 ? prev - 1 : 0;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (gameOver) fetchLeaderboard();
  }, [gameOver]);

  const handleStart = () => {
    setClickCount(0);
    setTimeLeft(DURATION);
    setGameOver(false);
    setGameStarted(true);
    setSubmitted(false);
    setHighScore(-1);
    setRank(-1);
    setLastSubmittedPlayer(null);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/masher/record-mashes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mashes: clickCount }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitted(true);
        setLastSubmittedPlayer({ username: userData.username, mashes: clickCount });
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
      <Header/>

      <div className="buttonmasher-container">
        {/* <div className="duration-buttons">
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
        </div> */}

        <div className="game-box">
          {!gameOver ? (
            <>
              <p className="instruction">
                Click the <span className="red">button</span> as fast as you can!
              </p>
              <div
                className="mash-button"
                onClick={gameStarted ? () => setClickCount(c => c + 1) : handleStart}
              >
              {gameStarted ? <MashButtonSVG /> : <span className="start-label">START</span>}
              </div>
              <div className="stats">
                <span>Time: {timeLeft} s</span>
                <span>High Score: {clickCount}</span>
              </div>
            </>
          ) : (
            <>
              <h2>Time's Up!</h2>
              <p>
              Score: <strong>{clickCount}</strong> 
              {submitted && highScore !== -1 && rank !== -1 && (
                <>
                , High Score:&nbsp;<strong>{highScore}</strong>
                , Rank:&nbsp;<strong>{rank}</strong>
                </>
              )}
              </p>

              {!submitted ? (
                <button className="start-button" onClick={handleSubmit}>
                  Submit
                </button>
              ) : (
                <>
                  <p className="submitted-message">Submitted!</p>
                  <button className="start-button" onClick={handleStart}>Play Again</button>
                </>
              )}
            </>
          )}
        </div>

        {leaderboard.length > 0 && (
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
          </div>
        )}
      </div>
    </div>
  );
}
