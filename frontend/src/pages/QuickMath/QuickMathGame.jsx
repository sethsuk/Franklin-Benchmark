import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Leaderboard from "./Leaderboard";
import "./QuickMath.css";

function generateQuestion() {
  const ops = ["+", "-", "×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 99) + 2;
      b = Math.floor(Math.random() * 99) + 2;
      answer = a + b;
      break;
    case "-":
      b = Math.floor(Math.random() * 99) + 2;
      a = Math.floor(Math.random() * 99) + 2 + b;
      answer = a - b;
      break;
    case "×":
      a = Math.floor(Math.random() * 11) + 2;
      b = Math.floor(Math.random() * 99) + 2;
      answer = a * b;
      break;
    default: // ÷
      b = Math.floor(Math.random() * 99) + 2;
      answer = Math.floor(Math.random() * 11) + 2;
      a = b * answer;
  }
  return { question: `${a} ${op} ${b}`, answer };
}

export default function QuickMathGame() {
  const { token, userData } = useContext(AuthContext);

  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionData, setQuestionData] = useState(generateQuestion());
  const [input, setInput] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [highScore, setHighScore] = useState(null);
  const [rank, setRank] = useState(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [lastSubmittedPlayer, setLastSubmittedPlayer] = useState(null);

  useEffect(() => {fetchLeaderboard()}, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/math/leaderboard");
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  };

  useEffect(() => {
    if (parseInt(input) === questionData.answer) {
      setScore((s) => s + 1);
      setInput("");
      setQuestionData(generateQuestion());
    }
  }, [input, questionData.answer]);

  useEffect(() => {
    if (!gameStarted || timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (gameStarted && timeLeft === 0) fetchLeaderboard();
  }, [timeLeft, gameStarted]);

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (parseInt(input) === questionData.answer) {
      setScore((s) => s + 1);
    }
    setInput("");
    setQuestionData(generateQuestion());
  };

  const handleSubmitScore = async () => {
    try {
      const res = await fetch("http://localhost:5000/math/record-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }),
      });

      if (res.ok) {
        const { highScore, rank } = await res.json();
        setSubmitted(true);
        setLastSubmittedPlayer({ username: userData.username, score });

        setHighScore(highScore);
        setRank(rank);
        fetchLeaderboard();
      } else {
        console.error("Score submit failed");
      }
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setTimeLeft(20);
    setScore(0);
    setInput("");
    setSubmitted(false);
    setHighScore(null);
    setRank(null);
    setLastSubmittedPlayer(null);
    setQuestionData(generateQuestion());
  };

  const handleStart = () => {
    setGameStarted(true);
    setTimeLeft(20);
    setScore(0);
    setInput("");
    setSubmitted(false);
    setHighScore(null);
    setRank(null);
    setLastSubmittedPlayer(null);
    setQuestionData(generateQuestion());
  };
  
  return (
    <div className="quick-math-wrapper">
      <div className="quick-math-board">
        <div className="top-bar">
          <span>Time {timeLeft}s</span>
          <span>Score {score}</span>
        </div>

        <div className="question-display">{questionData.question}</div>

        {!gameStarted ? (
          <button
            onClick={handleStart}
            className="start-button bg-blue-500 text-white px-6 py-3 rounded"
          >
            Start
          </button>
        ) : timeLeft > 0 ? (
          <form onSubmit={handleSubmitAnswer}>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="math-input"
              autoFocus
            />
          </form>
        ) : (
          <>
            <div className="submission-container"> 
              <p>
                Score: <strong>{score}</strong>
                {submitted && highScore !== null && rank !== null && (
                  <>
                    , High Score:&nbsp;<strong>{highScore}</strong>
                    , Rank:&nbsp;<strong>{rank}</strong>
                  </>
                )}
              </p>

              {!submitted ? (
                <button
                  onClick={handleSubmitScore}
                  className="ml-2 bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={resetGame}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Play Again
                </button>
              )}
            </div>

            <Leaderboard
                      leaderboard={leaderboard}
                      lastSubmittedPlayer={lastSubmittedPlayer}
                    />
          </>
        )}

      </div>
    </div>
  );
}
