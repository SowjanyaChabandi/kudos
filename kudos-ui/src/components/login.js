import React, { useState, useEffect } from 'react';
import './login.css';

const Login = ({ onLogin, loading }) => {
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading || submitted) return; // Prevent multiple submits

    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    setSubmitted(true);
    onLogin(username.trim());
  };

  // Reset submitted when loading is false (login finished)
  useEffect(() => {
    if (!loading) {
      setSubmitted(false);
    }
  }, [loading]);

  return (
    <form onSubmit={handleSubmit} className="login-form">
        <label className="login-label">
            Username
        </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        autoFocus
        disabled={loading}
        className="login-input"
        required
      />
      <button
        type="submit"
        disabled={loading || submitted}
        className="login-button"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;
