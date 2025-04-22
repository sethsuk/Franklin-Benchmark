import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import GoogleAuth from '../GoogleAuth/GoogleAuth';
import { ReactComponent as PennBenchmarkIcon } from './PennBenchmarkIcon.svg';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { userData, loading } = useContext(AuthContext);

    // Show loading indicator while verifying token
    if (loading) return <div>Loading...</div>;

    return (
        < header className="header-row">
            <div className="header-left">
                <div></div>
                    <Link to="/" className="brand-link">
                        <PennBenchmarkIcon className="svg-PennBenchmark" />
                        <span className="brand-name">Franklin&nbsp;Benchmark</span>
                    </Link>
                </div>
        
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
