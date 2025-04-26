import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Leaderboard = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/submissions/leaderboard/${id}`)
      .then(res => res.json())
      .then(data => setSubmissions(data));
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full border text-left">
        <thead>
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub, index) => (
            <tr key={index}>
              <td className="p-2">{sub.name}</td>
              <td className="p-2">{sub.email}</td>
              <td className="p-2">{sub.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

