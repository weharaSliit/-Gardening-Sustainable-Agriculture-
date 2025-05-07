import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Flower2, Trees, Sun, Users,  BookOpen, Globe, Heart, Shield } from 'lucide-react';
import CountUp from 'react-countup';
import Nav from './Nav';

const About = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
        <Nav/>
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 font-growFont overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              rotate: Math.random() * 360
            }}
            animate={{
              y: [0, (Math.random() * 40) - 20],
              x: [0, (Math.random() * 40) - 20],
              rotate: [0, (Math.random() * 60) - 30]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          >
            {i % 4 === 0 ? (
              <Leaf className="w-16 h-16 text-green-300 opacity-20" />
            ) : i % 4 === 1 ? (
              <Flower2 className="w-12 h-12 text-pink-300 opacity-20" />
            ) : i % 4 === 2 ? (
              <Sprout className="w-10 h-10 text-emerald-400 opacity-20" />
            ) : (
              <Trees className="w-20 h-20 text-green-500 opacity-20" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
             
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
              Our Growing Story
            </h1>
            <p className="text-xl md:text-2xl text-green-700 max-w-3xl mx-auto">
              Cultivating a global community of passionate gardeners and plant lovers
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-green-200 max-w-5xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 shadow-inner border border-green-200"
                >
                  <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-green-800 text-center mb-4">Rooted in Passion</h2>
                  <p className="text-green-700 text-center">
                    GrowSphere began as a seed of an idea between three plant-loving friends in 2025.
                  </p>
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <p className="text-lg text-green-800 mb-6">
                  What started as a small community garden project has blossomed into a vibrant platform connecting thousands of gardeners worldwide. Our mission is simple: to help everyone cultivate their green thumb.
                </p>
                <p className="text-lg text-green-800">
                  We believe that growing plants should be accessible, rewarding, and most importantly - fun! Whether you're nurturing your first succulent or managing an urban farm, we're here to help you grow.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-white/70 to-green-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extrabold text-green-800 mb-4 tracking-tight">Our Core Values</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { 
                icon: <Heart className="w-12 h-12 text-green-600" />,
                title: "Passion for Plants",
                desc: "We share an unbridled enthusiasm for all things green and growing"
              },
              { 
                icon: <Globe className="w-12 h-12 text-green-600" />,
                title: "Community First",
                desc: "Our strength grows from the diversity of our global gardening community"
              },
              { 
                icon: <Shield className="w-12 h-12 text-green-600" />,
                title: "Sustainable Growth",
                desc: "We promote eco-friendly practices that nurture our planet"
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl border border-green-100 hover:border-green-300 transition-all duration-300 flex flex-col items-center text-center"
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-3">{value.title}</h3>
                <p className="text-green-700">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extrabold text-green-800 mb-4 tracking-tight">Meet Our Gardeners</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: "Wehara Soyza",
                role: "Founder & CEO",
                bio: "Botany expert with 15 years of horticulture experience",
                plant: "🌿"
              },
              { 
                name: "Thanuri Dissanayaka",
                role: "Community Director",
                bio: "Urban farming specialist and community organizer",
                plant: "🍅"
              },
              { 
                name: "Chaturika Unagalle",
                role: "Head of Education",
                bio: "Author of 'The Mindful Gardener' book series",
                plant: "🌸"
              },
              { 
                name: "Hiruni Jayasekara",
                role: "Tech Lead",
                bio: "Makes sure our digital garden keeps growing",
                plant: "🌵"
              }
            ].map((member, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg border border-green-100 hover:border-green-300 transition-all duration-300 text-center"
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-6xl mb-4">{member.plant}</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-4">{member.role}</p>
                <p className="text-green-700">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[ 
            { 
              number: "10000", 
              label: "Active Gardeners", 
              icon: <Users className="w-10 h-10 mx-auto mb-2" />,
              color: 'from-green-100 to-green-300'
            },
            { 
              number: "500", 
              label: "Plant Guides", 
              icon: <BookOpen className="w-10 h-10 mx-auto mb-2" />,
              color: 'from-emerald-100 to-emerald-300'
            },
            { 
              number: "80", 
              label: "Countries Reached", 
              icon: <Globe className="w-10 h-10 mx-auto mb-2" />,
              color: 'from-green-200 to-green-500'
            },
            { 
              number: "1000000", 
              label: "Plants Grown", 
              icon: <Sun className="w-10 h-10 mx-auto mb-2" />,
              color: 'from-yellow-100 to-yellow-400'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex flex-col items-center p-8 rounded-3xl shadow-md border border-green-100 hover:border-green-300 transition-all duration-300 text-center"
            >
              {stat.icon}
              <h3 className="text-3xl font-extrabold">
                <CountUp 
                  start={0} 
                  end={parseInt(stat.number.replace(",", ""))} 
                  duration={3} 
                  separator=","
                />
              </h3>
              <p className="text-white/80">{stat.label}</p>
              <div className="mt-4 w-full h-2 bg-gradient-to-r rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>



      
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-green-800 mb-6">Ready to Join Our Garden?</h2>
            <p className="text-xl text-green-700 mb-10 max-w-2xl mx-auto">
              Become part of our growing community and start sharing your gardening journey today.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link 
                to="/register" 
                className="inline-block px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Growing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Leaf className="w-8 h-8 text-green-300" />
              <span className="text-2xl font-bold">GrowSphere</span>
            </div>
            <div className="flex gap-6">
              <Link to="/about" className="hover:text-white transition hover:underline">About</Link>
              <Link to="/contact" className="hover:text-white transition hover:underline">Contact</Link>
              
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-400">
            <p>© {new Date().getFullYear()} GrowSphere. Cultivating knowledge, growing communities.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default About;