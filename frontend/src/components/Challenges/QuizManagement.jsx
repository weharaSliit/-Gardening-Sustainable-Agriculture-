import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle, Leaf, CheckCircle, Search, ChevronDown, ChevronUp, Award } from 'lucide-react';
import Nav from '../MainComponents/Nav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizManagement = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/challenges/viewChallenge');
        const data = await response.json();
        setChallenges(data);
        setFilteredChallenges(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        toast.error("Failed to load quizzes");
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    const results = challenges.filter(quiz =>
      quiz.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.challengeDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.badgeAwarded.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChallenges(results);
  }, [searchTerm, challenges]);

  const confirmDelete = (id, title) => {
    toast.info(
      <div>
        <p>Delete "{title}"?</p>
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => {
              toast.dismiss();
              deleteChallenge(id);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss()} 
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  };

  const deleteChallenge = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/challenges/deleteChallenge/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setChallenges(challenges.filter(c => c.challengeId !== id));
        toast.success("Quiz deleted successfully!");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error("Failed to delete quiz");
    }
  };

  const handlePost = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/challenges/post/${id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        toast.success("Quiz posted successfully!");
        setTimeout(() => navigate('/all-posted-quizzes'), 1500);
      } else {
        throw new Error("Failed to post quiz");
      }
    } catch (err) {
      console.error("Error posting quiz:", err);
      toast.error("Failed to post quiz");
    }
  };

  const toggleExpand = (id) => {
    setExpandedQuiz(expandedQuiz === id ? null : id);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  return (
    <>
      <Nav />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-8 text-green-800 bg-[#f7fdf7] min-h-screen font-growFont relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-grow-leaf flex items-center gap-2">
              <Leaf className="w-7 h-7 text-grow-green animate-pulse" />
              Garden Quiz Management
            </h1>
            <p className="text-black mt-1 text-base">
              Cultivate knowledge with GrowSphere's gardening quizzes.
            </p>
          </div>
          <Link
            to="/add-challenge"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition transform hover:scale-105 shadow-md"
          >
            <PlusCircle className="w-5 h-5" />
            Plant New Quiz
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
         
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white relative">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-green-100 text-green-800 uppercase tracking-wider">
                <tr>
                  <th 
                    className="p-4 cursor-pointer hover:bg-green-200 transition"
                    onClick={() => requestSort('challengeTitle')}
                  >
                    <div className="flex items-center">
                      Quiz Title
                      {sortConfig.key === 'challengeTitle' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Badge Awarded</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedChallenges.map((quiz) => (
                  <React.Fragment key={quiz.challengeId}>
                    <tr 
                      className={`border-b hover:bg-green-50 align-top cursor-pointer ${expandedQuiz === quiz.challengeId ? 'bg-green-50' : ''}`}
                      onClick={() => toggleExpand(quiz.challengeId)}
                    >
                      <td className="p-4 font-bold text-lg text-grow-leaf">{quiz.challengeTitle}</td>
                      <td className="p-4 flex items-start gap-2 text-black">
                        <Leaf className="w-4 h-4 text-grow-green self-center" />
                        <span className="line-clamp-2">{quiz.challengeDescription}</span>
                      </td>
                      <td className="p-4">
                      <span className="inline-flex items-center bg-gray-100 text-gray-800 text-sm font-semibold px-2 py-1 rounded border border-gray-300 shadow-sm transition-transform hover:scale-105 hover:shadow-lg hover:bg-gray-200 whitespace-nowrap">
  <Award className="w-4 h-4 text-gray-700" />
  <span className="ml-1">{quiz.badgeAwarded}</span>
</span>
</td>
                      <td className="p-4 flex gap-3">
                        <Link 
                          to={`/update-challenge/${quiz.challengeId}`} 
                          className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Pencil className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(quiz.challengeId, quiz.challengeTitle);
                          }}
                          className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePost(quiz.challengeId);
                          }}
                          className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1 transition-transform hover:scale-105"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Post
                        </button>
                      </td>
                    </tr>
                    {expandedQuiz === quiz.challengeId && (
                      <tr className="bg-green-50">
                        <td colSpan="4" className="p-4 border-t border-green-200">
                          <div className="space-y-4 ml-8">
                            <h3 className="font-semibold text-green-800">Quiz Questions:</h3>
                            {quiz.questions?.map((q, index) => (
                              <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
                                <p className="font-semibold text-black mb-2">
                                  <span className="text-green-700">Question {index + 1}:</span> {q.questionText}
                                </p>
                                <div className="bg-green-50 border border-green-200 rounded-md p-3 ml-4">
                                  <ul className="list-disc pl-5 text-black space-y-1">
                                    {q.options?.map((opt, i) => (
                                      <li key={i} className="mb-1">{opt}</li>
                                    ))}
                                  </ul>
                                  <div className="flex items-center gap-2 mt-2 text-green-800 font-medium">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Correct Answer: <span className="text-green-900 font-bold">{q.correctAnswer}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {sortedChallenges.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Leaf className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg">No quizzes found</p>
                        {searchTerm && (
                          <button 
                            onClick={() => setSearchTerm('')} 
                            className="mt-2 text-green-600 hover:underline"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizManagement;