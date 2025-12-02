import React, { useEffect, useState, useContext } from 'react';
import Header from "../../components/Header/Header";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
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

  const { username } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [ageData, masher, reaction, math] = await Promise.all([
          fetch(`${API_BASE_URL}/user/account-age/${username}`).then((res) => res.json()),
          fetch(`${API_BASE_URL}/masher/user-rank/${username}`).then((res) => res.json()),
          fetch(`${API_BASE_URL}/reaction/user-rank/${username}`).then((res) => res.json()),
          fetch(`${API_BASE_URL}/math/user-rank/${username}`).then((res) => res.json()),
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
  }, [username, navigate]);

  if (loading) return <p>Loading account data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="profile-card">
        <div className="profile-info">
          <h2>{username || "User"}</h2>
          {accountAge !== null && <p>Joined {accountAge} day{accountAge !== 1 ? "s" : ""} ago</p>}
        </div>
      </div>

      <div className="leaderboard-section">
        <h3>Games</h3>

        <div className="leaderboard-row">
          <div className="game-name">
              <QuickMathIcon className="game-icon" />
              Quick Math
            </div>
            <div className="score">
              <span className="bold-text">High Score:</span> {mathData.highScore ?? "—"} calcs
            </div>
            <div className="rank">
              <span className="bold-text">Rank #</span>{mathData.rank ?? "—"}
            </div>
          </div>

          <div className="leaderboard-row">
            <div className="game-name">
              <ButtonMasherIcon className="game-icon" />
              Button Masher
            </div>
            <div className="score">
              <span className="bold-text">High Score:</span> {masherData.highScore ?? "—"} clicks
            </div>
            <div className="rank">
              <span className="bold-text">Rank #</span>{masherData.rank ?? "—"}
            </div>
          </div>

          <div className="leaderboard-row">
            <div className="game-name">
              <ReactionTimeIcon className="game-icon" />
              Reaction Time
            </div>
            <div className="score">
              <span className="bold-text">High Score:</span> {reactionData.highScore ? `${reactionData.highScore} ms` : "—"}
            </div>
            <div className="rank">
              <span className="bold-text">Rank #</span>{reactionData.rank ?? "—"}
            </div>
          </div>


      </div>
    </div>
  );
};

export default AccountPage;