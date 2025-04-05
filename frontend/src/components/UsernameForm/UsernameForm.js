import { useState } from 'react';

const UsernameForm = ({ userData, setUserData }) => {
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

            // store the new JWT token with username in localStorage
            localStorage.setItem('token', data.token);

            // remove the old temp token without username
            localStorage.removeItem('tempToken');

            setUserData({ ...userData, username });
        })
        .catch(err => setError(err.message || 'Error creating user'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
            />
            <button type="submit">Create Account</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default UsernameForm;
