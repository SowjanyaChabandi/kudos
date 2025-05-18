import React, { useState, useEffect } from 'react';

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
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        autoFocus
        disabled={loading}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        type="submit"
        disabled={loading || submitted}
        className={`w-full py-2 rounded text-white ${
          loading || submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;
