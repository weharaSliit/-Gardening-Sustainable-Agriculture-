import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Leaf, CheckCircle } from 'lucide-react';
import Nav from '../MainComponents/Nav';

const TakeQuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/challenges/viewChallenge/${id}`)
      .then(res => res.json())
      .then(data => {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(''));
      });
  }, [id]);

  const handleSubmit = () => {
    fetch('http://localhost:8080/api/submissions/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: id, name, email, answers }),
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        navigate(`/leaderboard/${id}`);
      })
      .catch(err => console.error("Error submitting quiz:", err));
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
    <>
      
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-16 bg-black">

       
      <div className="absolute inset-0 z-0">
  
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-green-300 via-green-500 to-green-800 opacity-20 rounded-full blur-3xl animate-pulse"></div>
  
  
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-lime-200 via-emerald-400 to-green-700 opacity-25 rounded-full blur-2xl animate-ping"></div>

  
  <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-200 via-green-400 to-lime-600 opacity-10 rounded-full blur-[150px] transform -translate-x-1/2 -translate-y-1/2"></div>

  
  <div className="absolute -top-24 right-1/3 w-64 h-64 bg-gradient-to-tl from-green-100 via-green-400 to-emerald-600 opacity-20 rounded-full blur-2xl animate-pulse"></div>
  
  
  <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-lime-300 via-green-500 to-teal-700 opacity-15 rounded-full blur-2xl animate-ping"></div>

  
  <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-green-400 via-green-600 to-lime-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
</div>

        
        <div className="relative z-10 max-w-2xl w-full bg-gray-900 text-white shadow-2xl rounded-3xl p-10 transform transition-all duration-500 hover:scale-105">
          <div className="flex items-center mb-4">
            <Leaf className="text-green-400 mr-2" size={36} />
            <h2 className="text-4xl font-extrabold">{quiz.challengeTitle}</h2>
          </div>
          <p className="text-lg text-gray-300 mb-6">{quiz.challengeDescription}</p>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
            />
          </div>

          <div className="question-section mb-8">
            <div className="question-header mb-6">
              <p className="text-xl font-semibold text-gray-300">{quiz.questions[currentQuestion].questionText}</p>
            </div>
            <div className="options space-y-4">
              {quiz.questions[currentQuestion].options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center text-lg">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={opt}
                    checked={answers[currentQuestion] === opt}
                    onChange={() => handleAnswerChange(currentQuestion, opt)}
                    className="text-green-500 focus:ring-2 focus:ring-green-400"
                  />
                  <label className="ml-3 text-gray-300">{opt}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <button
              onClick={handlePrev}
              className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all"
            >
              Next
            </button>
          </div>

          {currentQuestion === quiz.questions.length - 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                Submit Quiz
                <CheckCircle className="inline-block ml-3 text-green-400" size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TakeQuizPage;
