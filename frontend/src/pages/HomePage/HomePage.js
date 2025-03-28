import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

import Header from '../../components/Header/Header';
import UsernameForm from '../../components/UsernameForm/UsernameForm';

function HomePage() {
  const [userData, setUserData] = useState(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.status === 'new_user') {
      setShowUsernameModal(true);
    }
  }, [userData]);

  return (
    <>
      <Header userData={userData} setUserData={setUserData} />
      <div className="home-container">
        <h1>Franklin Benchmark</h1>
        <p>Measure your abilities to compete against yourself and others</p>
        <div className="game-selection">
          <button className="game-button" onClick={() => navigate('/reaction-time')}>
            Reaction Time
          </button>
          <button className="game-button" onClick={() => navigate('/quick-math')}>Quick Math</button>
          <button className="game-button" onClick={() => navigate('/button-masher')}>Button Masher</button>
          {/* <button className="game-button">Speed Typing</button>
          <button className="game-button">Pitch Matcher</button> */}
        </div>
      </div>
      {showUsernameModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '300px',
          }}>
            <UsernameForm userData={userData} setUserData={setUserData} />
            <button onClick={() => setShowUsernameModal(false)} style={{ marginTop: '1rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;