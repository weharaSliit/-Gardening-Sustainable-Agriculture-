import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js/auto';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiBarChart2, FiPieChart, FiAward, FiTrendingUp } from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaTree, FaRegLaughBeam, FaRegChartBar } from 'react-icons/fa';
import { GiPlantSeed, GiFlowerPot, GiPalmTree, GiBonsaiTree } from 'react-icons/gi';
import { RiPlantFill } from 'react-icons/ri';
import Nav from '../MainComponents/Nav';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const plantColors = [
  '#2e8b57', '#3cb371', '#20b2aa', '#66cdaa', '#8fbc8f',
  '#98fb98', '#00fa9a', '#00ff7f', '#7cfc00', '#32cd32',
  '#9acd32', '#6b8e23', '#556b2f', '#228b22', '#008000',
  '#7fff00', '#adff2f', '#a2cd5a', '#458b00', '#bdb76b'
];

const leafIcons = [
  <FaLeaf />, <FaSeedling />, <FaTree />, 
  <GiPlantSeed />, <GiFlowerPot />, <GiPalmTree />,
  <GiBonsaiTree />, <RiPlantFill />
];

const QuizStatistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('bar'); // 'bar', 'pie', or 'doughnut'
    const [animate, setAnimate] = useState(false);

    const fetchStats = () => {
        setLoading(true);
        setError(null);
        axios.get('http://localhost:8080/api/v1/challenges/quizStatistics')
            .then(response => {
                setStats(response.data);
                setLoading(false);
                setAnimate(true);
                setTimeout(() => setAnimate(false), 1000);
            })
            .catch(error => {
                console.error("Error fetching quiz statistics!", error);
                setError("Failed to load statistics. Please try again.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const getRandomPlantIcon = () => {
        return leafIcons[Math.floor(Math.random() * leafIcons.length)];
    };

    //  data for charts
    const prepareChartData = () => {
        if (!stats) return { labels: [], datasets: [] };
        
        const labels = Object.keys(stats.quizEngagement);
        const values = Object.values(stats.quizEngagement);
        const maxValue = Math.max(...values);
        
        return {
            labels,
            datasets: [{
                label: 'Quiz Engagement',
                data: values,
                backgroundColor: values.map((value, index) => {
                    const opacity = 0.4 + (value / maxValue * 0.6);
                    const color = plantColors[index % plantColors.length];
                    return color;
                }),
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverBackgroundColor: plantColors.map(color => `${color}cc`),
                hoverBorderColor: '#ffffff',
                borderRadius: 6,
            }]
        };
    };

    const chartData = prepareChartData();

    
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: "'Poppins', sans-serif",
                        size: 14,
                    },
                    color: '#2e8b57',
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(46, 139, 87, 0.9)',
                titleColor: '#f8f8f8',
                bodyColor: '#f8f8f8',
                footerColor: '#f8f8f8',
                padding: 12,
                borderColor: '#3cb371',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                usePointStyle: true,
                callbacks: {
                    label: (context) => {
                        return ` ${context.dataset.label}: ${context.raw}`;
                    }
                }
            },
        },
        animation: {
            duration: animate ? 1000 : 0,
            easing: 'easeOutQuart'
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    const barOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Quiz Engagement by Title',
                font: {
                    size: 18,
                    family: "'Poppins', sans-serif",
                    weight: '600',
                },
                color: '#2e8b57',
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: {
                        family: "'Poppins', sans-serif",
                        size: 12,
                    },
                    color: '#3cb371',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e0f2f1',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        family: "'Poppins', sans-serif",
                        size: 12,
                    },
                    color: '#3cb371',
                    padding: 10
                },
            }
        },
        elements: {
            bar: {
                borderSkipped: 'bottom',
                borderRadius: 8
            }
        }
    };

    const pieOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Quiz Participation Distribution',
                font: {
                    size: 18,
                    family: "'Poppins', sans-serif",
                    weight: '600',
                },
                color: '#2e8b57',
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
        },
        cutout: '0%',
        radius: '100%',
    };

    const doughnutOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            title: {
                display: true,
                text: 'Quiz Participation',
                font: {
                    size: 18,
                    family: "'Poppins', sans-serif",
                    weight: '600',
                },
                color: '#2e8b57',
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
        },
        cutout: '60%',
        radius: '90%',
    };

    const topQuiz = stats ? Object.entries(stats.quizEngagement).reduce((a, b) => a[1] > b[1] ? a : b) : null;
    const averageAttempts = stats ? Math.round(stats.totalSubmissions / stats.totalQuizzes) : 0;

    return (
        <>
        <Nav/>
        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-green-50 p-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                
                <div className="absolute top-20 right-10 opacity-20 text-green-400 text-6xl">
                    <GiPalmTree />
                </div>
                <div className="absolute bottom-40 left-10 opacity-20 text-green-300 text-5xl">
                    <GiBonsaiTree />
                </div>
                <div className="absolute top-1/3 left-20 opacity-20 text-green-500 text-4xl">
                    <GiFlowerPot />
                </div>

                <div className="flex items-center justify-between mb-8 relative">
                    <div className="flex items-center space-x-3">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <GiPlantSeed className="text-4xl text-emerald-600" />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            Quiz Garden Analytics
                        </h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchStats}
                        disabled={loading}
                        className={`flex items-center px-4 py-2 rounded-lg shadow-md ${loading ? 'bg-gray-300' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'} text-white transition-all`}
                    >
                        <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </motion.button>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 mb-6 rounded-lg bg-red-100 border border-red-300 text-red-700"
                    >
                        {error}
                    </motion.div>
                )}

                {loading && !stats ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"
                        ></motion.div>
                        <p className="text-lg text-emerald-700 flex items-center">
                            Growing your statistics... <GiPlantSeed className="ml-2 animate-pulse" />
                        </p>
                    </div>
                ) : stats ? (
                    <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-500 relative overflow-hidden"
                            >
                                <div className="absolute -bottom-4 -right-4 text-emerald-100 text-6xl">
                                    <FaRegChartBar />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Quizzes</p>
                                        <p className="text-3xl font-bold text-emerald-600">{stats.totalQuizzes}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600">
                                        <FiBarChart2 size={24} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500 relative overflow-hidden"
                            >
                                <div className="absolute -bottom-4 -right-4 text-teal-100 text-6xl">
                                    <FaRegLaughBeam />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Submissions</p>
                                        <p className="text-3xl font-bold text-teal-600">{stats.totalSubmissions}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600">
                                        <FiPieChart size={24} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 relative overflow-hidden"
                            >
                                <div className="absolute -bottom-4 -right-4 text-green-100 text-6xl">
                                    <FiAward />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Most Popular Quiz</p>
                                        <p className="text-xl font-bold text-green-600 truncate">{topQuiz ? topQuiz[0] : 'N/A'}</p>
                                        <p className="text-sm text-gray-500 mt-1">{topQuiz ? `${topQuiz[1]} attempts` : ''}</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-green-50 text-green-600">
                                        <FiAward size={24} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-lime-500 relative overflow-hidden"
                            >
                                <div className="absolute -bottom-4 -right-4 text-lime-100 text-6xl">
                                    <FiTrendingUp />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Avg. Attempts</p>
                                        <p className="text-3xl font-bold text-lime-600">{averageAttempts}</p>
                                        <p className="text-sm text-gray-500 mt-1">per quiz</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-gradient-to-br from-lime-100 to-lime-50 text-lime-600">
                                        <FiTrendingUp size={24} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Chart Toggle */}
                        <div className="flex justify-center">
                            <div className="inline-flex rounded-lg shadow-sm bg-white p-1 border border-emerald-100">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('bar')}
                                    className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'bar' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                >
                                    <FiBarChart2 className="mr-2" /> Bar Chart
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('pie')}
                                    className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'pie' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                >
                                    <FiPieChart className="mr-2" /> Pie Chart
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('doughnut')}
                                    className={`px-4 py-2 rounded-md flex items-center ${viewMode === 'doughnut' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                >
                                    <FaRegChartBar className="mr-2" /> Doughnut
                                </motion.button>
                            </div>
                        </div>

                        {/* Main Chart */}
                        <motion.div 
                            key={viewMode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-emerald-50"
                        >
                            <div className="h-96 relative">
                                {viewMode === 'bar' ? (
                                    <Bar data={chartData} options={barOptions} />
                                ) : viewMode === 'pie' ? (
                                    <Pie data={chartData} options={pieOptions} />
                                ) : (
                                    <Doughnut data={chartData} options={doughnutOptions} />
                                )}
                               
                            </div>
                        </motion.div>

                        {/* Quiz List */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-emerald-50">
                            <h3 className="text-xl font-semibold text-emerald-700 mb-4 flex items-center">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <FaLeaf className="mr-2" />
                                </motion.div>
                                All Quizzes
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(stats.quizEngagement).map(([quiz, count], index) => (
                                    <motion.div
                                        key={quiz}
                                        whileHover={{ scale: 1.02 }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center justify-between p-4 hover:bg-emerald-50 rounded-lg transition-all border border-emerald-100"
                                    >
                                        <div className="flex items-center">
                                            <span className="text-emerald-500 mr-3 text-xl">
                                                {getRandomPlantIcon()}
                                            </span>
                                            <span className="font-medium text-gray-700">{quiz}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 rounded-full text-sm font-medium mr-2">
                                                {count} {count === 1 ? 'attempt' : 'attempts'}
                                            </span>
                                            {topQuiz && topQuiz[0] === quiz && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
                                                    <FiAward className="mr-1" /> Top
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-xl shadow-lg text-white"
                        >
                            <div className="flex items-center">
                                <GiPlantSeed className="text-3xl mr-4" />
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Did You Know?</h3>
                                    <p className="text-sm opacity-90">
                                        Just like plants need care to grow, your quiz engagement grows with regular participation! 
                                        The most popular quiz has been taken {topQuiz ? topQuiz[1] : 'many'} times!
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                        <GiPlantSeed className="text-5xl text-gray-400 mb-4" />
                        <p>No statistics available. Please try refreshing.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={fetchStats}
                            className="mt-4 flex items-center px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            <FiRefreshCw className="mr-2" />
                            Refresh Data
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
        </>
    );
};

export default QuizStatistics;