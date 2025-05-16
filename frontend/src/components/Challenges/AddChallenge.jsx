import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Leaf, Plus, Trash2, CheckCircle } from "lucide-react";
import { FaMedal, FaHeading, FaRegQuestionCircle, FaListUl, FaCheck } from "react-icons/fa";
import Nav from "../MainComponents/Nav";

const FloatingInput = ({
  label,
  value,
  onChange,
  name,
  type = "text",
  error,
  icon,
}) => (
  <div className="relative w-full mb-5">
    <div className="flex items-center border rounded-xl bg-opacity-40 backdrop-blur-md px-4 py-3 focus-within:ring-2 focus-within:ring-green-500 transition-all">
      {icon && <span className="mr-3 text-green-700">{icon}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-600"
      />
    </div>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const AddChallenge = () => {
  const navigate = useNavigate();
  const firstErrorRef = useRef(null);

  const [challenge, setChallenge] = useState({
    challengeTitle: "",
    challengeDescription: "",
    badgeAwarded: "",
    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
  });

  const [errors, setErrors] = useState({
    challengeTitle: "",
    challengeDescription: "",
    badgeAwarded: "",
    questions: [],
  });

  const handleChange = (e) => {
    setChallenge({ ...challenge, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...challenge.questions];
    if (field === "option") {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setChallenge({ ...challenge, questions: updatedQuestions });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      challengeTitle: "",
      challengeDescription: "",
      badgeAwarded: "",
      questions: [],
    };

    if (!challenge.challengeTitle.trim()) {
      newErrors.challengeTitle = "Title is required";
      isValid = false;
    }
    if (!challenge.challengeDescription.trim()) {
      newErrors.challengeDescription = "Description is required";
      isValid = false;
    }
    if (!challenge.badgeAwarded.trim()) {
      newErrors.badgeAwarded = "Badge name is required";
      isValid = false;
    }

    challenge.questions.forEach((q, i) => {
      const qErrors = { questionText: "", options: [], correctAnswer: "" };
      if (!q.questionText.trim()) {
        qErrors.questionText = "Question text is required";
        isValid = false;
      }

      const trimmedOptions = q.options.map(opt => opt.trim());
      const optionSet = new Set();

      trimmedOptions.forEach((opt, j) => {
        if (!opt) {
          qErrors.options[j] = `Option ${j + 1} is required`;
          isValid = false;
        } else if (optionSet.has(opt.toLowerCase())) {
          qErrors.options[j] = `Duplicate option`;
          isValid = false;
        } else {
          qErrors.options[j] = "";
          optionSet.add(opt.toLowerCase());
        }
      });

      if (!q.correctAnswer.trim()) {
        qErrors.correctAnswer = "Correct answer is required";
        isValid = false;
      } else if (!trimmedOptions.includes(q.correctAnswer.trim())) {
        qErrors.correctAnswer = "Correct answer must match one of the options exactly";
        isValid = false;
      }

      newErrors.questions[i] = qErrors;
    });

    setErrors(newErrors);

    setTimeout(() => {
      if (firstErrorRef.current) {
        firstErrorRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:8080/api/v1/challenges/challenge", challenge);
      alert("Challenge added successfully! 🌱");
      navigate("/all-challenge");
    } catch (error) {
      console.error("Error adding challenge", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  const addNewQuestion = () => {
    setChallenge({
      ...challenge,
      questions: [...challenge.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
    });
  };

  const removeQuestion = (index) => {
    const updated = [...challenge.questions];
    updated.splice(index, 1);
    setChallenge({ ...challenge, questions: updated });
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen flex flex-col sm:flex-row">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.95, 1, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-full sm:w-[45%] h-screen bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/back1.png')" }}
        >
          <motion.p
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-black text-lg italic font-medium z-20"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          >
            “Around the globe, we grow together”
          </motion.p>
        </motion.div>

        <div className="w-full sm:w-[55%] flex items-center justify-center px-5 sm:px-10 py-10 sm:py-14 bg-gradient-to-br from-green-450 via-white to-[#c7f5c7]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl"
          >
            <h2 className="flex items-center justify-center gap-2 text-3xl sm:text-4xl text-green-800 mb-2">
              <Leaf className="w-6 sm:w-7 h-6 sm:h-7 text-green-700" />
              Quiz Creator
            </h2>
            <motion.p
              className="text-sm text-center mb-6 italic text-green-700"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
            >
              “Nurture skills, grow together – the GrowSphere way.”
            </motion.p>

            <form onSubmit={handleSubmit}>
              <h3 className="flex items-center gap-2 text-xl text-green-800 mb-4">
                <Leaf className="w-5 h-5 text-green-700" /> Challenge Details
              </h3>

              <div ref={errors.challengeTitle ? firstErrorRef : null}>
                <FloatingInput
                  label="Challenge Title"
                  name="challengeTitle"
                  value={challenge.challengeTitle}
                  onChange={handleChange}
                  error={errors.challengeTitle}
                  icon={<FaHeading />}
                />
              </div>

              <div className="relative w-full mb-5">
                <div className="flex border rounded-xl bg-opacity-40 backdrop-blur-md px-4 py-3 focus-within:ring-2 focus-within:ring-green-500 transition-all">
                  <span className="mr-3 text-green-700 flex items-start mt-1"><FaRegQuestionCircle /></span>
                  <textarea
                    name="challengeDescription"
                    value={challenge.challengeDescription}
                    onChange={handleChange}
                    placeholder="Challenge Description"
                    rows={4}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-600 resize-none"
                  />
                </div>
                {errors.challengeDescription && (
                  <p className="text-red-600 text-sm mt-1">{errors.challengeDescription}</p>
                )}
              </div>

              <FloatingInput
                label="Badge Awarded"
                name="badgeAwarded"
                value={challenge.badgeAwarded}
                onChange={handleChange}
                error={errors.badgeAwarded}
                icon={<FaMedal />}
              />

              <div className="flex items-center justify-between mt-10 mb-4">
                <h3 className="flex items-center gap-2 text-xl text-green-800">
                  <CheckCircle className="w-5 h-5 text-green-700" /> Question Details
                </h3>
                <motion.button
                  type="button"
                  onClick={addNewQuestion}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-700 to-lime-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" /> Add Question
                </motion.button>
              </div>

              {challenge.questions.map((q, idx) => (
                <div key={idx} className="p-4 bg-opacity-40 backdrop-blur-lg border border-gray-300 rounded-xl mb-6 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-green-700">Question {idx + 1}</h4>
                    {challenge.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(idx)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <FloatingInput
                    label="Question Text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
                    error={errors.questions[idx]?.questionText}
                    icon={<FaListUl />}
                  />

                  {q.options.map((opt, i) => (
                    <FloatingInput
                      key={i}
                      label={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...q.options];
                        newOptions[i] = e.target.value;
                        handleQuestionChange(idx, "option", newOptions);
                      }}
                      error={errors.questions[idx]?.options?.[i]}
                      icon={<FaListUl />}
                    />
                  ))}

                  <FloatingInput
                    label="Correct Answer"
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                    error={errors.questions[idx]?.correctAnswer}
                    icon={<FaCheck />}
                  />
                </div>
              ))}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="mt-2 ml-auto block bg-gradient-to-r from-green-700 to-lime-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                Create Quiz Challenge
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AddChallenge;
