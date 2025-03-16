import { useEffect, useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        return response.json();
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <div className="mt-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Provider:</strong> {user.provider}</p>
        {user.picture && (
          <img src={user.picture} alt="Profile" className="w-24 h-24 rounded-full mt-2" />
        )}
      </div>
    </div>
  );
}

export default UserProfile;