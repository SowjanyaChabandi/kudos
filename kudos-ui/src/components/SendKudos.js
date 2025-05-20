import { useState } from 'react'
import './SendKudos.css';

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
    <div className="kudo-form-container">
      <form onSubmit={handleSubmit}>
        <div className="kudo-form-group">
          <label className="kudo-label" htmlFor="receiver">
            Select User <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            id="receiver"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            className="kudo-select"
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="kudo-form-group">
          <label className="kudo-label" htmlFor="message">
            Message <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="kudo-textarea"
            placeholder="Enter your kudo message"
            rows="4"
          ></textarea>
        </div>
        <button type="submit" className="kudo-button">
          Send Kudo
        </button>
      </form>
    </div>
  );
}

export default SendKudo