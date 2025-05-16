import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, CheckCircle, Sparkles, Clock, Sprout, BookOpen, Trophy } from 'lucide-react';
import Nav from '../MainComponents/Nav';
import { motion } from 'framer-motion';

const AllPostedQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/challenges/posted')
      .then(res => res.json())
      .then(data => {
        setQuizzes(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching posted challenges:", err);
        setIsLoading(false);
      });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

        {/* Floating Leaves */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10 text-green-300"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
              }}
            >
              <Leaf size={40 + Math.random() * 60} />
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center mb-16 relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-300 rounded-full opacity-15 blur-3xl animate-ping-slow"></div>

            <h2 className="text-5xl font-bold text-green-800 mb-4 flex items-center justify-center gap-3">
              <Sparkles className="text-yellow-400 animate-pulse" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
                Explore Quizzes
              </span>
              <Leaf className="text-green-600 animate-spin-slow" />
            </h2>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Test your knowledge with our interactive quizzes. Each challenge helps you grow your skills like a thriving plant!
            </p>
          </div>

          
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/80 rounded-2xl p-6 shadow-sm h-64 animate-pulse">
                  <div className="h-6 bg-green-100 rounded-full w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-green-50 rounded-full"></div>
                    <div className="h-4 bg-green-50 rounded-full w-5/6"></div>
                    <div className="h-4 bg-green-50 rounded-full w-2/3"></div>
                  </div>
                  <div className="mt-8 h-10 bg-green-100 rounded-full w-32"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.challengeId}
                  className="relative bg-white/90 backdrop-blur-sm border border-green-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group overflow-hidden hover:-translate-y-1 hover:scale-[1.02]"
                >
                  
                  <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-br from-green-300 via-green-500 to-green-800 opacity-15 rounded-full blur-xl group-hover:opacity-20 transition-all duration-500"></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tr from-emerald-200 via-green-400 to-teal-600 opacity-15 rounded-full blur-lg group-hover:opacity-25 transition-all duration-700"></div>
                  </div>

                  
                  <div className="absolute top-3 right-3">
                    <Leaf className="text-green-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12" />
                  </div>

                  {/* Quiz Content */}
                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:bg-green-200 group-hover:text-green-700 transition-colors">
                        <CheckCircle className="shrink-0" />
                      </div>
                      <h3 className="text-2xl font-semibold text-green-800 mt-1">{quiz.challengeTitle}</h3>
                    </div>

                    <p className="text-gray-700 mb-6 line-clamp-3">{quiz.challengeDescription}</p>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.questions?.length || 0} questions
                      </div>
                    </div>

                    
                    <div className="flex flex-col gap-3">
                      <Link
                        to={`/take-quiz/${quiz.challengeId}`}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105"
                      >
                        Start Quiz
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>

                      <Link
                        to={`/leaderboard/${quiz.challengeId}`}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-yellow-800 bg-green-100 hover:bg-green-200 transition-all duration-300 shadow hover:shadow-md group-hover:scale-105"
                      >
                        <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                        View Leaderboard
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {quizzes.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="inline-flex items-center justify-center bg-green-100/50 rounded-full p-6 mb-4">
                    <Leaf className="text-green-600 w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-2">No quizzes available yet</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    It looks like no quizzes have been posted yet. Check back later!
                  </p>
                </div>
              )}
            </div>
          )}

          
          {quizzes.length > 0 && (
            <motion.div
              className="mt-16 bg-gradient-to-r from-green-500/5 to-emerald-600/5 rounded-3xl p-8 relative overflow-hidden"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div className="absolute -top-20 -right-20 w-64 h-64 bg-green-300 rounded-full opacity-10 blur-3xl"></motion.div>
              <motion.div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-400 rounded-full opacity-10 blur-3xl"></motion.div>

              <motion.div className="relative z-10 flex flex-col md:flex-row items-center gap-8 mb-12" variants={itemVariants}>
                <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="bg-green-100 rounded-2xl p-4 text-green-600">
                    <Sprout className="w-12 h-12" />
                  </div>
                </motion.div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Ready for a challenge?</h3>
                  <p className="text-green-700 mb-4 max-w-2xl mx-auto md:mx-0">
                    Test your knowledge and grow your expertise in sustainable plantation practices.
                  </p>
                </div>
              </motion.div>

              
              <motion.div 
                className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-green-100"
                variants={itemVariants}
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-center md:text-left flex-1">
                    <blockquote className="text-lg italic text-green-800 mb-4">
                      "The best time to plant a tree was 20 years ago. The second best time is now. Share your knowledge and watch the forest of wisdom grow."
                    </blockquote>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      to="/alltutorial"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Explore Knowledge
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllPostedQuizzes;