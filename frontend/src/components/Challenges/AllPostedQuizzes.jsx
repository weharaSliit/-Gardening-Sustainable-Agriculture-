import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, CheckCircle } from 'lucide-react';
import Nav from '../MainComponents/Nav';

const AllPostedQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/challenges/posted')
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error("Error fetching posted challenges:", err));
  }, []);

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-green-800 mb-12 flex items-center gap-3">
            <Leaf className="text-green-600 animate-spin-slow" />
            Explore Quizzes
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.challengeId}
                className="relative bg-white/70 backdrop-blur-lg border border-green-200 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                
                <div className="absolute inset-0 -z-10">
                  <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-br from-green-300 via-green-500 to-green-800 opacity-20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tr from-lime-200 via-emerald-400 to-green-700 opacity-25 rounded-full blur-xl animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-green-200 via-green-400 to-lime-600 opacity-10 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-3 right-1/3 w-32 h-32 bg-gradient-to-tl from-green-100 via-green-400 to-emerald-600 opacity-20 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-8 left-1/4 w-36 h-36 bg-gradient-to-tr from-lime-300 via-green-500 to-teal-700 opacity-15 rounded-full blur-xl animate-ping"></div>
                </div>

                
                <div className="absolute top-3 right-3">
                  <Leaf className="text-green-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>

                <div className="flex items-center gap-2 mb-4 text-green-700">
                  <CheckCircle className="text-green-600" />
                  <h3 className="text-2xl font-semibold">{quiz.challengeTitle}</h3>
                </div>

                <p className="text-gray-700 mb-5 line-clamp-3">{quiz.challengeDescription}</p>

                <Link
                  to={`/take-quiz/${quiz.challengeId}`}
                  className="inline-block px-5 py-2 rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                >
                  Take Quiz
                </Link>
              </div>
            ))}

            {quizzes.length === 0 && (
              <p className="text-gray-600 text-center col-span-full">No posted quizzes yet 🌱</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPostedQuizzes;
