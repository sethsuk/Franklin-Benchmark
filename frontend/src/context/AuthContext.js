import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // On app load, check if there's a token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
        // Verify the token with your backend
        fetch('http://localhost:5000/user/verify', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
            if (!res.ok) {
                // faulty response
                localStorage.removeItem('token');
                return;
            }

            return res.json();
            })
            .then(data => {
            if (data) {
                // Set user data using verified token
                setUserData(data.user);
            }
            })
            .catch(err => console.error('Token verification error:', err));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ userData, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
