import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode';
import { Leaf, CheckCircle, ChevronLeft, ChevronRight, Check, Circle, Sprout, Flower2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TakeQuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [errors, setErrors] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode.jwtDecode(token);
        setUserId(decoded.id); 
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    fetch(`http://localhost:8080/api/v1/challenges/viewChallenge/${id}`)
      .then(res => res.json())
      .then(data => {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(''));
      });
  }, [id]);

  const validate = () => {
    const newErrors = { name: '', email: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Enter a valid email address.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to submit the quiz.");
      return;
    }

    const score = calculateScore();

    const payload = {
      challengeId: id,
      name,
      email,
      userId,
      answers,
    };

    fetch('http://localhost:8080/api/submissions/submit', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.text())
      .then(msg => {
        toast.success(
          <div>
            <p>🎉 Congratulations, {name}!</p>
            <p>Your score: {score} / {quiz.questions.length}</p>
          </div>,
          {
            autoClose: false,
            closeButton: false,
            position: "top-center",
            className: "bg-green-500 text-white py-4 px-8 rounded-xl shadow-lg",
            bodyClassName: "text-xl",
            icon: <CheckCircle className="w-8 h-8" />,
          }
        );
        setTimeout(() => navigate(`/leaderboard/${id}`), 1500);
      })
      .catch(err => console.error("Error submitting quiz:", err));
  };

  const calculateScore = () => {
    return answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length;
  };

  const handleAnswerChange = (index, option) => {
    const newAnswers = [...answers];
    newAnswers[index] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (!quiz) return <p className="text-center text-green-700 text-xl mt-12">Loading... 🌿</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <ToastContainer />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-teal-50 to-emerald-100 opacity-90"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
                color: `hsl(${100 + Math.random() * 60}, 70%, 50%)`
              }}
            >
              <Leaf size={40 + Math.random() * 60} />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 border border-green-100">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-10">
            <Flower2 size={120} className="text-white" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <Leaf className="text-white mr-3" size={28} />
              <h1 className="text-2xl font-bold text-white">{quiz.challengeTitle}</h1>
            </div>
            <div className="text-white font-medium bg-green-700 px-3 py-1 rounded-full text-sm">
              Question {currentQuestion + 1}/{quiz.questions.length}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center space-x-2">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  index <= currentQuestion 
                    ? answers[index] ? 'bg-green-300 w-6' : 'bg-green-200 w-4'
                    : 'bg-white/30 w-2'
                } ${index === currentQuestion ? 'ring-2 ring-white' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-green-700/50 pl-10"
              />
              <Sprout className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
              {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>}
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-green-700/50 pl-10"
              />
              <Sprout className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
              {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <span className="text-green-600 font-bold mr-2">Q{currentQuestion + 1}.</span>
              {quiz.questions[currentQuestion].questionText}
            </h2>
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((opt, optIndex) => (
                <div
                  key={optIndex}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    answers[currentQuestion] === opt
                      ? 'border-green-500 bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50'
                  } relative overflow-hidden`}
                  onClick={() => handleAnswerChange(currentQuestion, opt)}
                >
                  {answers[currentQuestion] === opt && (
                    <div className="absolute top-0 left-0 h-full w-1 bg-green-500"></div>
                  )}
                  <div className="flex items-center">
                    <div className={`mr-3 ${
                      answers[currentQuestion] === opt ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {answers[currentQuestion] === opt ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                      <span className="text-gray-700">{opt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* navigation */}
          <div className="flex justify-between border-t pt-4">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                currentQuestion === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-green-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              <ChevronLeft className="mr-1" size={20} />
              Previous
            </button>
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                  answers[currentQuestion] 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-md' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="ml-1" size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!answers[currentQuestion] || !name || !email}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                  answers[currentQuestion] && name && email
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:shadow-md' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Quiz
                <CheckCircle className="ml-1" size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decorate Plants */}
      <div className="fixed bottom-4 right-4 text-green-600 opacity-30 z-0">
        <Leaf size={120} />
      </div>
      <div className="fixed top-4 left-4 text-emerald-500 opacity-20 z-0">
        <Flower2 size={100} />
      </div>
    </div>
  );
};

export default TakeQuizPage;
