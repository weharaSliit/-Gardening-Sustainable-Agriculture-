import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Flower2, Trees, Sun, Award, Users, BookOpen } from 'lucide-react';
import Nav from './Nav';

const Home = () => {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 font-growFont overflow-hidden">
      <Nav />

      
      <motion.section 
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
       
        <div className="absolute inset-0 z-0 opacity-10">
          <motion.div 
            className="absolute top-10 left-10"
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
          >
            <Leaf className="w-32 h-32 text-green-300" />
          </motion.div>
          <motion.div 
            className="absolute bottom-20 right-20"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <Flower2 className="w-40 h-40 text-pink-300" />
          </motion.div>
        </div>

        
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40 relative z-10 text-center">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative">
              <Leaf className="w-16 h-16 text-green-600 animate-pulse" />
              <Sprout className="w-8 h-8 text-emerald-400 absolute -bottom-2 -right-2 animate-bounce-slow" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Grow Together, <br className="hidden md:block"/> Learn Together
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-green-700 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            Cultivate your gardening skills with our community of green thumbs. Share knowledge, grow plants, and nurture connections.
          </motion.p>

         
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link 
              to="/register" 
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sprout className="w-6 h-6" />
              Join Our Garden
            </Link>
            <Link 
              to="/explore-tutorials" 
              className="px-8 py-4 bg-white text-green-700 border-2 border-green-200 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Leaf className="w-6 h-6" />
              Explore Knowledge
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
<section className="py-20 bg-gradient-to-b from-white/70 to-green-50 backdrop-blur-lg">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-5xl font-extrabold text-green-800 mb-4 tracking-tight">Why Grow With Us?</h2>
      <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      {[
        { icon: <BookOpen className="w-12 h-12 text-green-600" />, title: "Comprehensive Guides", desc: "Access detailed plant care guides for every skill level." },
        { icon: <Users className="w-12 h-12 text-green-600" />, title: "Vibrant Community", desc: "Connect with fellow gardeners and experts worldwide." },
        { icon: <Sun className="w-12 h-12 text-green-600" />, title: "Garden Logs", desc: "Plan, track, and celebrate your cultivation journey with ease." },
        { icon: <Award className="w-12 h-12 text-green-600" />, title: "Earn Badges", desc: "Grow your skills and earn recognition from our green community." }
      ].map((feature, index) => (
        <motion.div 
          key={index}
          className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-green-100 hover:border-green-300 transition-all duration-300 flex flex-col items-center text-center"
          whileHover={{ scale: 1.07 }}
        >
          <div className="w-20 h-20 bg-green-100 group-hover:bg-emerald-100 rounded-full flex items-center justify-center mb-6 transition-all duration-300">
            {feature.icon}
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-3">{feature.title}</h3>
          <p className="text-green-700">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Testimonials Section */}
<section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-5xl font-extrabold text-green-800 mb-4 tracking-tight">What Gardeners Say</h2>
      <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {[
        { quote: "GrowSphere transformed my tiny balcony into a thriving urban garden!", author: "Maria S., Urban Gardener", plant: "🌿" },
        { quote: "I've doubled my harvest since joining this amazing community.", author: "James T., Vegetable Grower", plant: "🍅" },
        { quote: "Finally found a place where my plant questions get real answers!", author: "Priya K., Indoor Plant Lover", plant: "🪴" }
      ].map((testimonial, index) => (
        <motion.div 
          key={index}
          className="bg-white p-10 rounded-3xl shadow-md relative overflow-hidden border hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.03 }}
        >
         
          <div className="absolute top-5 right-5 text-7xl opacity-20 pointer-events-none">
            {testimonial.plant}
          </div>
          <p className="text-2xl italic text-green-800 mb-8 relative z-10">"{testimonial.quote}"</p>
          <p className="font-bold text-green-700 text-lg relative z-10">— {testimonial.author}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      
      <motion.section 
        className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Trees className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Gardening Skills?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of gardeners cultivating knowledge and beautiful plants together.
          </p>
          <Link 
            to="/login" 
            className="inline-block px-10 py-4 bg-white text-green-700 rounded-full font-bold text-lg shadow-xl hover:bg-green-50 hover:shadow-2xl transition-all duration-300"
          >
            Start Growing Today
          </Link>
        </div>
      </motion.section>

      {/* footer */}
      <footer className="bg-green-900 text-green-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Leaf className="w-8 h-8 text-green-300" />
              <span className="text-2xl font-bold">GrowSphere</span>
            </div>
            <div className="flex gap-6">
              <Link to="/about" className="hover:text-white transition">About</Link>
              <Link to="/contact" className="hover:text-white transition">Contact</Link>
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

export default Home;
