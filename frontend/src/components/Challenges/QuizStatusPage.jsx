import React, { useEffect, useState } from 'react';

const QuizStatusPage = () => {
  const [allSubmissions, setAllSubmissions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/submissions')
      .then(res => res.json())
      .then(data => setAllSubmissions(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Quiz Submissions</h2>
      <table className="w-full border text-left">
        <thead>
          <tr>
            <th className="p-2">Quiz ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {allSubmissions.map((sub, index) => (
            <tr key={index}>
              <td className="p-2">{sub.challengeId}</td>
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

export default QuizStatusPage;
