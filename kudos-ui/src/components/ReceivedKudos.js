function ReceivedKudos({ kudos }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        {kudos.length === 0 ? (
          <p className="text-gray-600">No kudos received yet</p>
        ) : (
          <ul className="space-y-4">
            {kudos.map((kudo, index) => (
              <li key={index} className="p-4 border rounded bg-gray-50">
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