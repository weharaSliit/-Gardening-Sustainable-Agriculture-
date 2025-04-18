import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle, Leaf, CheckCircle } from 'lucide-react';


const QuizManagement = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/challenges/viewChallenge')
      .then(res => res.json())
      .then(data => setChallenges(data))
      .catch(err => console.error("Error fetching challenges:", err));
  }, []);

  const confirmDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this quiz?");
    if (isConfirmed) {
      deleteChallenge(id);
    }
  };

  const deleteChallenge = (id) => {
    fetch(`http://localhost:8080/api/v1/challenges/deleteChallenge/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (res.ok) {
          setChallenges(challenges.filter(c => c.challengeId !== id));
        } else {
          console.error("Failed to delete");
        }
      })
      .catch(err => {
        console.error("Error deleting:", err);
      });
  };

  return (
    
    <div className="p-8 text-green-800 bg-[#f7fdf7] min-h-screen font-growFont relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-grow-leaf flex items-center gap-2">
            <Leaf className="w-7 h-7 text-grow-green animate-pulse-soft" />
            Garden Quiz Management
          </h1>
          <p className="text-black mt-1 text-base">
            Cultivate knowledge with GrowSphere's gardening quizzes.
          </p>
        </div>
        <Link
          to="/add-challenge"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          Plant New Quiz
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white relative">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-100 text-green-800 uppercase tracking-wider">
            <tr>
              <th className="p-4">Quiz Title</th>
              <th className="p-4">Description</th>
              <th className="p-4">Questions</th>
              <th className="p-4">Badge Awarded</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((quiz) => (
              <tr key={quiz.challengeId} className="border-b hover:bg-green-50 align-top">
                <td className="p-4 font-bold text-lg text-grow-leaf">{quiz.challengeTitle}</td>
                <td className="p-4 flex items-start gap-2 text-black">
                  <Leaf className="w-4 h-4 text-grow-green self-center animate-pulse-soft" />
                  <span>{quiz.challengeDescription}</span>
                </td>
                <td className="p-4">
                  <div className="space-y-4">
                    {quiz.questions?.map((q, index) => (
                      <div key={index}>
                        <p className="font-semibold text-black mb-1">
                          Question {index + 1}: {q.questionText}
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-md p-3 ml-4">
                          <ul className="list-disc pl-5 text-black">
                            {q.options?.map((opt, i) => (
                              <li key={i} className="mb-1">{opt}</li>
                            ))}
                          </ul>
                          <div className="flex items-center gap-2 mt-2 text-green-800 font-medium">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Correct Answer: <span className="text-green-900">{q.correctAnswer}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-block bg-emerald-100 text-grow-leaf text-sm font-semibold px-2 py-1 border-green-300 shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-emerald-200 whitespace-nowrap">
                    🌿 {quiz.badgeAwarded}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <Link to={`/update-challenge/${quiz.challengeId}`} className="text-blue-600 hover:text-blue-800">
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => confirmDelete(quiz.challengeId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {challenges.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No quizzes planted yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizManagement;
