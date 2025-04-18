import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../api/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not logged in');
        return;
      }

      try {
        const response = await getAllUsers(token);
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> ({user.username})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;