// src/components/Auth.jsx (Corrected Version)

import React from 'react';
import './Auth.css';
import { Link } from 'react-router-dom'; // 1. Import Link
import hivesigner from 'hivesigner';
import EnrollButton from './EnrollButton'; // Import the new component

// Initialize Hivesigner client. This is the only part that needs correction.
// The 'app' name is what users will see on the Hivesigner consent screen.
const hivesignerClient = new hivesigner.Client({
  app: 'neoxian-puzzler', // The name users will see
  callbackURL: window.location.origin, // e.g., http://localhost:5173 or your live URL
  scope: ['login'],
});



function Auth({ user, onLogin, onLogout,isAdmin }) {
  const handleKeychainLogin = () => {
    if (!window.hive_keychain) {
      alert('Hive Keychain is not installed!');
      return;
    }

    const message = `Log in to Neoxian Puzzler - ${Date.now()}`;
    window.hive_keychain.requestSignBuffer(
      undefined,
      message,
      'Posting',
      (response) => {
        if (response.success) {
          onLogin(response.data.username);
        } else {
          alert('Login failed: ' + response.message);
        }
      }
    );
  };

  const handleHivesignerLogin = () => {
    // This part works without pre-registering the app.
    const loginUrl = hivesignerClient.getLoginURL();
    window.location.href = loginUrl;
  };

  if (user) {
    return (
      <div className="auth-container">
        <span className="auth-username">Logged in as @{user}</span>
         {/* 3. Conditionally render the Admin Panel button */}
        {isAdmin && (
          <Link to="/admin" className="admin-button">Admin Panel</Link>
        )}
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleKeychainLogin}>Login with Keychain</button>
      <button onClick={handleHivesignerLogin}>Login with Hivesigner</button>
       <EnrollButton /> {/* Add the enroll button here */}
    </div>
  );
}

export default Auth;