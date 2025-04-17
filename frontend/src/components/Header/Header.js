import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import GoogleAuth from '../GoogleAuth/GoogleAuth';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { userData, loading } = useContext(AuthContext);

    // Show loading indicator while verifying token
    if (loading) return <div>Loading...</div>;

    return (
        <header className="header">
            {/* <div className="left-section"></div> */}
            <div className="right-section">
                {userData && userData.username ? (
                    <>
                        <span className="welcome-text">Welcome, {userData.username}!</span>
                        <button className="account-button" onClick={() => navigate('/account')}>
                            Account
                        </button>
                    </>
                ) : (
                    <GoogleAuth />
                )}
            </div>
        </header>
    );
};

export default Header;
