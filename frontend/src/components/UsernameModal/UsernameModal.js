import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import UsernameForm from '../UsernameForm/UsernameForm';

const UsernameModal = () => {
    const { userData } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Show modal if the user is new... need to create a new username
        if (userData && userData.status === 'new_user') {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [userData]);

    if (!showModal) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                minWidth: '300px',
            }}>
                <UsernameForm />
                <button onClick={() => setShowModal(false)} style={{ marginTop: '1rem' }}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default UsernameModal;
