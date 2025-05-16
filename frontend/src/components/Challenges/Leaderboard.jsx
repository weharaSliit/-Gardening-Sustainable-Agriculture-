import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Leaf, Trophy, Award, Sprout, ChevronsUp, LeafyGreen, Flower2, Sun, Cloud, Droplets } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FloatingLeaves = ({ count = 15 }) => {
  const leaves = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 30 + 10;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;
    const left = Math.random() * 100;
    
    return (
      <motion.div
        key={i}
        initial={{ y: -50, x: left, rotate: Math.random() * 360 }}
        animate={{ 
          y: [0, window.innerHeight + 50],
          x: [left, left + (Math.random() * 100 - 50)],
          rotate: [0, Math.random() * 360]
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          width: size,
          height: size,
          opacity: 0.7,
          zIndex: 0
        }}
      >
        <Leaf className="w-full h-full" style={{ 
          color: `hsl(${Math.random() * 60 + 100}, 70%, 60%)`,
          transform: `rotate(${Math.random() * 360}deg)`
        }} />
      </motion.div>
    );
  });

  return <>{leaves}</>;
};

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50" />
      
      {/* Floating bubbles */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 100 + 50;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        
        return (
          <motion.div
            key={`bubble-${i}`}
            initial={{ y: 0, x: 0, opacity: 0.05 }}
            animate={{ 
              y: [0, Math.random() * 200 - 100],
              x: [0, Math.random() * 200 - 100],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0) 70%)`,
              filter: 'blur(5px)',
              zIndex: 0
            }}
          />
        );
      })}
      
      <FloatingLeaves />
      
      {/* Sun rays */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          zIndex: 0
        }}
      >
        <Sun className="w-24 h-24 text-yellow-300 opacity-20" />
      </motion.div>
    </div>
  );
};

const RankBadge = ({ rank }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-600 shadow-lg shadow-yellow-200/50';
      case 2: return 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-400 shadow-lg shadow-gray-200/50';
      case 3: return 'bg-gradient-to-br from-amber-500 via-amber-400 to-amber-800 shadow-lg shadow-amber-200/50';
      default: return 'bg-green-100 border border-green-200';
    }
  };

  const getCrown = (rank) => {
    switch(rank) {
      case 1: return <Trophy className="w-7 h-7 text-yellow-500" />;
      case 2: return <Award className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-700" />;
      default: return <Sprout className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <motion.div 
      className={`w-10 h-10 rounded-full flex items-center justify-center ${getMedalColor(rank)}`}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        animate={isHovered && rank <= 3 ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
          y: [0, -5, 0]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {rank <= 3 ? (
          <span className="font-bold text-lg text-white drop-shadow-md">{rank}</span>
        ) : (
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg text-green-800">{rank}</span>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="text-xs text-green-600"
              >
                grow!
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ScoreProgress = ({ score, maxScore = 100 }) => {
  const progress = useMotionValue(0);
  const width = useTransform(progress, [0, 100], ['0%', `${(score / maxScore) * 100}%`]);
  
  useEffect(() => {
    const animation = animate(progress, 100, {
      duration: 1.5,
      ease: "easeOut"
    });
    
    return animation.stop;
  }, [score]);

  return (
    <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
      <motion.div 
        className={`h-full ${
          score > maxScore * 0.8 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
          score > maxScore * 0.5 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
          'bg-gradient-to-r from-green-400 to-green-600'
        } rounded-full`}
        style={{ width }}
      />
    </div>
  );
};

const LeaderboardItem = ({ submission, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const isTop3 = submission.rank <= 3;
  const glowColor = submission.rank === 1 ? 'shadow-yellow-400/30' : 
                   submission.rank === 2 ? 'shadow-gray-400/30' : 
                   submission.rank === 3 ? 'shadow-amber-600/30' : 'shadow-green-400/20';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { 
        opacity: 1, 
        y: 0,
        transition: { delay: index * 0.1 }
      } : {}}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 10px 25px -5px ${glowColor}`
      }}
      className={`grid grid-cols-12 items-center p-5 transition-all duration-300 ease-out hover:bg-green-50/70 ${
        isTop3 ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80' : ''
      } group relative overflow-hidden`}
    >
      {/* Animated border for top 3 */}
      {isTop3 && (
        <motion.div 
          className={`absolute inset-0 rounded-lg ${
            submission.rank === 1 ? 'border-2 border-yellow-400/50' :
            submission.rank === 2 ? 'border-2 border-gray-300/50' :
            'border-2 border-amber-600/50'
          }`}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Rank */}
      <div className="col-span-1 flex justify-center z-10">
        <RankBadge rank={submission.rank} />
      </div>

      {/* Name */}
      <div className="col-span-5 flex items-center gap-4 z-10">
        <motion.div 
          whileHover={{ scale: 1.2 }}
          className="transition-transform duration-300"
        >
          {submission.rank === 1 ? (
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <Trophy className="w-7 h-7 text-yellow-500" />
            </motion.div>
          ) : submission.rank === 2 ? (
            <Award className="w-6 h-6 text-gray-400" />
          ) : submission.rank === 3 ? (
            <Award className="w-6 h-6 text-amber-700" />
          ) : (
            <motion.div
              whileHover={{ rotate: 20 }}
            >
              <Sprout className="w-5 h-5 text-green-500" />
            </motion.div>
          )}
        </motion.div>
        <span className={`font-medium ${
          isTop3 ? 'text-green-900 text-xl' : 'text-gray-700'
        }`}>
          {submission.name}
        </span>
        {isTop3 && (
          <motion.div 
            className="hidden sm:block"
            animate={{
              y: [0, -3, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <ChevronsUp className={`w-6 h-6 ${
              submission.rank === 1 ? 'text-yellow-500 drop-shadow-sm' : 
              submission.rank === 2 ? 'text-gray-400' : 'text-amber-700'
            }`} />
          </motion.div>
        )}
      </div>

      {/* Email */}
      <div className="col-span-3 text-gray-600 truncate z-10">
        {submission.email}
      </div>

      {/* Score */}
      <div className="col-span-3 flex flex-col items-end gap-1 z-10">
        <div className="font-bold text-green-800 text-lg flex items-center gap-1">
          {submission.score} 
          <span className="text-sm text-green-600">pts</span>
        </div>
        <div className="w-full max-w-[120px]">
          <ScoreProgress score={submission.score} maxScore={100} />
        </div>
      </div>
    </motion.div>
  );
};

const Leaderboard = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);

  const processSubmissions = (submissions) => {
    if (!submissions.length) return [];

    const sorted = [...submissions].sort((a, b) => b.score - a.score);

    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0) {
        sorted[i].rank = 1;
      } else {
        if (sorted[i].score === sorted[i - 1].score) {
          sorted[i].rank = sorted[i - 1].rank;
        } else {
          sorted[i].rank = i + 1;
        }
      }
    }

    return sorted;
  };

  useEffect(() => {
    // Simulate loading with a delay for demo purposes
    const timer = setTimeout(() => {
      fetch(`http://localhost:8080/api/submissions/leaderboard/${id}`)
        .then(res => res.json())
        .then(data => {
          const processedData = processSubmissions(data);
          setSubmissions(processedData);
          setFilteredSubmissions(processedData);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching leaderboard:", err);
          setIsLoading(false);
        });
    }, 1500);

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSubmissions(submissions);
    } else {
      const filtered = submissions.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubmissions(filtered);
    }
  }, [searchTerm, submissions]);

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const titleText = "Plant Champions Leaderboard";
  const subtitleText = "Celebrating our top cultivators and green-thumbed geniuses";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Animated Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="text-center mb-12 relative"
        >
          <div className="flex justify-center gap-2 mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0], 
                scale: [1, 1.1, 1],
                y: [0, -5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Trophy className="text-yellow-500 w-12 h-12 drop-shadow-lg" />
            </motion.div>
            <motion.div
              animate={{ 
                rotate: [0, -15, 15, 0], 
                scale: [1, 1.1, 1],
                y: [0, -8, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            >
              <Flower2 className="text-pink-500 w-12 h-12 drop-shadow-lg" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {titleText.split(' ').map((word, wordIndex) => (
              <motion.span 
                key={wordIndex}
                className="inline-block mr-2"
                variants={titleVariants}
              >
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={letterIndex}
                    className="inline-block"
                    variants={letterVariants}
                    style={{
                      backgroundImage: wordIndex % 2 === 0 
                        ? 'linear-gradient(to right, #065f46, #059669)' 
                        : 'linear-gradient(to right, #b45309, #d97706)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </h1>
          
          <motion.p 
            className="text-lg md:text-xl text-green-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {subtitleText}
          </motion.p>
          
          {/* Animated decorative elements */}
          <motion.div
            className="absolute top-0 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-10 right-1/4 w-20 h-20 bg-emerald-300 rounded-full opacity-15 blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search gardeners..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-green-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-green-500">
              <Leaf className="w-5 h-5" />
            </div>
            {searchTerm && (
              <motion.button
                onClick={() => setSearchTerm('')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </motion.button>
            )}
          </div>
        </motion.div>
        
        {/* Leaderboard Content */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { delay: i * 0.1 }
                }}
                className="bg-white/80 rounded-xl p-4 shadow-sm h-16 animate-pulse"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200/50"
          >
            {/* Header */}
            <div className="grid grid-cols-12 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 text-white p-5 font-bold text-lg sticky top-0 z-20">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-5 flex items-center gap-2">
                <LeafyGreen className="w-5 h-5" />
                Gardener
              </div>
              <div className="col-span-3">Email</div>
              <div className="col-span-3 text-right flex items-center justify-end gap-2">
                <span>Score</span>
                <ChevronsUp className="w-5 h-5" />
              </div>
            </div>
            
            {/* List */}
            <div className="divide-y divide-green-100/30 max-h-[500px] overflow-y-auto">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub, index) => (
                  <LeaderboardItem 
                    key={sub.id || sub.email} 
                    submission={sub} 
                    index={index} 
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-10 text-center"
                >
                  <motion.div 
                    animate={{ 
                      rotate: [0, 5, -5, 0], 
                      scale: [1, 1.05, 1],
                      y: [0, -5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="inline-flex items-center justify-center bg-green-100/50 rounded-full p-5 mb-6"
                  >
                    <Leaf className="text-green-600 w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-3">
                    No matching gardeners found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Try adjusting your search or browse all participants
                  </p>
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchTerm('')}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Show All
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Stats Footer */}
            {filteredSubmissions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-green-50/50 p-4 border-t border-green-100 flex flex-wrap justify-between items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-green-700">
                    <span className="font-semibold">{filteredSubmissions.length}</span> participants
                  </span>
                </div>
                
                {filteredSubmissions.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm text-green-700">
                        Top score: <span className="font-semibold">{Math.max(...filteredSubmissions.map(s => s.score))}</span> pts
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-green-700">
                        Avg score: <span className="font-semibold">
                          {(filteredSubmissions.reduce((a, b) => a + b.score, 0) / filteredSubmissions.length).toFixed(1)}
                        </span> pts
                      </span>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;