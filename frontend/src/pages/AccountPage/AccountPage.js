import React, { useEffect, useState, useContext } from 'react';
import Header from "../../components/Header/Header";
import { AuthContext } from '../../context/AuthContext';
import './AccountPage.css';

import { ReactComponent as QuickMathIcon } from './QuickMathIcon.svg';
import { ReactComponent as ButtonMasherIcon } from './ButtonMasherIcon.svg';
import { ReactComponent as ReactionTimeIcon } from './ReactionTimeIcon.svg';

const AccountPage = () => {
  const [accountAge, setAccountAge] = useState(null);
  const [masherData, setMasherData] = useState({ highScore: null, rank: null });
  const [reactionData, setReactionData] = useState({ highScore: null, rank: null });
  const [mathData, setMathData] = useState({ highScore: null, rank: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token, userData } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchWithAuth = (url) =>
          fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json());

        const [ageData, masher, reaction, math] = await Promise.all([
          fetchWithAuth("http://localhost:5000/user/account-age"),
          fetchWithAuth("http://localhost:5000/masher/user-rank"),
          fetchWithAuth("http://localhost:5000/reaction/user-rank"),
          fetchWithAuth("http://localhost:5000/math/user-rank"),
        ]);

        setAccountAge(ageData.account_age);
        setMasherData(masher);
        setReactionData(reaction);
        setMathData(math);
      } catch (err) {
        console.error(err);
        setError("Failed to load account data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Loading account data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="profile-card">
        <div className="profile-info">
          <h2>{userData?.username || "User"}</h2>
          <p>Joined {accountAge} day{accountAge !== 1 ? "s" : ""} ago</p>
        </div>
      </div>

      <div className="leaderboard-section">
        <h3>Games</h3>

        <div className="leaderboard-row">
          <div className="game-name">
            <QuickMathIcon className="game-icon" />
            Quick Math
          </div>
          <div>{mathData.highScore ?? "—"}</div>
          <div>Rank #{mathData.rank ?? "—"}</div>
        </div>

        <div className="leaderboard-row">
          <div className="game-name">
            <ButtonMasherIcon className="game-icon" />
            Button Masher
          </div>
          <div>{masherData.highScore ?? "—"}</div>
          <div>Rank #{masherData.rank ?? "—"}</div>
        </div>

        <div className="leaderboard-row">
          <div className="game-name">
            <ReactionTimeIcon className="game-icon" />
            Reaction Time
          </div>
          <div>{reactionData.highScore ? `${reactionData.highScore} ms` : "—"}</div>
          <div>Rank #{reactionData.rank ?? "—"}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;