import React, { useEffect, useState } from "react";
import SubmissionForm from "./SubmissionForm";
import Leaderboard from "./Leaderboard";

function generateQuestion() {
  const ops = ["+", "-", "×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a, b, question, answer;

  if (op === "+") {
    a = Math.floor(Math.random() * 99) + 2;
    b = Math.floor(Math.random() * 99) + 2;
    answer = a + b;
  } else if (op === "-") {
    b = Math.floor(Math.random() * 99) + 2;
    a = Math.floor(Math.random() * 99) + 2 + b;
    answer = a - b;
  } else if (op === "×") {
    a = Math.floor(Math.random() * 11) + 2;
    b = Math.floor(Math.random() * 99) + 2;
    answer = a * b;
  } else {
    b = Math.floor(Math.random() * 99) + 2;
    answer = Math.floor(Math.random() * 11) + 2;
    a = b * answer;
  }

  question = `${a} ${op} ${b}`;
  return { question, answer };
}

export default function QuickMathGame() {
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [questionData, setQuestionData] = useState(generateQuestion());
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(-1);
  const [rank, setRank] = useState(-1);
  const [lastSubmittedPlayer, setLastSubmittedPlayer] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) clearInterval(timer);
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/quickmath/leaderboard");
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (parseInt(input) === questionData.answer) {
      setScore((s) => s + 1);
    }
    setInput("");
    setQuestionData(generateQuestion());
  };

  const handleSubmitScore = async () => {
    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/quickmath/record-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, score }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitted(true);
        setLastSubmittedPlayer({ username: name, score });
        fetchLeaderboard();
        setHighScore(data.highScore);
        setRank(data.rank);
      } else {
        console.error("Failed to submit score");
      }
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  };

  const resetGame = () => {
    setTimeLeft(5);
    setScore(0);
    setInput("");
    setSubmitted(false);
    setName("");
    setHighScore(-1);
    setRank(-1);
    setLastSubmittedPlayer(null);
    setQuestionData(generateQuestion());
  };

  return (
    <div className="text-center space-y-6">
      <p className="text-lg">Time Left: {timeLeft}s</p>
      <p className="text-2xl font-semibold">{questionData.question}</p>

      {timeLeft > 0 ? (
        <form onSubmit={handleSubmitAnswer}>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-3 py-2 rounded text-xl"
          />
          <button
            type="submit"
            className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      ) : (
        <SubmissionForm
          name={name}
          setName={setName}
          handleSubmit={handleSubmitScore}
          submitted={submitted}
          resetGame={resetGame}
          score={score}
          highScore={highScore}
          rank={rank}
        />
      )}

      <Leaderboard leaderboard={leaderboard} lastSubmittedPlayer={lastSubmittedPlayer} />
    </div>
  );
}