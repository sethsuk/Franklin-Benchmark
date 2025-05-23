import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './UsernameForm.css'

const UsernameForm = () => {
    const { userData, setUserData, setToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/user/auth/register-username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, username })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => Promise.reject(err));
            }
            return res.json();
        })
        .then(data => {
            console.log(data.message);
            setToken(data.token);
            
            // update the auth context with the new username
            setUserData({ ...userData, username });
        })
        .catch(err => setError(err.message || 'Error creating user'));
    };

    return (
        <form className="username-form" onSubmit={handleSubmit}>
            <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
            />
            <button type="submit">Create Account</button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export default UsernameForm;
