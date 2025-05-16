import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaSeedling, FaChevronDown, FaChevronUp, FaTrophy, FaRegClock, FaChartLine, FaChartPie, FaAward } from 'react-icons/fa';
import { GiPlantSeed, GiFlowers, GiWaterDrop, GiGrowth } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../MainComponents/Nav';
import axios from 'axios';

const UserChallengeHome = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [userId, setUserId] = useState('');
  const [openGroups, setOpenGroups] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [plantSize, setPlantSize] = useState(1);
  const [waterLevel, setWaterLevel] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userIdFromToken = payload.userId;
    setUserId(userIdFromToken);

    setIsLoading(true);
    Promise.all([
      axios.get(`http://localhost:8080/api/submissions/user/${userIdFromToken}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get('http://localhost:8080/api/v1/challenges/viewChallenge', {
        headers: { Authorization: `Bearer ${token}` },
      })
    ])
    .then(([submissionsRes, challengesRes]) => {
      setSubmissions(submissionsRes.data);
      setChallenges(challengesRes.data);
      
      // Calculate plant growth based on submissions
      if (submissionsRes.data.length > 0) {
        const totalScore = submissionsRes.data.reduce((sum, sub) => sum + sub.score, 0);
        const avgScore = totalScore / submissionsRes.data.length;
        setPlantSize(Math.min(1 + (avgScore / 100) * 0.5, 1.5)); // Scale plant size based on average score
        setWaterLevel(Math.min(submissionsRes.data.length * 10, 100)); // Water level based on number of attempts
      }
    })
    .catch(err => console.error('Error fetching data:', err))
    .finally(() => setIsLoading(false));
  }, []);

  const challengeMap = {};
  challenges.forEach(ch => {
    challengeMap[ch.challengeId] = ch.challengeTitle;
  });

  const groupedSubmissions = submissions.reduce((acc, sub) => {
    if (!acc[sub.challengeId]) {
      acc[sub.challengeId] = [];
    }
    acc[sub.challengeId].push(sub);
    return acc;
  }, {});

  const toggleGroup = challengeId => {
    setOpenGroups(prev => ({
      ...prev,
      [challengeId]: !prev[challengeId],
    }));
  };

  const handleNavigate = () => {
    navigate('/all-posted-quizzes');
  };

  // Calculate statistics
  const totalQuizzes = Object.keys(groupedSubmissions).length;
  const totalAttempts = submissions.length;
  const averageScore = totalAttempts > 0 
    ? (submissions.reduce((sum, sub) => sum + sub.score, 0) / totalAttempts).toFixed(1)
    : 0;
  const highestScore = totalAttempts > 0 
    ? Math.max(...submissions.map(sub => sub.score))
    : 0;

  // Function  plant icon based on score
  const getPlantIcon = (score) => {
    if (score >= 3) return <GiFlowers className="text-purple-500 text-2xl" />;
    if (score <= 3) return <FaLeaf className="text-green-500 text-2xl" />;
    return <GiPlantSeed className="text-yellow-500 text-2xl" />;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 p-6 overflow-hidden">
        
        <motion.div 
          className="fixed inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
        >
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-300"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                rotate: Math.random() * 360
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() > 0.5 ? 10 : -10, 0],
                rotate: [0, Math.random() > 0.5 ? 10 : -10, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <FaLeaf />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          
          <motion.div 
            className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-green-100 mb-10"
            variants={itemVariants}
            whileHover={{ scale: 1.005 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-emerald-50/30 opacity-50"></div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center">
              <motion.div 
                className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl font-bold text-green-800 mb-3 bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Your Knowledge Garden
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mb-6">
                  {totalAttempts > 0 
                    ? `Your knowledge is ${averageScore}% healthy! Keep watering it with more quizzes.`
                    : 'Plant your first quiz to start growing your knowledge garden!'}
                </p>
                <motion.button
                  onClick={handleNavigate}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center font-medium">
                    {totalAttempts > 0 ? 'Grow More' : 'Plant First Quiz'}
                    <motion.span 
                      className="ml-2"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaSeedling />
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </motion.button>
              </motion.div>

              {/*  Plant Visualization */}
              <motion.div 
                className="flex-1 flex flex-col items-center justify-center relative h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Water level  */}
                <div className="absolute bottom-0 w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${waterLevel}%` }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                  />
                </div>
                
                {/* Pot */}
                <div className="absolute bottom-4 w-32 h-16 bg-amber-700 rounded-b-lg"></div>
                
                {/* Plant */}
                <motion.div 
                  className="relative"
                  animate={{
                    scale: plantSize,
                    y: [-10, 0, -10]
                  }}
                  transition={{
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  {totalAttempts === 0 ? (                          // If no quizzes taken → show SEED
                    <GiPlantSeed className="text-yellow-500 text-6xl mb-8" />
                  ) : averageScore >= 1.5 ? (                             // If average score ≥ 1.5 → show FLOWER         
                    <GiFlowers className="text-purple-500 text-6xl mb-8" />
                  ) : (                                                           //Otherwise → show GROWING PLANT
                    <FaSeedling className="text-green-500 text-6xl mb-8" />
                  )}
                </motion.div>
                
                {/* Growth indicate */}
                {totalAttempts > 0 && (
                  <motion.div 
                    className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <GiGrowth className="mr-1" /> Level {Math.floor(plantSize * 10)}                
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Statistics Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Total Quiz Card */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-green-100"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <FaChartPie className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Quizzes</p>
                  <p className="text-2xl font-bold text-green-800">{totalQuizzes}</p>
                </div>
              </div>
            </motion.div>

            {/* Total Attempt Card */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-green-100"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FaChartLine className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Attempts</p>
                  <p className="text-2xl font-bold text-blue-800">{totalAttempts}</p>
                </div>
              </div>
            </motion.div>

            {/* Average Score Card */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-green-100"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <FaTrophy className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Score</p>
                  <p className="text-2xl font-bold text-yellow-800">{averageScore}%</p>
                </div>
              </div>
            </motion.div>

            {/* Highest Score Card */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-green-100"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <FaAward className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Highest Score</p>
                  <p className="text-2xl font-bold text-purple-800">{highestScore}%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Timeline Section */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-green-100 p-6 md:p-8"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <motion.div 
                className="bg-green-100 p-3 rounded-lg mr-4"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <FaRegClock className="text-green-600 text-xl" />
              </motion.div>
              <h2 className="text-2xl font-bold text-green-800">Your Growth Timeline</h2>
            </div>

            {isLoading ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mx-auto w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full mb-4"
                />
                <p className="text-gray-500">Growing your knowledge garden...</p>
              </motion.div>
            ) : Object.keys(groupedSubmissions).length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <GiPlantSeed className="mx-auto text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">Your quiz garden is empty. Take your first quiz to see it bloom!</p>
                <motion.button
                  onClick={handleNavigate}
                  className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center mx-auto"
                  whileHover={{ scale: 1.05 }}
                >
                  Start Growing <GiWaterDrop className="ml-2" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {Object.entries(groupedSubmissions).map(([challengeId, attempts]) => (
                  <motion.div 
                    key={challengeId} 
                    className="border-l-4 border-green-400 pl-5 py-3 relative"
                    variants={itemVariants}
                  >
                    {/* animated timeline dot */}
                    <motion.div 
                      className="absolute -left-2.5 top-5 w-5 h-5 bg-green-500 rounded-full border-4 border-white"
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0)", "0 0 0 10px rgba(16, 185, 129, 0.1)", "0 0 0 0 rgba(16, 185, 129, 0)"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                    />
                    
                    <motion.div
                      className="cursor-pointer flex justify-between items-center group"
                      onClick={() => toggleGroup(challengeId)}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center">
                        <motion.div
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity
                          }}
                        >
                          {getPlantIcon(Math.max(...attempts.map(a => a.score)))}
                        </motion.div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-green-800 group-hover:text-emerald-700 transition-colors">
                            {challengeMap[challengeId] || 'Unknown Challenge'}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="flex items-center mr-3">
                              <FaTrophy className={`mr-1 ${Math.max(...attempts.map(a => a.score)) >= 2 ? 'text-yellow-500' : 'text-gray-300'}`} />
                              Best: {Math.max(...attempts.map(a => a.score))}%
                            </span>
                            <span>{attempts.length} {attempts.length === 1 ? 'attempt' : 'attempts'}</span>
                          </div>
                        </div>
                      </div>
                      {openGroups[challengeId] ? (
                        <FaChevronUp className="text-gray-400 group-hover:text-gray-600" />
                      ) : (
                        <FaChevronDown className="text-gray-400 group-hover:text-gray-600" />
                      )}
                    </motion.div>

                    <AnimatePresence>
                      {openGroups[challengeId] && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={{
                            hidden: { opacity: 0, height: 0 },
                            visible: { opacity: 1, height: 'auto' }
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 ml-8 space-y-3">
                            {attempts.map((sub, index) => (
                              <motion.div 
                                key={index} 
                                className="bg-green-50/60 rounded-lg p-4 border border-green-100"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-700">Attempt #{index + 1}</p>
                                    <motion.p 
                                      className="text-xs text-gray-400 mt-1 flex items-center"
                                      animate={{
                                        x: [0, 2, 0]
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity
                                      }}
                                    >
                                    
                                    </motion.p>
                                  </div>
                                  <motion.span 
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      sub.score >= 80 ? 'bg-green-100 text-green-800' :
                                      sub.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}
                                    animate={{
                                      scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatDelay: 3
                                    }}
                                  >
                                    {sub.score}%
                                  </motion.span>
                                </div>
                                {sub.name && (
                                  <p className="text-xs text-gray-400 mt-2">Submitted as: {sub.name}</p>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/*  water drops */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-emerald-200/50"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 24 + 16}px`
              }}
              animate={{
                y: [0, window.innerHeight],
                opacity: [0.5, 0],
                scale: [1, 0.5]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 5,
                repeat: Infinity,
                repeatDelay: Math.random() * 10
              }}
            >
              <GiWaterDrop />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserChallengeHome;