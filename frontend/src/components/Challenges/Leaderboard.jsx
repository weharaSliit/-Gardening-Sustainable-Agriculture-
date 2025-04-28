import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Leaf, Trophy, Award, Sprout, ChevronsUp, LeafyGreen } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to process submissions and assign ranks
  const processSubmissions = (submissions) => {
    if (!submissions.length) return [];

    // Sort by score descending
    const sorted = [...submissions].sort((a, b) => b.score - a.score);

    // Assign ranks accounting for ties
    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0) {
        sorted[i].rank = 1;
      } else {
        if (sorted[i].score === sorted[i - 1].score) {
          // Same score as previous, same rank
          sorted[i].rank = sorted[i - 1].rank;
        } else {
          // New score, increment rank based on position
          sorted[i].rank = i + 1;
        }
      }
    }

    return sorted;
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/submissions/leaderboard/${id}`)
      .then(res => res.json())
      .then(data => {
        const processedData = processSubmissions(data);
        setSubmissions(processedData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching leaderboard:", err);
        setIsLoading(false);
      });
  }, [id]);

  // Medal colors for top 3 
  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-600 shadow-lg shadow-yellow-200/50';
      case 2: return 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-400 shadow-lg shadow-gray-200/50';
      case 3: return 'bg-gradient-to-br from-amber-500 via-amber-400 to-amber-800 shadow-lg shadow-amber-200/50';
      default: return 'bg-green-100 border border-green-200';
    }
  };

  // Crown icons for top 3
  const getCrown = (rank) => {
    switch(rank) {
      case 1: return <Trophy className="w-7 h-7 text-yellow-500 animate-bounce" />;
      case 2: return <Award className="w-6 h-6 text-gray-400 animate-pulse" />;
      case 3: return <Award className="w-6 h-6 text-amber-700 animate-pulse" />;
      default: return <Sprout className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-emerald-300 rounded-full opacity-15 blur-2xl"></div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-3 flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Trophy className="text-yellow-500 w-10 h-10 drop-shadow-lg" />
            </motion.div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
              Plant Champions Leaderboard
            </span>
            <motion.div
              animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            >
              <Leaf className="text-green-600 w-10 h-10 drop-shadow-lg" />
            </motion.div>
          </h1>
          <p className="text-lg md:text-xl text-green-700">
            Celebrating our top cultivators and green-thumbed geniuses
          </p>
        </motion.div>

       
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/80 rounded-xl p-4 shadow-sm h-16 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200/50"
          >
            
            <div className="grid grid-cols-12 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 text-white p-5 font-bold text-lg">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-5 flex items-center gap-2">
                <LeafyGreen className="w-5 h-5" />
                Gardener
              </div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2 text-right flex items-center justify-end gap-2">
                <span>Score</span>
                <ChevronsUp className="w-5 h-5" />
              </div>
            </div>
            
            
            <div className="divide-y divide-green-100/30">
              {submissions.map((sub) => (
                <div
                  key={sub.id || sub.email}
                  className={`grid grid-cols-12 items-center p-5 transition-all duration-300 ease-out hover:bg-green-50/70 ${
                    sub.rank <= 3 ? 'bg-gradient-to-r from-green-50/80 to-emerald-50/80' : ''
                  } group`}
                >
                  
                  <div className="col-span-1 flex justify-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 ${getMedalColor(sub.rank)}`}
                    >
                      <span className={`font-bold text-lg ${
                        sub.rank <= 3 ? 'text-white drop-shadow-md' : 'text-green-800'
                      }`}>
                        {sub.rank}
                      </span>
                    </div>
                  </div>

                  
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="transition-transform duration-300 hover:scale-110">
                      {getCrown(sub.rank)}
                    </div>
                    <span className={`font-medium ${
                      sub.rank <= 3 ? 'text-green-900 text-xl' : 'text-gray-700'
                    }`}>
                      {sub.name}
                    </span>
                    {sub.rank <= 3 && (
                      <div className="hidden sm:block">
                        <ChevronsUp className={`w-6 h-6 ${
                          sub.rank === 1 ? 'text-yellow-500 drop-shadow-sm' : 
                          sub.rank === 2 ? 'text-gray-400' : 'text-amber-700'
                        }`} />
                      </div>
                    )}
                  </div>

                  
                  <div className="col-span-4 text-gray-600 truncate">
                    {sub.email}
                  </div>

                  
                  <div className="col-span-2 text-right font-bold text-green-800 text-lg">
                    {sub.score} <span className="text-sm text-green-600">pts</span>
                  </div>
                </div>
              ))}
            </div>

            
            {submissions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-10 text-center"
              >
                <motion.div 
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="inline-flex items-center justify-center bg-green-100/50 rounded-full p-5 mb-6"
                >
                  <Leaf className="text-green-600 w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-green-800 mb-3">No submissions yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Plant your knowledge seed and be the first to grow on our leaderboard!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Take the Challenge
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden -z-10">
          <motion.div 
            animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-0 left-1/4 w-48 h-48 bg-green-200 rounded-full opacity-10 blur-3xl"
          />
          <motion.div 
            animate={{ x: [0, -25, 0], y: [0, -5, 0] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-300 rounded-full opacity-10 blur-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;