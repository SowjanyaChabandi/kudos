function UserList({ users }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        {users.length === 0 ? (
          <p className="text-gray-600">No users available</p>
        ) : (
          <ul className="space-y-2">
            {users.map(user => (
              <li key={user.id} className="p-2 border-b">
                {user.username} (ID: {user.id})
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
  
  export default UserList