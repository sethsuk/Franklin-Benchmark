import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuth = ({ setUserData }) => {
    const handleLoginSuccess = (credentialResponse) => {
        const idToken = credentialResponse.credential;
    
        console.log("Test TEST TEST");

        fetch('http://localhost:5000/user/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'existing_user') {
                setUserData(data.user);
            } else if (data.status === 'new_user') {
                setUserData(data);
            }
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