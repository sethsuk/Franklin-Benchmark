import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

/**
 * AuthProvider manages username-based authentication:
 *   • React state (so components can react to it)
 *   • localStorage (so a hard-refresh survives)
 *
 * Simple username storage - no tokens or server verification needed.
 */
export const AuthProvider = ({ children }) => {
  const [username, setUsernameState] = useState(() => localStorage.getItem('username'));
  const [loading, setLoading] = useState(false);

  const setUsername = (newUsername) => {
    if (newUsername) {
      localStorage.setItem('username', newUsername);
    } else {
      localStorage.removeItem('username');
    }
    setUsernameState(newUsername);
  };

  const logout = () => {
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        setUsername,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};