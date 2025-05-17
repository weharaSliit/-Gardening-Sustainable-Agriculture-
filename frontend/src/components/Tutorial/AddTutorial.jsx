// src/components/Tutorial/AddTutorial.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Nav from '../MainComponents/Nav';

export default function AddTutorial() {
  const navigate = useNavigate();

  // form state
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

  // temp states for compound fields
  const [newStep, setNewStep] = useState({ stepNumber: '', title: '', content: '' });
  const [newOutcome, setNewOutcome] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newDetail, setNewDetail] = useState({ label: '', value: '' });

  // UI state
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  // handlers
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

  const handleMediaFilesChange = e => {
    if (e.target.files) {
      setFormData(f => ({ ...f, mediaFiles: Array.from(e.target.files) }));
    }
  };

  // compound add/remove handlers
  const addStep = e => {
    e.preventDefault();
    if (!newStep.title) return;
    setFormData(f => ({
      ...f,
      outline: [
        ...f.outline,
        {
          stepNumber: parseInt(newStep.stepNumber, 10) || f.outline.length + 1,
          title: newStep.title,
          content: newStep.content
        }
      ]
    }));
    setNewStep({ stepNumber: '', title: '', content: '' });
  };
  const removeStep = i => {
    setFormData(f => ({
      ...f,
      outline: f.outline.filter((_, idx) => idx !== i)
    }));
  };

  const addOutcome = e => {
    e.preventDefault();
    if (!newOutcome) return;
    setFormData(f => ({
      ...f,
      learningOutcomes: [...f.learningOutcomes, newOutcome]
    }));
    setNewOutcome('');
  };
  const removeOutcome = i => {
    setFormData(f => ({
      ...f,
      learningOutcomes: f.learningOutcomes.filter((_, idx) => idx !== i)
    }));
  };

  const addSkill = e => {
    e.preventDefault();
    if (!newSkill) return;
    setFormData(f => ({
      ...f,
      skillsGained: [...f.skillsGained, newSkill]
    }));
    setNewSkill('');
  };
  const removeSkill = i => {
    setFormData(f => ({
      ...f,
      skillsGained: f.skillsGained.filter((_, idx) => idx !== i)
    }));
  };

  const addDetail = e => {
    e.preventDefault();
    if (!newDetail.label || !newDetail.value) return;
    setFormData(f => ({
      ...f,
      detailsToKnow: [...f.detailsToKnow, { ...newDetail }]
    }));
    setNewDetail({ label: '', value: '' });
  };
  const removeDetail = i => {
    setFormData(f => ({
      ...f,
      detailsToKnow: f.detailsToKnow.filter((_, idx) => idx !== i)
    }));
  };

  // validation + submit
  const handleSubmit = async e => {
    e.preventDefault();
    const v = {};

    if (!/^TUT-\d{3,}$/.test(formData.tutorialId.trim())) {
      v.tutorialId = 'Tutorial ID must follow TUT-###';
    }
    if (!formData.title.trim()) {
      v.title = 'Title is required';
    } else if (/^\d+$/.test(formData.title.trim())) {
      v.title = 'Title cannot be only numbers';
    }
    if (!formData.description.trim()) {
      v.description = 'Description is required';
    }
    ['tutorialType', 'categories', 'difficulty', 'estimatedDuration'].forEach(key => {
      if (!formData[key].trim()) {
        v[key] = 'This field is required';
      }
    });
    if (formData.outline.length === 0) v.outline = 'Add at least one step';
    if (formData.learningOutcomes.length === 0) v.learningOutcomes = 'Add an outcome';
    if (formData.skillsGained.length === 0) v.skillsGained = 'Add a skill';
    if (formData.detailsToKnow.length === 0) v.detailsToKnow = 'Add a detail';

    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      // upload cover image
      let imgName = '';
      if (formData.tutorialImage) {
        const data = new FormData();
        data.append('file', formData.tutorialImage);
        imgName = await axiosClient
          .post('/tutorial/image', data, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then(res => res.data);
      }

      // payload
      const payload = {
        ...formData,
        categories: formData.categories
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        tutorialImage: imgName
      };

      const created = await axiosClient.post('/tutorial', payload).then(res => res.data);

      // optional media files
      if (formData.mediaFiles.length) {
        const mForm = new FormData();
        formData.mediaFiles.forEach(f => mForm.append('files', f));
        await axiosClient.post(`/tutorial/${created.id}/media`, mForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/thome');
    } catch (err) {
      console.error(err);
      setError('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tailwind classes
  const inputClass =
    'w-full border border-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition';
  const btnClass =
    'h-10 px-4 py-2 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 text-white rounded-lg text-sm transition';

  return (
    <div className="min-h-screen bg-green-50">
      <Nav />
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-semibold text-green-800 mb-6 text-center">
          🌱🌿🌷🍀Create a Gardening Tutorial🌱🌿🌷🍀

        </h1>

        
        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-6 space-y-6">

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-green-700">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tutorial ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="tutorialId"
                  value={formData.tutorialId}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.tutorialId ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.title ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.description ? 'border-red-500' : ''}`}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Classification & Difficulty */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-green-700">Classification & Difficulty</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tutorial Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="tutorialType"
                  value={formData.tutorialType}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.tutorialType ? 'border-red-500' : ''}`}
                >
                  <option value="">-- Select --</option>
                  <option>Vegetable Gardening</option>
                  <option>Fruits Gardening</option>
                  <option>Flower Gardening</option>
                  <option>Organic Pest Control</option>
                  <option>Medicinal Plants Gardening</option>
                  <option>Soil Preparation & Composting</option>
                  <option>SContainer & Urban Gardening</option>
                  <option>Seasonal Garden Maintence</option>
                  <option>Cross-Pollinated Plants Gardening</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categories <span className="text-red-500">*</span>
                </label>
                <input
                  name="categories"
                  placeholder="e.g. Seed-starting, Composting"
                  value={formData.categories}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.categories ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.difficulty ? 'border-red-500' : ''}`}
                >
                  <option value="">-- Select --</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estimated Duration <span className="text-red-500">*</span>
                </label>
                <input
                  name="estimatedDuration"
                  placeholder="e.g. 30 min, 2 hr"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.estimatedDuration ? 'border-red-500' : ''}`}
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-green-700">Media</h2>
            <div className="space-y-4">
              {/* Cover Image */}
              <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                {previewImage && (
                  <img src={previewImage} alt="Cover preview" className="mx-auto h-40 object-contain mb-4" />
                )}
                <label className="cursor-pointer text-green-600 hover:underline">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  {previewImage ? 'Change cover image' : 'Upload cover image'}
                </label>
              </div>
              {/* Additional Media */}
              <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                <label className="cursor-pointer text-green-600 hover:underline">
                  <input type="file" accept="image/*,video/*" multiple onChange={handleMediaFilesChange} className="hidden" />
                  Upload additional media
                </label>
                {formData.mediaFiles.length > 0 && (
                  <p className="mt-2 text-green-700 text-sm">{formData.mediaFiles.length} file(s) selected</p>
                )}
              </div>
            </div>
          </div>

          {/* Tutorial Outline */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-green-700">Tutorial Outline <span className="text-red-500">*</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="number"
                placeholder="#"
                value={newStep.stepNumber}
                onChange={e => setNewStep(s => ({ ...s, stepNumber: e.target.value }))}
                className="border border-green-200 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                placeholder="Title"
                value={newStep.title}
                onChange={e => setNewStep(s => ({ ...s, title: e.target.value }))}
                className="sm:col-span-2 border border-green-200 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
              />
              <input
                placeholder="Content"
                value={newStep.content}
                onChange={e => setNewStep(s => ({ ...s, content: e.target.value }))}
                className="border border-green-200 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button type="button" onClick={addStep} className={btnClass}>
              Add Step
            </button>
            {formData.outline.length > 0 && (
              <ul className="list-decimal pl-6 space-y-1">
                {formData.outline.map((s, i) => (
                  <li key={i} className="flex justify-between items-center py-1">
                    <span>Step {s.stepNumber}: {s.title}</span>
                    <button type="button" onClick={() => removeStep(i)} className="text-red-600 hover:underline text-sm">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Outcomes, Skills & Details */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-green-700">Learning Outcomes <span className="text-red-500">*</span></h2>
              <div className="flex gap-2">
                <input
                  placeholder="What will learners achieve?"
                  value={newOutcome}
                  onChange={e => setNewOutcome(e.target.value)}
                  className={inputClass}
                />
                <button type="button" onClick={addOutcome} className={btnClass}>Add</button>
              </div>
              {formData.learningOutcomes.map((o, i) => (
                <div key={i} className="flex justify-between items-center border border-green-100 rounded-lg p-2">
                  <span>{o}</span>
                  <button onClick={() => removeOutcome(i)} className="text-red-600 hover:underline text-sm">Remove</button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-medium text-green-700">Skills Gained <span className="text-red-500">*</span></h2>
              <div className="flex gap-2">
                <input
                  placeholder="What skills will learners gain?"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  className={inputClass}
                />
                <button type="button" onClick={addSkill} className={btnClass}>Add</button>
              </div>
              {formData.skillsGained.map((s, i) => (
                <div key={i} className="flex justify-between items-center border border-green-100 rounded-lg p-2">
                  <span>{s}</span>
                  <button onClick={() => removeSkill(i)} className="text-red-600 hover:underline text-sm">Remove</button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-medium text-green-700">Details To Know <span className="text-red-500">*</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  placeholder="Label (e.g. Hardiness Zone)"
                  value={newDetail.label}
                  onChange={e => setNewDetail(d => ({ ...d, label: e.target.value }))}
                  className={inputClass}
                />
                <input
                  placeholder="Value (e.g. 3–10)"
                  value={newDetail.value}
                  onChange={e => setNewDetail(d => ({ ...d, value: e.target.value }))}
                  className={inputClass}
                />
                <button onClick={addDetail} className={btnClass}>Add</button>
              </div>
              {formData.detailsToKnow.map((d, i) => (
                <div key={i} className="flex justify-between items-center border border-green-100 rounded-lg p-2">
                  <span><strong>{d.label}:</strong> {d.value}</span>
                  <button onClick={() => removeDetail(i)} className="text-red-600 hover:underline text-sm">Remove</button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/thome')}
              className="h-10 px-4 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-100 transition"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={btnClass}>
              {isSubmitting ? 'Creating...' : 'Create Tutorial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
