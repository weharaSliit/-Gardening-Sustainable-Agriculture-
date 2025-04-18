import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Leaf, PlusCircle, Trash2, Save, XCircle } from "lucide-react";
import { FaMedal, FaHeading, FaRegQuestionCircle, FaListUl, FaCheck,FaRegStickyNote } from "react-icons/fa";

const EditChallenge = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState({
    challengeTitle: "",
    challengeDescription: "",
    badgeAwarded: "",
    questions: [],
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/challenges/viewChallenge/${challengeId}`)
      .then((res) => res.json())
      .then((data) => setChallenge(data))
      .catch((err) => console.error("Error fetching challenge:", err));
  }, [challengeId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...challenge.questions];
    updatedQuestions[index][field] = value;
    setChallenge({ ...challenge, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...challenge.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setChallenge({ ...challenge, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setChallenge({
      ...challenge,
      questions: [
        ...challenge.questions,
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updated = [...challenge.questions];
    updated.splice(index, 1);
    setChallenge({ ...challenge, questions: updated });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("challengeDetails", JSON.stringify(challenge));

      const response = await fetch(
        `http://localhost:8080/api/v1/challenges/updateChallenge/${challengeId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Challenge updated successfully! 🌱");
        navigate("/all-challenge");
      } else {
        throw new Error("Failed to update challenge");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong while updating the challenge. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-[#f7fdf7] min-h-screen text-grow-leaf font-growFont">
      <div className="flex items-center gap-2 mb-6">
        <Leaf className="w-7 h-7 text-grow-green animate-pulse-soft" />
        <h2 className="text-2xl font-bold">Edit Garden Quiz</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Challenge Title</label>
          <div className="flex items-center gap-2 mb-2">
            <FaHeading className="w-5 h-5 text-grow-green" />
            <input
              type="text"
              value={challenge.challengeTitle}
              onChange={(e) => setChallenge({ ...challenge, challengeTitle: e.target.value })}
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-grow-green"
            />
          </div>
        </div>

        <div>
  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
    <FaRegStickyNote className="w-5 h-5 text-grow-green" />
    Description
  </label>
  <textarea
    value={challenge.challengeDescription}
    onChange={(e) => setChallenge({ ...challenge, challengeDescription: e.target.value })}
    className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-grow-green"
  />
</div>

        <div>
          <label className="block text-sm font-medium mb-1">Badge Awarded</label>
          <div className="flex items-center gap-2 mb-2">
            <FaMedal className="w-5 h-5 text-grow-green" />
            <input
              type="text"
              value={challenge.badgeAwarded}
              onChange={(e) => setChallenge({ ...challenge, badgeAwarded: e.target.value })}
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-grow-green"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaListUl className="w-6 h-6 text-grow-green" />
            Questions
          </h3>
          {challenge.questions.map((q, index) => (
            <div key={index} className="border border-green-200 rounded-lg p-4 mb-4 bg-green-50">
              <div className="flex justify-between items-center">
                <label className="font-semibold">Question {index + 1}</label>
                <button onClick={() => removeQuestion(index)} className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Question text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                className="w-full border mt-2 border-green-300 rounded-md p-2"
              />

              <div className="mt-2 space-y-2">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <FaRegQuestionCircle className="w-5 h-5 text-grow-green" />
                    <input
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                      className="w-full border border-green-300 rounded-md p-2"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <FaCheck className="w-5 h-5 text-green-600" />
                <label className="block text-sm font-medium">Correct Answer</label>
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                  className="w-full border border-green-300 rounded-md p-2"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="flex items-center gap-2 text-grow-green font-medium hover:text-green-800 mt-2"
          >
            <PlusCircle className="w-5 h-5" /> Add Question
          </button>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => navigate("/all-challenge")}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
          >
            <XCircle className="w-5 h-5" /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
          >
            <Save className="w-5 h-5" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditChallenge;
