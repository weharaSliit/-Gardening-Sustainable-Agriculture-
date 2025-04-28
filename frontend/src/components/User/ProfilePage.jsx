import React, { useState, useEffect } from "react";
import { getProfile } from "../../api/api";
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not logged in");
        return;
      }

      const decoded = jwtDecode(token);
      const userIdFromToken = decoded.userId;
      setUserId(userIdFromToken);

      try {
        const response = await getProfile(userIdFromToken, token);
        setProfile(response.data);
      } catch (err) {
        setError("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-8">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {profile ? (
          <div className="flex flex-col sm:flex-row items-center">
            {/* Profile Picture and Name */}
            <div className="flex flex-col items-center sm:items-start sm:w-1/3">
              <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 overflow-hidden shadow-md">
                <img
                  src="/profile-placeholder.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-green-800">{profile.name}</h2>
              <p className="text-gray-600 text-sm">{profile.role || "User Role"}</p>
            </div>

            {/* Profile Details */}
            <div className="sm:w-2/3 mt-6 sm:mt-0 sm:ml-10">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                User Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">
                    <strong>User ID:</strong> {userId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {profile.email}
                  </p>
                </div>
              </div>

              {/* Activities Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Activities
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Product Infrastructure</li>
                  <li>Network Security</li>
                  <li>Security Testing</li>
                  <li>Security Audit Outsourcing</li>
                  <li>Bugs</li>
                </ul>
              </div>

              {/* Team Members Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Works most with...
                </h3>
                <div className="flex space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden shadow-md">
                    <img
                      src="/team-member-1.png"
                      alt="Team Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden shadow-md">
                    <img
                      src="/team-member-2.png"
                      alt="Team Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden shadow-md">
                    <img
                      src="/team-member-3.png"
                      alt="Team Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden shadow-md">
                    <img
                      src="/team-member-4.png"
                      alt="Team Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;