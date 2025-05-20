import './ReceivedKudos.css';

function ReceivedKudos({ kudos }) {
  return (
    <div className="kudo-container">
      {kudos.length === 0 ? (
        <p className="kudo-empty-message">No kudos received yet</p>
      ) : (
        <ul className="kudo-list">
          {kudos.map((kudo, index) => (
            <li key={index} className="kudo-item">
              <p><strong>From:</strong> {kudo.giver}</p>
              <p><strong>To:</strong> {kudo.receiver}</p>
              <p><strong>Message:</strong> {kudo.message}</p>
              <p><strong>Received:</strong> {new Date(kudo.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
  }
  
  export default ReceivedKudos