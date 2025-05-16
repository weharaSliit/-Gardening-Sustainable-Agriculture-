// src/components/Tutorial/AddTutorial.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function AddTutorial() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    tutorialId: '',
    title: '',
    description: '',
    tutorialType: '',
    categories: '',
    difficulty: '',
    estimatedDuration: '',
    tutorialImage: null,
    mediaFiles: [],
    outline: [],
    learningOutcomes: [],
    skillsGained: [],
    detailsToKnow: []
  });

  // temp inputs for the compound fields
  const [newStep, setNewStep] = useState({ stepNumber: '', title: '', content: '' });
  const [newOutcome, setNewOutcome] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newDetail, setNewDetail] = useState({ label: '', value: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };
  
  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFormData(f => ({ ...f, tutorialImage: e.target.files[0] }));
      
      // Show preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleMediaChange = e =>
    setFormData(f => ({ ...f, mediaFiles: Array.from(e.target.files) }));

  // compound handlers
  const addStep = e => {
    e.preventDefault();
    if (!newStep.stepNumber || !newStep.title) return;
    setFormData(f => ({
      ...f,
      outline: [
        ...f.outline,
        {
          stepNumber: parseInt(newStep.stepNumber, 10),
          title: newStep.title,
          content: newStep.content
        }
      ]
    }));
    setNewStep({ stepNumber: '', title: '', content: '' });
  };

  const removeStep = (index) => {
    setFormData(f => ({
      ...f,
      outline: f.outline.filter((_, i) => i !== index)
    }));
  };

  const addOutcome = e => {
    e.preventDefault();
    if (!newOutcome.trim()) return;
    setFormData(f => ({
      ...f,
      learningOutcomes: [...f.learningOutcomes, newOutcome.trim()]
    }));
    setNewOutcome('');
  };

  const removeOutcome = (index) => {
    setFormData(f => ({
      ...f,
      learningOutcomes: f.learningOutcomes.filter((_, i) => i !== index)
    }));
  };

  const addSkill = e => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setFormData(f => ({
      ...f,
      skillsGained: [...f.skillsGained, newSkill.trim()]
    }));
    setNewSkill('');
  };

  const removeSkill = (index) => {
    setFormData(f => ({
      ...f,
      skillsGained: f.skillsGained.filter((_, i) => i !== index)
    }));
  };

  const addDetail = e => {
    e.preventDefault();
    if (!newDetail.label.trim() || !newDetail.value.trim()) return;
    setFormData(f => ({
      ...f,
      detailsToKnow: [...f.detailsToKnow, { ...newDetail }]
    }));
    setNewDetail({ label: '', value: '' });
  };

  const removeDetail = (index) => {
    setFormData(f => ({
      ...f,
      detailsToKnow: f.detailsToKnow.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // 1) upload cover image
      let imageName = '';
      if (formData.tutorialImage) {
        const imgData = new FormData();
        imgData.append('file', formData.tutorialImage);
        
        const imgRes = await axiosClient.post('/tutorial/image', imgData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        imageName = imgRes.data;
      }

      // 2) create tutorial JSON
      const payload = {
        tutorialId: formData.tutorialId,
        title: formData.title,
        description: formData.description,
        tutorialType: formData.tutorialType,
        categories: formData.categories
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        difficulty: formData.difficulty,
        estimatedDuration: formData.estimatedDuration,
        tutorialImage: imageName,
        outline: formData.outline,
        learningOutcomes: formData.learningOutcomes,
        skillsGained: formData.skillsGained,
        detailsToKnow: formData.detailsToKnow
      };

      const response = await axiosClient.post('/tutorial', payload);
      const created = response.data;

      // 3) upload media files if any
      if (formData.mediaFiles.length) {
        const mediaForm = new FormData();
        formData.mediaFiles.forEach(f => mediaForm.append('files', f));
        
        await axiosClient.post(`/tutorial/${created.id}/media`, mediaForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Show success message
      setSuccess('Tutorial added successfully!');
      
      // Add a delay before redirecting to home
      setTimeout(() => {
        navigate('/thome');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating tutorial:', err);
      setError('Failed to create tutorial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navigation Bar - Added from THome component */}
      <nav className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
              </svg>
              <span className="font-bold text-xl">GrowSphere</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/thome" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Tutorial
            </Link>
            <Link to="/challenge-home#community" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Community
            </Link>
            <Link to="/challenge-home" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Challenges
            </Link>
            <Link to="/about" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About Us
            </Link>
            <Link to="/contact" className="flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
            <Link to="/login" className="ml-2">Login</Link>
            <Link to="/register" className="bg-white text-green-800 px-4 py-2 rounded-md hover:bg-green-100 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create a Gardening Tutorial</h1>
          <p className="text-gray-600 mt-2">
            Share your knowledge and help others learn sustainable gardening practices
          </p>
        </div>

        {/* Success Message Dialog */}
        {success && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-10 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">localhost:5173 says</h3>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">{success}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => navigate('/thome')}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Tutorial Information */}
            <section>
              <div className="bg-green-600 px-6 py-3">
                <h2 className="text-white font-medium">Basic Information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tutorial ID</label>
                  <input
                    name="tutorialId"
                    value={formData.tutorialId}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
              </div>
            </section>

            {/* Classification & Difficulty */}
            <section>
              <div className="bg-green-600 px-6 py-3">
                <h2 className="text-white font-medium">Classification & Difficulty</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tutorial Type</label>
                  <select
                    name="tutorialType"
                    value={formData.tutorialType}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded p-2"
                  >
                    <option value="">-- Select Type --</option>
                    <option>Vegetables Gardening</option>
                    <option>Fruits Gardening</option>
                    <option>Flower Gardening</option>
                    <option>Medicinal Plants Gardening</option>
                    <option>Organic Pest Control</option>
                    <option>Soil Preparation & Composting</option>
                    <option>Container & Urban Gardening</option>
                    <option>Seasonal Garden Maintenance</option>
                    <option>Cross-Pollinated Plants Gardening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categories (comma‑separated)
                  </label>
                  <input
                    name="categories"
                    value={formData.categories}
                    onChange={handleChange}
                    placeholder="e.g. Seed‑starting, Composting"
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded p-2"
                  >
                    <option value="">-- Select Difficulty --</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimated Duration</label>
                  <input
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleChange}
                    placeholder="e.g. 30 min, 2 hr"
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
              </div>
            </section>

            {/* Media */}
            <section>
              <div className="bg-green-600 px-6 py-3">
                <h2 className="text-white font-medium">Media</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Cover Image */}
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                  {previewImage && (
                    <div className="mb-4">
                      <img 
                        src={previewImage} 
                        alt="Tutorial cover" 
                        className="h-40 mx-auto object-contain"
                      />
                    </div>
                  )}
                  <label className="flex flex-col items-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <svg 
                      className="h-8 w-8 text-gray-400" 
                      fill="none" 
                      stroke="currentColor"
                      viewBox="0 0 24 24" 
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="mt-2 text-gray-600">
                      {previewImage ? 'Change cover image' : 'Upload cover image'}
                    </span>
                  </label>
                </div>
                {/* Additional Media */}
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                  <label className="flex flex-col items-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaChange}
                      className="hidden"
                    />
                    <svg 
                      className="h-8 w-8 text-gray-400" 
                      fill="none" 
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="mt-2 text-gray-600">Upload additional media</span>
                    {formData.mediaFiles.length > 0 && (
                      <span className="text-sm text-green-600 mt-1">
                        {formData.mediaFiles.length} files selected
                      </span>
                    )}
                  </label>
                </div>
              </div>
            </section>

            {/* Tutorial Outline */}
            <section>
              <div className="bg-green-600 px-6 py-3">
                <h2 className="text-white font-medium">Tutorial Outline</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <input
                    type="number"
                    placeholder="Step #"
                    value={newStep.stepNumber}
                    onChange={e => setNewStep(s => ({ ...s, stepNumber: e.target.value }))}
                    className="border rounded p-2"
                  />
                  <input
                    placeholder="Title"
                    value={newStep.title}
                    onChange={e => setNewStep(s => ({ ...s, title: e.target.value }))}
                    className="border rounded p-2 sm:col-span-2"
                  />
                  <input
                    placeholder="Content"
                    value={newStep.content}
                    onChange={e => setNewStep(s => ({ ...s, content: e.target.value }))}
                    className="border rounded p-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={addStep}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Add Step
                </button>

                {formData.outline.length > 0 && (
                  <ul className="list-decimal pl-6 space-y-2">
                    {formData.outline.map((s, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>
                          <strong>Step {s.stepNumber}:</strong> {s.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeStep(i)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Learning Outcomes */}
            <section>
              <div className="bg-green-600 px-6 py-3">
                <h2 className="text-white font-medium">Learning Outcomes</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <input
                    placeholder="What will learners achieve?"
                    value={newOutcome}
                    onChange={e => setNewOutcome(e.target.value)}
                    className="flex-grow border rounded p-2"
                  />
                  <button
                    type="button"
                    onClick={addOutcome}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Add
                  </button>
                </div>
                {formData.learningOutcomes.length > 0 && (
                  <ul className="list-disc pl-6 space-y-2">
                    {formData.learningOutcomes.map((o, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>{o}</span>
                        <button
                          type="button"
                          onClick={() => removeOutcome(i)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Skills Gained */}
            <section>
              <div className="bg-green-600 px-6 py-3">
                <h2 className="text-white font-medium">Skills Gained</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <input
                    placeholder="What skills will learners gain?"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    className="flex-grow border rounded p-2"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Add
                  </button>
                </div>
                {formData.skillsGained.length > 0 && (
                  <ul className="list-disc pl-6 space-y-2">
                    {formData.skillsGained.map((s, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(i)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Details To Know */}
            <section>
              <div className="bg-green-600 px-6 py-3">
                <h2 className="text-white font-medium">Details To Know</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    placeholder="Label (e.g. Hardiness Zone)"
                    value={newDetail.label}
                    onChange={e => setNewDetail(d => ({ ...d, label: e.target.value }))}
                    className="border rounded p-2"
                  />
                  <input
                    placeholder="Value (e.g. 3–10)"
                    value={newDetail.value}
                    onChange={e => setNewDetail(d => ({ ...d, value: e.target.value }))}
                    className="border rounded p-2"
                  />
                  <button
                    type="button"
                    onClick={addDetail}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Add Detail
                  </button>
                </div>
                {formData.detailsToKnow.length > 0 && (
                  <ul className="list-disc pl-6 space-y-2">
                    {formData.detailsToKnow.map((d, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span><strong>{d.label}:</strong> {d.value}</span>
                        <button
                          type="button"
                          onClick={() => removeDetail(i)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Actions */}
            <div className="p-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/thome')}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Tutorial'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}