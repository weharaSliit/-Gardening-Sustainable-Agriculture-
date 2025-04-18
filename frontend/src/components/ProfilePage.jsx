import React, { useState, useEffect } from 'react';
import { getProfile } from '../api/api';
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not logged in');
        return;
      }

      const decoded = jwtDecode(token);
      const userIdFromToken = decoded.userId;
      setUserId(userIdFromToken);

      try {
        const response = await getProfile(userIdFromToken, token);
        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {profile ? (
        <div>
          <p><strong>User ID:</strong> {userId}</p>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;