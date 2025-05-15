import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserChallengeHome = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/all-posted-quizzes'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <button
        onClick={handleNavigate}
        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300"
      >
        View All Posted Quizzes
      </button>
    </div>
  );
};

export default UserChallengeHome;
