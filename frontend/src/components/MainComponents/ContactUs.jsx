import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Flower2, Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import Nav from './Nav';

const ContactUs = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };

  return (
    <>
      <Nav/>
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 font-growFont overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
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
            {i % 5 === 0 ? (
              <Leaf className="w-16 h-16 text-green-300 opacity-20" />
            ) : i % 5 === 1 ? (
              <Flower2 className="w-12 h-12 text-pink-300 opacity-20" />
            ) : i % 5 === 2 ? (
              <Sprout className="w-10 h-10 text-emerald-400 opacity-20" />
            ) : i % 5 === 3 ? (
              <Mail className="w-12 h-12 text-blue-300 opacity-20" />
            ) : (
              <MessageCircle className="w-12 h-12 text-teal-300 opacity-20" />
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
            variants={scaleUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
              Let's Grow Together
            </h1>
            <p className="text-xl md:text-2xl text-green-700 max-w-3xl mx-auto">
              Reach out to our gardening community - we're here to help your green journey flourish.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl shadow-xl p-8 md:p-10 border border-green-200 h-full"
            >
              <h2 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-green-600" />
                Our Greenhouse
              </h2>
              <p className="text-green-700 mb-6">
                123 Garden Way<br />
                Colombo, Sri Lanka<br />
              </p>
            </motion.div>

            
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl shadow-xl p-8 md:p-10 border border-green-200 h-full"
            >
              <h2 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                <Phone className="w-8 h-8 text-green-600" />
                Direct Connections
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-800">Email</h3>
                    <a href="mailto:hello@growsphere.com" className="text-green-700 hover:text-emerald-700 transition">hello@growsphere.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-800">Phone</h3>
                    <a href="tel:+18005551234" className="text-green-700 hover:text-emerald-700 transition">+94 2921823</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MessageCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-800">Live Chat</h3>
                    <p className="text-green-700">Available 9am-5pm EST on Facebook</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-b from-white/70 to-green-50 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extrabold text-green-800 mb-4 tracking-tight">Growing Questions?</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="space-y-4">
            {[{
                question: "How quickly can I expect a response to my inquiry?",
                answer: "Our team typically responds within 24-48 hours. For urgent matters, please call our support line."
              },
              {
                question: "Do you offer gardening advice through your contact channels?",
                answer: "Absolutely! Our community experts are happy to help with any plant-related questions you have."
              },
              {
                question: "Can I visit your physical location?",
                answer: "Our greenhouse headquarters welcomes visitors by appointment. Contact us to schedule a tour."
              },
              {
                question: "Do you have community forums for discussion?",
                answer: "Yes! We host vibrant community forums where gardeners share tips and experiences daily."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-md border border-green-100 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-green-800 mb-2 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-500" />
                  {item.question}
                </h3>
                <p className="text-green-700 pl-7">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Leaf className="w-8 h-8 text-green-300" />
              <span className="text-2xl font-semibold text-green-200">GrowSphere</span>
            </div>
            <p className="text-green-400 text-center">© 2025 GrowSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default ContactUs;