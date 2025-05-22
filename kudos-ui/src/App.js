import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import Modal from './components/Modal';
import UserList from './components/UserList';
import SendKudo from './components/SendKudos';
import ReceivedKudos from './components/ReceivedKudos';

const API_URL = 'http://localhost:5000/';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [receivedKudos, setReceivedKudos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredKudos = receivedKudos.filter(k => user && k.receiver === user.username);

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
    },
    timeout: 5000,
  });

  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const config = error.config;
      if (!config || config.retryCount >= 3) return Promise.reject(error);
      if (config.method?.toLowerCase() !== 'get') return Promise.reject(error);

      config.retryCount = (config.retryCount || 0) + 1;
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retryCount));
      return axiosInstance({ ...config, data: config.data });
    }
  );

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users/available');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Fetch users error:', err);
      const errorMessage = err.response
        ? `Failed to fetch users: ${err.response.data?.error || err.message}`
        : 'Failed to fetch users: Network Error - Server may be down';
      setUsers([]);
      setError(errorMessage);
    }
  }, []);

  const fetchReceivedKudos = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/kudos/received');
      setReceivedKudos(response.data);
      setError(null);
    } catch (err) {
      console.error('Fetch kudos error:', err);
      const errorMessage = err.response
        ? `Failed to fetch kudos: ${err.response.data?.error || err.message}`
        : 'Failed to fetch kudos: Network Error - Server may be down';
      setReceivedKudos([]);
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchReceivedKudos();
    } else {
      setUsers([]);
      setReceivedKudos([]);
    }
  }, [user, fetchUsers, fetchReceivedKudos]);

  const handleLogin = async (username, password) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post('/login', { username, password });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data)); // ✅ Save user
      setError(null);
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'ECONNABORTED') {
        alert('Request timed out. Please try again.');
      } else if (err.response?.status === 404 || err.response?.data?.error === 'User not found') {
        alert('User not found');
      } else {
        const errorMessage = err.response
          ? `Login failed: ${err.response.data?.error || err.message}`
          : 'Login failed: Network error - Server may be down';
        setError(errorMessage);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSendKudo = async ({ giver_id, giver_name, receiver_id, receiver_name, message }) => {
    if (giver_id === receiver_id) {
      alert("You cannot give kudos to yourself");
      return;
    }
    try {
      await axiosInstance.post('/kudos/send', {
        giver_id,
        giver_name,
        receiver_id,
        receiver_name,
        message
      });
  
      const updatedUser = {
        ...user,
        kudos_available: user.kudos_available - 1
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update storage
  
      setError(null);
      alert('Kudo sent successfully!');
  
      // Refresh UI data
      await Promise.all([
        fetchReceivedKudos(),
        fetchUsers()
      ]);
    } catch (err) {
      alert("No kudos available");
      console.error('Send kudo error:', err);
      const errorMessage = err.response
        ? `Error sending kudo: ${err.response.data?.error || err.message}`
        : 'Error sending kudo: Network Error - Server may be down';
      setError(errorMessage);
    }
  };
  

  const handleLogout = () => {
    setUser(null);
    setUsers([]);
    setReceivedKudos([]);
    setError(null);
    localStorage.removeItem('user');
  };

  return (
    <div className="container">
      <h1 className="app-title">Kudos App</h1>
      {error && <p className="error-message">{error}</p>}
      {!user ? (
        <Login onLogin={handleLogin} loading={loading} />
      ) : (
        <div>
          <div className="header">
            <div className="user-info">
              <p>Welcome, <strong>{user.username}</strong></p>
              <p>Organization: <strong>{user.organization}</strong></p>
              <p>Kudos Available: <strong>{user.kudos_available}</strong></p>
            </div>
          </div>
          <div className="grid-layout">
            <div className="send-kudos-card">
              <h2 className="section-title">Send Kudos</h2>
              <SendKudo
                users={users}
                currentUser={user}
                onSendKudo={handleSendKudo}
                disabled={user.kudos_available <= 0}
              />
            </div>
            <div>
              <button onClick={() => setModalOpen(true)} className="open-modal-button">
                View Received Kudos
              </button>
            </div>
          </div>
          <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
            <div className="modal-content-scroll">
              <ReceivedKudos kudos={filteredKudos} />
            </div>
          </Modal>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
