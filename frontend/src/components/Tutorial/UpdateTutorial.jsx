// old update

// src/components/Tutorial/UpdateTutorial.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Nav from '../MainComponents/Nav';

export default function UpdateTutorial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
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

  const [newStep, setNewStep] = useState({ stepNumber: '', title: '', content: '' });
  const [newOutcome, setNewOutcome] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newDetail, setNewDetail] = useState({ label: '', value: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const { data } = await axiosClient.get(`/tutorial/viewtutorial/${id}`);
        setFormData({
          ...data,
          categories: data.categories ? data.categories.join(', ') : '',
          tutorialImage: null,
          mediaFiles: []
        });
        if (data.tutorialImage) {
          setPreviewImage(
            `http://localhost:8080/api/v1/tutorial/viewtutorial/image/${data.tutorialImage}`
          );
        }
      } catch (err) {
        console.error(err);
        showNotification('Failed to load tutorial data. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTutorial();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = e => {
    if (e.target.files?.[0]) {
      setFormData(f => ({ ...f, tutorialImage: e.target.files[0] }));
      const reader = new FileReader();
      reader.onload = ev => setPreviewImage(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleMediaChange = e =>
    setFormData(f => ({ ...f, mediaFiles: Array.from(e.target.files) }));

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
      ].sort((a, b) => a.stepNumber - b.stepNumber)
    }));
    setNewStep({ stepNumber: '', title: '', content: '' });
  };
  const removeStep = i =>
    setFormData(f => ({ ...f, outline: f.outline.filter((_, idx) => idx !== i) }));

  const addOutcome = e => {
    e.preventDefault();
    if (!newOutcome.trim()) return;
    setFormData(f => ({
      ...f,
      learningOutcomes: [...f.learningOutcomes, newOutcome.trim()]
    }));
    setNewOutcome('');
  };
  const removeOutcome = i =>
    setFormData(f => ({
      ...f,
      learningOutcomes: f.learningOutcomes.filter((_, idx) => idx !== i)
    }));

  const addSkill = e => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setFormData(f => ({ ...f, skillsGained: [...f.skillsGained, newSkill.trim()] }));
    setNewSkill('');
  };
  const removeSkill = i =>
    setFormData(f => ({
      ...f,
      skillsGained: f.skillsGained.filter((_, idx) => idx !== i)
    }));

  const addDetail = e => {
    e.preventDefault();
    if (!newDetail.label.trim() || !newDetail.value.trim()) return;
    setFormData(f => ({
      ...f,
      detailsToKnow: [...f.detailsToKnow, { ...newDetail }]
    }));
    setNewDetail({ label: '', value: '' });
  };
  const removeDetail = i =>
    setFormData(f => ({
      ...f,
      detailsToKnow: f.detailsToKnow.filter((_, idx) => idx !== i)
    }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      const details = {
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
        outline: formData.outline,
        learningOutcomes: formData.learningOutcomes,
        skillsGained: formData.skillsGained,
        detailsToKnow: formData.detailsToKnow
      };
      payload.append('tutorialDetails', JSON.stringify(details));
      if (formData.tutorialImage) payload.append('file', formData.tutorialImage);
      formData.mediaFiles.forEach(f => payload.append('mediaFiles', f));

      await axiosClient.put(`/tutorial/updatetutorial/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showNotification('Tutorial updated successfully!', 'success');
      setTimeout(() => navigate(`/tutorial/${id}`), 1500);
    } catch (err) {
      console.error(err);
      showNotification('Failed to update tutorial. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto" />
          <p className="mt-4 text-gray-700">Loading tutorial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* shared navigation */}
      <Nav />

      <div className="p-6">
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Update Tutorial</h1>
          <p className="text-gray-600 mt-2">
            Make changes to your gardening tutorial
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
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
                  <label className="block text-sm font-medium text-gray-700">Categories (comma-separated)</label>
                  <input
                    name="categories"
                    value={formData.categories}
                    onChange={handleChange}
                    placeholder="e.g. Seed-starting, Composting"
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
                        {formData.mediaFiles.length} new files selected
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
                        <span>
                          <strong>{d.label}:</strong> {d.value}
                        </span>
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
                onClick={() => navigate('/alltutorial')}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Tutorial'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification Toast */}
      {notification.show && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg z-50 ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : notification.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}
