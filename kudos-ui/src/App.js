import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './components/login.js'
import UserList from './components/UserList.js'
import SendKudo from './components/SendKudos.js'
import ReceivedKudos from './components/ReceivedKudos.js'

const API_URL = 'http://localhost:5000/'

function App() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [receivedKudos, setReceivedKudos] = useState([])

  // Check if user is logged in on mount
  useEffect(() => {
    axios.get(`${API_URL}/users/available`, { withCredentials: true })
      .then(response => {
        setUser({ id: response.data[0]?.id, username: 'current_user' }) // Placeholder; fetch user info if needed
        setUsers(response.data)
      })
      .catch(() => setUser(null))
  }, [])

  // Fetch received kudos when user is logged in
  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/kudos/received`, { withCredentials: true })
        .then(response => setReceivedKudos(response.data))
        .catch(error => console.error('Error fetching kudos:', error))
    }
  }, [user])

  const handleLogin = (username) => {
    axios.post(`${API_URL}/login`, { username }, { withCredentials: true })
      .then(response => {
        setUser(response.data)
        // Fetch users after login
        axios.get(`${API_URL}/users`, { withCredentials: true })
          .then(response => setUsers(response.data))
          .catch(error => console.error('Error fetching users:', error))
      })
      .catch(error => alert('Login failed: ' + (error.response?.data?.error || 'Unknown error')))
  }

  const handleSendKudo = (receiverId, message) => {
    axios.post(`${API_URL}/kudos/send`, { receiver_id: receiverId, message }, { withCredentials: true })
      .then(() => {
        setUser(prev => ({ ...prev, kudos_available: prev.kudos_available - 1 }))
        alert('Kudo sent successfully!')
      })
      .catch(error => alert('Error sending kudo: ' + (error.response?.data?.error || 'Unknown error')))
  }

  const handleLogout = () => {
    setUser(null)
    setUsers([])
    setReceivedKudos([])
    axios.post(`${API_URL}/logout`, {}, { withCredentials: true }) // Optional: Add logout endpoint if needed
      .catch(error => console.error('Error logging out:', error))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Kudos App</h1>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg">Welcome, {user.username}!</p>
              <p>Organization: {user.organization}</p>
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
              <SendKudo users={users} onSendKudo={handleSendKudo} />
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
  )
}

export default App;
