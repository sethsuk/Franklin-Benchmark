import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ReactComponent as PennBenchmarkIcon } from './PennBenchmarkIcon.svg';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { username, setUsername, logout, loading } = useContext(AuthContext);
    const [inputUsername, setInputUsername] = useState('');
    const [showInput, setShowInput] = useState(false);

    // Show loading indicator while verifying
    if (loading) return <div>Loading...</div>;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSetUsername = (e) => {
        e.preventDefault();
        if (inputUsername.trim()) {
            setUsername(inputUsername.trim());
            setShowInput(false);
            setInputUsername('');
        }
    };

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
                {username ? (
                    <>
                        <span className="welcome-text">Welcome, {username}!</span>
                        <button className='logout-button' onClick={handleLogout}>Change User</button>
                    </>
                ) : showInput ? (
                    <form onSubmit={handleSetUsername} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={inputUsername}
                            onChange={(e) => setInputUsername(e.target.value)}
                            placeholder="Enter username"
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            autoFocus
                        />
                        <button type="submit" className="account-button">Set</button>
                        <button type="button" className="logout-button" onClick={() => setShowInput(false)}>Cancel</button>
                    </form>
                ) : (
                    <button className="account-button" onClick={() => setShowInput(true)}>
                        Set Username
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
