import React from 'react';
import GoogleAuth from '../GoogleAuth/GoogleAuth';

const Header = ({ userData, setUserData }) => {
    return (
        <header style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
            <div style={{ marginLeft: 'auto' }}>
            {userData ? (
                <span>Welcome, {userData.username || userData.email}!</span>
            ) : (
                <GoogleAuth setUserData={setUserData} />
            )}
            </div>
        </header>
    );
};

export default Header;
