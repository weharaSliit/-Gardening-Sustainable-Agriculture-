import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function AddTutorial() {
  const navigate = useNavigate();

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
  const handleImageChange = e =>
    setFormData(f => ({ ...f, tutorialImage: e.target.files[0] }));
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

  const addOutcome = e => {
    e.preventDefault();
    if (!newOutcome.trim()) return;
    setFormData(f => ({
      ...f,
      learningOutcomes: [...f.learningOutcomes, newOutcome.trim()]
    }));
    setNewOutcome('');
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

  const addDetail = e => {
    e.preventDefault();
    if (!newDetail.label.trim() || !newDetail.value.trim()) return;
    setFormData(f => ({
      ...f,
      detailsToKnow: [...f.detailsToKnow, { ...newDetail }]
    }));
    setNewDetail({ label: '', value: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();

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

    const created = (await axiosClient.post('/tutorial', payload)).data;

    // 3) upload media files if any
    if (formData.mediaFiles.length) {
      const mediaForm = new FormData();
      formData.mediaFiles.forEach(f => mediaForm.append('files', f));
      await axiosClient.post(`/tutorial/${created.id}/media`, mediaForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    // 4) go back to the grid view on success
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Create a Gardening Tutorial</h1>
        <p className="text-gray-600 mt-2">
          Share your knowledge and help others learn sustainable gardening practices
        </p>
      </div>

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
                  <option>Vegetable Gardening</option>
                  <option>Flower Gardening</option>
                  <option>Organic Pest Control</option>
                  <option>Soil Preparation & Composting</option>
                  <option>Container & Urban Gardening</option>
                  <option>Seasonal Garden Maintenance</option>
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
                <label className="flex flex-col items-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <svg className="h-8 w-8 text-gray-400" fill="none" /*…*/ />
                  <span className="mt-2 text-gray-600">Upload cover image</span>
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
                  <svg className="h-8 w-8 text-gray-400" fill="none" /*…*/ />
                  <span className="mt-2 text-gray-600">Upload additional media</span>
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
                  name="stepNumber"
                  type="number"
                  placeholder="Step #"
                  value={newStep.stepNumber}
                  onChange={e => setNewStep(s => ({ ...s, stepNumber: e.target.value }))}
                  className="border rounded p-2"
                />
                <input
                  name="title"
                  placeholder="Title"
                  value={newStep.title}
                  onChange={e => setNewStep(s => ({ ...s, title: e.target.value }))}
                  className="border rounded p-2 col-span-2"
                />
                <input
                  name="content"
                  placeholder="Content"
                  value={newStep.content}
                  onChange={e => setNewStep(s => ({ ...s, content: e.target.value }))}
                  className="border rounded p-2"
                />
              </div>
              <button
                onClick={addStep}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add Step
              </button>

              {formData.outline.length > 0 && (
                <ul className="list-decimal pl-6">
                  {formData.outline.map((s, i) => (
                    <li key={i}>
                      <strong>Step {s.stepNumber}:</strong> {s.title}
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
            <div className="p-6 flex gap-4">
              <input
                placeholder="What will learners achieve?"
                value={newOutcome}
                onChange={e => setNewOutcome(e.target.value)}
                className="flex-grow border rounded p-2"
              />
              <button
                onClick={addOutcome}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add Outcome
              </button>
            </div>
            {formData.learningOutcomes.length > 0 && (
              <ul className="list-disc pl-6 pb-4">
                {formData.learningOutcomes.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Skills Gained */}
          <section>
            <div className="bg-green-600 px-6 py-3">
              <h2 className="text-white font-medium">Skills Gained</h2>
            </div>
            <div className="p-6 flex gap-4">
              <input
                placeholder="What skills will learners gain?"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                className="flex-grow border rounded p-2"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add Skill
              </button>
            </div>
            {formData.skillsGained.length > 0 && (
              <ul className="list-disc pl-6 pb-4">
                {formData.skillsGained.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Details To Know */}
          <section>
            <div className="bg-green-600 px-6 py-3">
              <h2 className="text-white font-medium">Details To Know</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                onClick={addDetail}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add Detail
              </button>
            </div>
            {formData.detailsToKnow.length > 0 && (
              <ul className="list-disc pl-6 pb-6">
                {formData.detailsToKnow.map((d, i) => (
                  <li key={i}><strong>{d.label}:</strong> {d.value}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Actions */}
          <div className="p-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border rounded text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Create Tutorial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
