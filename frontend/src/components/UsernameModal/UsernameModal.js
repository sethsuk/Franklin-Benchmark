// src/components/UsernameModal/UsernameModal.js
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import UsernameForm from '../UsernameForm/UsernameForm';     // ← use the real form

const UsernameModal = () => {
  const { userData } = useContext(AuthContext);

  // Show the modal only when the user is signed‑in but has no username yet.
  if (!userData || userData.username) return null;

  return (
    <div className="username-modal">
      <div className="modal-content">
        <h2>Welcome!</h2>
        <p>Please choose a username:</p>
        <UsernameForm />
      </div>
    </div>
  );
};

export default UsernameModal;
