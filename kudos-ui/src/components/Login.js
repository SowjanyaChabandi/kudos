import React, { useState, useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading || submitted) return;

    if (!username.trim() || !password.trim()) {
      alert('Please enter both username and password');
      return;
    }

    setSubmitted(true);
    onLogin(username.trim(), password.trim());
  };

  useEffect(() => {
    if (!loading) {
      setSubmitted(false);
    }
  }, [loading]);

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label className="login-label">Username</label>
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

      <label className="login-label">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
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
