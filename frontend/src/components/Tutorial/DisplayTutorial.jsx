import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function DisplayTutorial() {
  const [tutorials, setTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  
  // Image viewing states
  const [headerImageZoomed, setHeaderImageZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Fetch specific tutorial for detail view
      fetchTutorialDetail(id);
    } else {
      // Fetch all tutorials for list view
      fetchTutorials();
    }
  }, [id]);

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/tutorial/viewtutorial');
      setTutorials(response.data);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      showNotification('Failed to load tutorials. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTutorialDetail = async (tutorialId) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/tutorial/viewtutorial/${tutorialId}?t=${Date.now()}`);
    console.log('Fetched tutorial data:', response.data); // For debugging
      setCurrentTutorial(response.data);
    } catch (err) {
      console.error('Error fetching tutorial details:', err);
      showNotification('Failed to load tutorial details. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show notification message
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle tutorial deletion
  const confirmDelete = (tutorial) => {
    setTutorialToDelete(tutorial);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTutorialToDelete(null);
  };

  const deleteTutorial = async () => {
    if (!tutorialToDelete) return;
    
    try {
      await axiosClient.delete(`/tutorial/${tutorialToDelete.id}`);
      
      if (id) {
        // If we're on the detail page, navigate back to the list
        showNotification('Tutorial deleted successfully!', 'success');
        setTimeout(() => {
          navigate('/alltutorial');
        }, 1500);
      } else {
        // If we're on the list page, just update the list
        setTutorials(tutorials.filter(t => t.id !== tutorialToDelete.id));
        showNotification('Tutorial deleted successfully!', 'success');
      }
    } catch (err) {
      console.error('Error deleting tutorial:', err);
      showNotification('Failed to delete tutorial. Please try again.', 'error');
    } finally {
      setShowDeleteModal(false);
      setTutorialToDelete(null);
    }
  };

  // Image handling functions
  const toggleHeaderImageZoom = () => {
    setHeaderImageZoomed(!headerImageZoomed);
  };

  const openLightbox = (imageUrl) => {
    setCurrentImage(imageUrl);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage('');
  };

  // filter by title or description for the list view
  const filtered = tutorials.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // partition into three sections
  const featured = filtered.slice(0, 4);
  const recent = filtered.slice(4, 8);
  const popular = filtered.slice(8, 12);

  // Tutorial card for list view
  const TutorialCard = ({ tutorial }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        {tutorial.difficulty && (
          <span className={
            'absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ' +
            (tutorial.difficulty === 'Beginner'
              ? 'bg-green-100 text-green-800'
              : tutorial.difficulty === 'Intermediate'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800')
          }>
            {tutorial.difficulty}
          </span>
        )}
        <img
          src={`http://localhost:8080/api/v1/tutorial/viewtutorial/image/${tutorial.tutorialImage}`}
          alt={tutorial.title}
          className="w-full h-40 object-cover"
          onError={e => { e.currentTarget.src = '/placeholder.png'; }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-2">
          {tutorial.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {tutorial.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tutorial.categories?.map((cat, idx) => (
            <span key={idx} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
              {cat}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Link
            to={`/tutorial/${tutorial.id}`}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            View Tutorial →
          </Link>
          
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/updatetutorial/${tutorial.id}`)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Update
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                confirmDelete(tutorial);
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Section wrapper for list view
  const Section = ({ title, linkText, linkUrl, items }) =>
    items.length > 0 && (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {linkText && (
            <Link to={linkUrl} className="text-sm text-green-600 hover:underline">
              {linkText} →
            </Link>
          )}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(tutorial => <TutorialCard key={tutorial.id} tutorial={tutorial} />)}
        </div>
      </section>
    );

  // Render tutorial detail view (Coursera-style)
  const renderTutorialDetail = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      );
    }

    if (!currentTutorial) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-semibold mb-4">Tutorial Not Found</h2>
          <p className="text-gray-600 mb-6">The tutorial you're looking for doesn't exist or has been removed.</p>
          <Link to="/alltutorial" className="px-4 py-2 bg-green-600 text-white rounded">
            Return to Tutorials
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-white">
        {/* Sidebar */}
        <div className="lg:w-64 bg-gray-100 lg:h-screen lg:overflow-y-auto flex-shrink-0 border-r">
          <div className="p-4 border-b">
            <Link to="/alltutorial" className="flex items-center text-blue-600 mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tutorials
            </Link>
            <h2 className="font-semibold text-lg line-clamp-2">{currentTutorial.title}</h2>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-sm text-gray-500 uppercase mb-2">Tutorial Outline</h3>
            {currentTutorial.outline?.length > 0 ? (
              <div className="space-y-2">
                {currentTutorial.outline.map((step, index) => (
                  <div key={index} className="flex items-start p-2 hover:bg-gray-200 rounded cursor-pointer">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-semibold mr-2">
                      {step.stepNumber || index + 1}
                    </div>
                    <span className="text-sm">{step.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No outline available</p>
            )}
            
            {currentTutorial.skillsGained?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-2">Skills You'll Gain</h3>
                <div className="space-y-2">
                  {currentTutorial.skillsGained.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-grow">
          {/* Video/Header Area */}
          <div className="relative bg-black text-white">
            {currentTutorial.tutorialImage ? (
              <div className={`relative ${headerImageZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}>
                <img 
                  src={`http://localhost:8080/api/v1/tutorial/viewtutorial/image/${currentTutorial.tutorialImage}`}
                  alt={currentTutorial.title}
                  className={`w-full ${headerImageZoomed ? 'h-auto max-h-screen object-contain' : 'h-64 object-cover opacity-60'} transition-all duration-300`}
                  onClick={toggleHeaderImageZoom}
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                {headerImageZoomed && (
                  <button 
                    className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white"
                    onClick={toggleHeaderImageZoom}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-r from-green-600 to-blue-600"></div>
            )}
            
            <div className={`${headerImageZoomed ? 'hidden' : 'absolute'} inset-0 flex flex-col justify-end p-6`}>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentTutorial.categories?.map((cat, idx) => (
                  <span key={idx} className="text-xs bg-gray-700 bg-opacity-50 px-2 py-1 rounded text-white">
                    {cat}
                  </span>
                ))}
                <span className={
                  'text-xs font-semibold px-2 py-1 rounded ' +
                  (currentTutorial.difficulty === 'Beginner'
                    ? 'bg-green-100 text-green-800'
                    : currentTutorial.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800')
                }>
                  {currentTutorial.difficulty || 'Unknown'}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{currentTutorial.title}</h1>
              {currentTutorial.estimatedDuration && (
                <div className="mt-2 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {currentTutorial.estimatedDuration}
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b">
            <div className="flex">
              <button 
                onClick={() => setActiveTab('content')}
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              >
                Content
              </button>
              <button 
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              >
                Notes
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              >
                About
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'content' && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Tutorial Content</h2>
                
                {currentTutorial.outline?.length > 0 ? (
                  <div className="space-y-8">
                    {currentTutorial.outline.map((step, index) => (
                      <div key={index} className="border-b pb-6">
                        <div className="flex items-start mb-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold mr-3">
                            {step.stepNumber || index + 1}
                          </div>
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                        </div>
                        <div className="ml-11">
                          <p className="text-gray-700">{step.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No content available for this tutorial.</p>
                )}
                
                {currentTutorial.mediaUrls?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Additional Media</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentTutorial.mediaUrls.map((media, index) => (
                        <div 
                          key={index} 
                          className="border rounded overflow-hidden cursor-pointer"
                          onClick={() => openLightbox(`http://localhost:8080/api/v1/tutorial/viewtutorial/media/${media}`)}
                        >
                          <img
                            src={`http://localhost:8080/api/v1/tutorial/viewtutorial/media/${media}`}
                            alt={`Media ${index + 1}`}
                            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                            onError={e => { e.currentTarget.src = '/placeholder.png'; }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'notes' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
                <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                  <p className="text-gray-600">You haven't taken any notes for this tutorial yet.</p>
                  <textarea 
                    className="w-full mt-4 border border-gray-300 rounded p-3" 
                    rows="6"
                    placeholder="Start taking notes here..."
                  ></textarea>
                </div>
              </div>
            )}
            
            {activeTab === 'about' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">About This Tutorial</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{currentTutorial.description}</p>
                </div>
                
                {currentTutorial.learningOutcomes?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-medium mb-2">Learning Outcomes</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {currentTutorial.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="text-gray-700">{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {currentTutorial.skillsGained?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-medium mb-2">Skills You'll Gain</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {currentTutorial.skillsGained.map((skill, index) => (
                        <li key={index} className="text-gray-700">{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {currentTutorial.detailsToKnow?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-medium mb-2">Details to Know</h3>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {currentTutorial.detailsToKnow.map((detail, index) => (
                          <div key={index} className="flex">
                            <dt className="font-medium text-gray-700 mr-2">{detail.label}:</dt>
                            <dd className="text-gray-600">{detail.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render the tutorials list view
  const renderTutorialsList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Sustainable Gardening Tutorials</h1>
        <p className="text-gray-600 mb-6">
          Explore our collection of gardening tutorials to help you grow sustainably.
        </p>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-md">
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1016.65 2a7.5 7.5 0 000 14.65z"
            />
          </svg>
        </div>

        {/* Sections */}
        <Section
          title="Featured Tutorials"
          linkText="Explore all tutorials"
          linkUrl="/alltutorial"
          items={featured}
        />
        <Section
          title="Recently Viewed"
          linkText="Show more"
          linkUrl="/alltutorial"
          items={recent}
        />
        <Section
          title="Most Popular Tutorials"
          linkText="Show more"
          linkUrl="/alltutorial"
          items={popular}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation Bar */}
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
      <Link to="/explore-tutorials" className="flex items-center">
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



      {/* Conditional Rendering: Detail View or List View */}
      {id ? renderTutorialDetail() : renderTutorialsList()}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the tutorial "{tutorialToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteTutorial}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <div className="max-w-4xl max-h-screen p-4">
            <img 
              src={currentImage} 
              alt="Full size media"
              className="max-h-screen max-w-full object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white"
              onClick={closeLightbox}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}






    </div>
  );
}