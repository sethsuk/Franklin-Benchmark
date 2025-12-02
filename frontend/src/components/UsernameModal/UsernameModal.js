import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './UsernameModal.css';

const UsernameModal = () => {
  const { username, setUsername } = useContext(AuthContext);
  const [inputUsername, setInputUsername] = useState('');
  const [error, setError] = useState('');

  // Don't show modal if user already has a username
  if (username) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputUsername.trim()) {
      setError('Please enter a username');
      return;
    }

    setUsername(inputUsername.trim());
  };

  return (
    <div className="username-modal">
      <div className="modal-content">
        <h2>Welcome!</h2>
        <p>Please choose a username to submit scores:</p>
        <form onSubmit={handleSubmit} className="username-form">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
          <button type="submit">Continue</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;
