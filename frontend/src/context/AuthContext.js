import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // check if there's a token in localStorage
        const token = localStorage.getItem('token');

        // console.log("AuthContext triggered.");

        if (token) {
            // console.log("token found.");

            // verify the token
            fetch('http://localhost:5000/user/verify', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => {
                if (!res.ok) {
                    // faulty response => remove token and set error
                    localStorage.removeItem('token');
                    setError('Token verification failed.');
                    setLoading(false);
                    return;
                }
                // console.log("good response");
                return res.json();
            })
            .then(data => {
                if (data && data.user) {
                    // console.log("set user data");
                    // set user data using verified token
                    setUserData(data.user);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Token verification error:', err);
                setError('Token verification error.');
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ userData, setUserData, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
