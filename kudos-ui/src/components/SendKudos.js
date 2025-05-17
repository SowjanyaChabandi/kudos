import { useState } from 'react'

function SendKudo({ users, onSendKudo }) {
  const [receiverId, setReceiverId] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (receiverId && message.trim()) {
      onSendKudo(parseInt(receiverId), message)
      setReceiverId('')
      setMessage('')
    } else {
      alert('Please select a user and enter a message')
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="receiver">
            Select User
          </label>
          <select
            id="receiver"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your kudo message"
            rows="4"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Send Kudo
        </button>
      </form>
    </div>
  )
}

export default SendKudo