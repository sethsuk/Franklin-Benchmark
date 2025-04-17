import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../context/AuthContext';

const GoogleAuth = () => {
    const { setUserData, setToken } = useContext(AuthContext);

    const handleLoginSuccess = (credentialResponse) => {
        const idToken = credentialResponse.credential;

        fetch('http://localhost:5000/user/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        })
        .then(res => res.json())
        .then(data => {
            // stash the token so /verify works immediately
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUserData(data.user);   // user.username == null for brand‑new accounts
        })
        .catch(error => console.error('Login failed:', error));
        };
    
        return (
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Google login failed')}
            />
        );
    };

export default GoogleAuth;