import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleAuth from '../GoogleAuth/GoogleAuth';

import './Header.css';

const Header = ({ userData, setUserData }) => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="left-section">
                <button className="home-button" onClick={() => navigate('/')}>
                    Franklin Benchmark
                </button>
            </div>
            <div className="right-section">
                {userData && userData.username ? (
                    <span className="welcome-text">Welcome, {userData.username}!</span>
                ) : (
                    <GoogleAuth setUserData={setUserData} />
                )}
            </div>
        </header>
    );
};

export default Header;
