import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

/**
 * AuthProvider keeps the JWT in one place:
 *   • React state  (so components can react to it)
 *   • localStorage (so a hard‑refresh survives)
 *
 * It re‑verifies the token with GET /user/verify whenever the token
 * first appears or changes, and exposes a single helper (setToken)
 * that automatically keeps state and localStorage in sync.
 */
export const AuthProvider = ({ children }) => {
  const [token, _setToken] = useState(() => localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(!!token);
  const [error, setError]   = useState(null);

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }

    _setToken(newToken);
  };

  useEffect(() => {
    if (!token) { // no token --> nothing to verify
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/user/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Bad or expired token');
        return res.json(); // { message, user: { username, ... } }
      })
      .then(({ user }) => {
        setUserData(user);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Token verification error:', err);
        setToken(null); // wipes disk and state
        setUserData(null);
        setLoading(false);
        setError('Session expired — please sign in again.');
      });
  }, [token]); // fires on mount + every token change

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        token,
        setToken,   // use this instead of localStorage.setItem directly
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};