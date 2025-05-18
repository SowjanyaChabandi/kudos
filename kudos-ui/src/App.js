import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Login from './components/login';
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

  const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
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
  
      if (!config || config.retryCount >= 3) {
        return Promise.reject(error);
      }
  
      if (config.method?.toLowerCase() !== 'get') {
        return Promise.reject(error);
      }
  
      config.retryCount = (config.retryCount || 0) + 1;
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retryCount));
      return axiosInstance({ ...config, data: config.data });
    }
  );
  

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/login/me');
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Fetch current user error:', err);
      const errorMessage = err.response
        ? `Failed to fetch current user: ${err.response.data?.error || err.message}`
        : 'Failed to fetch current user: Network Error - Server may be down';
      setUser(null);
      setError(errorMessage);
      return null;
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
    const initSession = async () => {
      const currentUser = await fetchCurrentUser();
      if (currentUser) {
        await Promise.all([fetchUsers(), fetchReceivedKudos()]);
      }
    };
    initSession();
  }, [fetchCurrentUser, fetchUsers, fetchReceivedKudos]);


  const handleLogin = async (username) => {
    if (loading) return; // Prevent double submit
    console.log('handleLogin triggered for:', username);

    setLoading(true);
    try {
      const response = await axiosInstance.post('/login', { username });
      setUser(response.data);
      setError(null);
      await Promise.all([fetchUsers(), fetchReceivedKudos()]);
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
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleSendKudo = async (receiverId, message) => {
  //   try {
  //     await axiosInstance.post('/kudos/send', { receiver_id: receiverId, message });
  //     setError(null);
  //     alert('Kudo sent successfully!');
  //     await fetchCurrentUser();
  //     setTimeout(() => {
  //       fetchReceivedKudos();
  //     }, 500);
  //   } catch (err) {
  //     alert("No kudos available")
  //     console.error('Send kudo error:', err);
  //     const errorMessage = err.response
  //       ? `Error sending kudo: ${err.response.data?.error || err.message}`
  //       : 'Error sending kudo: Network Error - Server may be down';
  //     setError(errorMessage);
  //   }
  // };


  const handleSendKudo = async (receiverId, message) => {
    try {
      await axiosInstance.post('/kudos/send', { receiver_id: receiverId, message });
      setError(null);
      alert('Kudo sent successfully!');
  
      // Ensure all related data is updated
      await Promise.all([
        fetchCurrentUser(),
        fetchReceivedKudos()
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
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=None';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Kudos App</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {!user ? (
        <Login onLogin={handleLogin} loading={loading} />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg">Welcome, {user.username}!</p>
              <p>Organization: {user.organization || 'Mitratech'}</p>
              <p>Kudos Available: {user.kudos_available}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Send Kudos</h2>
              <SendKudo users={users} onSendKudo={handleSendKudo} disabled={user.kudos_available <= 0}/>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Received Kudos</h2>
              <ReceivedKudos kudos={receivedKudos} />
            </div>
          </div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Users</h2>
          <UserList users={users} />
        </div>
      )}
    </div>
  );
}

export default App;
