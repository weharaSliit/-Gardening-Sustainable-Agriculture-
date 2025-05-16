import React, { useState } from 'react';

const VerifyApplication = ({ onClose }) => {
  const [applicationText, setApplicationText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setApplicationText(e.target.value);
  };

  const handleSubmit = async () => {
    if (applicationText.trim() === '') return;

    setSubmitting(true);
    try {
      // Replace with your real API endpoint
      const response = await fetch('http://localhost:8080/api/verify-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: applicationText }),
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        setApplicationText('');
        if (onClose) onClose();
      } else {
        alert('Failed to submit application.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto border mt-10">
      <h3 className="text-2xl font-bold text-green-800 mb-4">Apply for Verification</h3>
      <textarea
        value={applicationText}
        onChange={handleInputChange}
        rows={5}
        className="w-full p-3 border border-gray-300 rounded-lg"
        placeholder="Tell us why you should be verified..."
      />
      <div className="flex gap-4 mt-4 justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyApplication;
