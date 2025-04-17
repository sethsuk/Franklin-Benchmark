import React, { useEffect, useState, useContext } from 'react';
import Header from "../../components/Header/Header";
import { AuthContext } from '../../context/AuthContext';

const AccountPage = () => {
    const [accountAge, setAccountAge] = useState(null);
    const [masherData, setMasherData] = useState({ highScore: null, rank: null });
    const [reactionData, setReactionData] = useState({ highScore: null, rank: null });
    const [mathData, setMathData] = useState({ highScore: null, rank: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch account age
                const ageResponse = await fetch('http://localhost:5000/user/account-age', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const ageData = await ageResponse.json();

                if(ageResponse.ok) {
                    setAccountAge(ageData.account_age);
                } else {
                    throw new Error(ageData.message || 'Failed to fetch account age');
                }

                // Fetch Masher leaderboard
                const masherResponse = await fetch('http://localhost:5000/masher/user-rank', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const masherRankData = await masherResponse.json();

                if(masherResponse.ok) {
                    setMasherData({
                        highScore: masherRankData.highScore,
                        rank: masherRankData.rank,
                      });
                } else {
                    throw new Error(masherRankData.error || 'Failed to fetch masher ranking');
                }

                // Fetch Reaction leaderboard
                const reactionResponse  = await fetch('http://localhost:5000/reaction/user-rank', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const reactionRankData = await reactionResponse.json();

                if(reactionResponse.ok) {
                    setReactionData({
                        highScore: reactionRankData.highScore,
                        rank: reactionRankData.rank,
                      });
                } else {
                    throw new Error(reactionRankData.error || 'Failed to fetch reaction time ranking');
                }

                // Fetch Math leaderboard
                const mathResponse  = await fetch('http://localhost:5000/math/user-rank', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const mathRankData = await mathResponse.json();

                if(mathResponse.ok) {
                    setMathData({
                        highScore: mathRankData.highScore,
                        rank: mathRankData.rank,
                      });
                } else {
                    throw new Error(mathRankData.error || 'Failed to fetch math ranking');
                }

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // placeholder while fetching data
    if (loading) return <p>Loading account data...</p>;

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="account-page">
        <Header/>
          <h1>Account Details</h1>
    
          <section className="account-age-section">
            <h2>Account Age</h2>
            {accountAge !== null ? (
              <p>Joined {accountAge} day{accountAge !== 1 ? 's' : ''} ago</p>
            ) : (
              <p>Account age not available.</p>
            )}
          </section>
    
          <section className="minigame-rankings">
            <h2>Leaderboard</h2>
            <div className="minigame">
              <h3>Button Masher</h3>
              <p>High Score: {masherData.highScore !== null ? masherData.highScore : 'No records'}</p>
              <p>Rank: {masherData.rank !== null ? masherData.rank : 'No records'}</p>
            </div>
            <div className="minigame">
              <h3>Reaction Time</h3>
              <p>High Score: {reactionData.highScore !== null ? reactionData.highScore : 'No records'}</p>
              <p>Rank: {reactionData.rank !== null ? reactionData.rank : 'No records'}</p>
            </div>
            <div className="minigame">
              <h3>Quick Math</h3>
              <p>High Score: {mathData.highScore !== null ? mathData.highScore : 'No records'}</p>
              <p>Rank: {mathData.rank !== null ? mathData.rank : 'No records'}</p>
            </div>
          </section>
        </div>
      );
};

export default AccountPage;
