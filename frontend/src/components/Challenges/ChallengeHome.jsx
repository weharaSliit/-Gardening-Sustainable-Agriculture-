import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../MainComponents/Nav';
import { 
  Leaf, Flower, Sprout, TreeDeciduous, 
  ChevronRight, BarChart2, Sun
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHome = () => {
  const navigate = useNavigate();
  const [gardenProgress, setGardenProgress] = useState(0);

  // Simulate garden growth progress once
  useEffect(() => {
    setGardenProgress(82); // Simulated progress percentage
  }, []);

  const navigateTo = (path) => {
    navigate(path);
  };

  const AdminCard = ({ title, description, onClick, buttonText, icon, index }) => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)"
        }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl shadow-md overflow-hidden p-6 transition-all duration-300 hover:-translate-y-2 border border-gray-100 group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6 text-sm pl-16">{description}</p>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={onClick}
            className="ml-16 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow hover:shadow-md"
          >
            {buttonText}
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const GardenVisualization = () => {
    const plants = [
      { icon: <Sprout size={16} />, progress: 30 },
      { icon: <Leaf size={16} />, progress: 60 },
      { icon: <Flower size={16} />, progress: 90 },
      { icon: <TreeDeciduous size={16} />, progress: 100 },
    ];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Sun className="text-yellow-500" size={18} /> Community Garden Progress
          </h3>
          <span className="text-sm font-medium text-green-600">
            {gardenProgress}% Flourishing
          </span>
        </div>
        
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-6">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${gardenProgress}%` }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full"
          />
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {plants.map((plant, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              className={`text-center p-3 rounded-lg ${gardenProgress >= plant.progress 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-gray-50 text-gray-400'}`}
            >
              <div className="flex justify-center mb-2">
                {React.cloneElement(plant.icon, {
                  className: gardenProgress >= plant.progress ? 'text-green-500' : 'text-gray-300'
                })}
              </div>
              <span className="text-xs font-medium">
                {plant.progress}% {index === 0 ? 'Sprouted' : index === 1 ? 'Growing' : index === 2 ? 'Blooming' : 'Thriving'}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-green-50 p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <header className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-3"
            >
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600">Garden</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Cultivate knowledge and watch your community blossom
            </motion.p>
          </header>

          <GardenVisualization />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <AdminCard
              title="Plant Challenge"
              description="Sow new coding challenges for users"
              onClick={() => navigateTo('/add-challenge')}
              buttonText="Add Seed"
              icon={<Sprout size={20} />}
              index={0}
            />

            <AdminCard
              title="View Garden"
              description="Tend to all growing challenges"
              onClick={() => navigateTo('/all-challenge')}
              buttonText="Tend Garden"
              icon={<TreeDeciduous size={20} />}
              index={1}
            />


            <AdminCard
              title="Blooming Quizzes"
              description="Nurture published quizzes"
              onClick={() => navigateTo('/all-posted-quizzes')}
              buttonText="Water Quizzes"
              icon={<Flower size={20} />}
              index={3}
            />

            <AdminCard
              title="Quiz Statistics"
              description="View detailed quiz statistics and insights"
              onClick={() => navigateTo('/quiz-statistics')}
              buttonText="View Stats"
              icon={<BarChart2 size={20} />}
              index={4}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminHome;