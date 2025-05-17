// old ExploreTutorial.jsx

import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Check, Clock, ArrowLeft, Download, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Nav from '../MainComponents/Nav';

export default function ExploreTutorial() {
  const [tutorials, setTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(50); // Mock progress for demo
  const [completedSteps, setCompletedSteps] = useState([1, 2, 3]); // Mock completed steps
  const [pdfLoading, setPdfLoading] = useState(false);
  
  // Animation states
  const [animate, setAnimate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
    
    // Trigger animations after component mounts
    setTimeout(() => setAnimate(true), 300);
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
      console.log('Fetched tutorial data:', response.data);
      setCurrentTutorial(response.data);
      
      // Mock loading user progress data here
      // In a real app, you would fetch the user's progress for this tutorial
      const mockProgress = Math.floor(Math.random() * 100);
      setProgress(mockProgress);
      
      // Set random completed steps for demo
      if (response.data.outline && response.data.outline.length > 0) {
        const totalSteps = response.data.outline.length;
        const completedCount = Math.floor((mockProgress / 100) * totalSteps);
        const newCompletedSteps = Array.from({length: completedCount}, (_, i) => i + 1);
        setCompletedSteps(newCompletedSteps);
      }
      
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

  // Mark a step as complete
  const markStepComplete = (stepNumber) => {
    if (!completedSteps.includes(stepNumber)) {
      const newCompletedSteps = [...completedSteps, stepNumber];
      setCompletedSteps(newCompletedSteps);
      
      // Update progress percentage
      if (currentTutorial && currentTutorial.outline) {
        const newProgress = Math.round((newCompletedSteps.length / currentTutorial.outline.length) * 100);
        setProgress(newProgress);
        
        // Show notification
        showNotification('Progress updated!', 'success');
        
        // In a real app, you would save this progress to the backend
        // saveUserProgress(currentTutorial.id, newCompletedSteps, newProgress);
      }
    }
  };

  // Custom NavBar component with home link
  const CustomNavBar = () => (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <svg className="h-7 w-7 mr-2 text-green-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
            </svg>
            <span className="font-bold text-xl text-green-100 group-hover:text-white transition-colors">GrowSphere</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/thome" className="flex items-center group">
            <svg className="h-5 w-5 mr-1 text-green-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-green-100 group-hover:text-white transition-colors">Tutorials</span>
          </Link>
          <Link to="/challenge-home#community" className="flex items-center group">
            <svg className="h-5 w-5 mr-1 text-green-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-green-100 group-hover:text-white transition-colors">Community</span>
          </Link>
<Link to="/challenge-home" className="flex items-center group">
            <svg className="h-5 w-5 mr-1 text-green-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-100 group-hover:text-white transition-colors">Challenges</span>
          </Link>
          <Link to="/about" className="flex items-center group">
            <svg className="h-5 w-5 mr-1 text-green-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-100 group-hover:text-white transition-colors">About</span>
          </Link>
          <Link to="/contact" className="flex items-center group">
            <svg className="h-5 w-5 mr-1 text-green-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-green-100 group-hover:text-white transition-colors">Contact</span>
          </Link>
          <div className="border-l border-green-700 h-6"></div>
          <Link to="/login" className="text-green-100 hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="bg-white text-green-800 px-4 py-2 rounded-md hover:bg-green-100 transition-colors shadow-sm hover:shadow">Sign Up</Link>
        </div>
      </div>
    </nav>
  );

  // PDF generation function - tailored for Tailwind CSS compatibility
  const generatePDF = async () => {
    try {
      setPdfLoading(true);
      console.log('Starting PDF generation');
      
      // Get the certificate element
      const element = document.getElementById('certificate-content');
      if (!element) {
        console.error('Certificate element not found');
        throw new Error('Certificate content not found');
      }
      
      // Create a clone of the element to manipulate without affecting the display
      const clonedElement = element.cloneNode(true);
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(clonedElement);
      document.body.appendChild(tempDiv);
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      
      // Convert all Tailwind classes with oklch colors to inline styles
      // This extracts computed styles from the original element and applies them to the clone
      const processElement = (originalEl, clonedEl) => {
        clonedEl.style.cssText = '';  
        const style = window.getComputedStyle(originalEl);
        
        // Apply important styles directly
        clonedEl.style.color = style.color;
        clonedEl.style.backgroundColor = style.backgroundColor;
        clonedEl.style.borderColor = style.borderColor;
        clonedEl.style.borderWidth = style.borderWidth;
        clonedEl.style.borderStyle = style.borderStyle;
        clonedEl.style.borderRadius = style.borderRadius;
        clonedEl.style.padding = style.padding;
        clonedEl.style.margin = style.margin;
        clonedEl.style.fontFamily = style.fontFamily;
        clonedEl.style.fontSize = style.fontSize;
        clonedEl.style.fontWeight = style.fontWeight;
        clonedEl.style.lineHeight = style.lineHeight;
        clonedEl.style.textAlign = style.textAlign;
        
        // Process children recursively
        Array.from(originalEl.children).forEach((child, index) => {
          if (clonedEl.children[index]) {
            processElement(child, clonedEl.children[index]);
          }
        });
      };
      
      // Process the entire certificate element tree
      processElement(element, clonedElement);
      
      // Use html2canvas on the cloned and styled element
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        onclone: (document, clonedDoc) => {
          // Additional processing if needed after cloning
          console.log('Document cloned for PDF generation');
        }
      });
      
      // Clean up the temporary element
      document.body.removeChild(tempDiv);
      
      // Convert to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 277; // A4 width in mm (landscape)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${currentTutorial?.title || 'GrowSphere'}_Certificate.pdf`);
      
      console.log('PDF generated successfully');
      showNotification('Certificate downloaded successfully!', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      showNotification(`Failed to generate PDF: ${error.message}`, 'error');
    } finally {
      setPdfLoading(false);
    }
  };

  // filter by title or description for the list view
  const filtered = tutorials.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tutorial card for list view - enhanced with animations and better visuals
  const TutorialCard = ({ tutorial }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {tutorial.difficulty && (
          <span className={
            'absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded z-10 ' +
            (tutorial.difficulty === 'Beginner'
              ? 'bg-green-100 text-green-800'
              : tutorial.difficulty === 'Intermediate'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800')
          }>
            {tutorial.difficulty}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 text-white">
            <h4 className="font-medium">View Details</h4>
          </div>
        </div>

	<img
          src={`http://localhost:8080/api/v1/tutorial/viewtutorial/image/${tutorial.tutorialImage}`}
          alt={tutorial.title}
          className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-500"
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
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tutorial.categories?.map((cat, idx) => (
            <span key={idx} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
              {cat}
            </span>
          ))}
        </div>
        
        <Link
          to={`/explore-tutorial/${tutorial.id}`}
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow"
        >
          Start Learning
        </Link>
      </div>
    </div>
  );

  // Section wrapper for list view
  const Section = ({ title, items }) =>
    items.length > 0 && (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(tutorial => <TutorialCard key={tutorial.id} tutorial={tutorial} />)}
        </div>
      </section>
    );

  // Certificate view component with enhanced design
  const CertificateView = () => {
    const [userName, setUserName] = useState("Alex Green");
    const [dateCompleted, setDateCompleted] = useState("05/14/2025");
    
    useEffect(() => {
      // Show confetti animation after component mounts
      setTimeout(() => setShowConfetti(true), 500);
    }, []);
    
    return (
      
      
      <div className="p-6 bg-gradient-to-b from-green-50 to-white min-h-screen">
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link to={`/explore-tutorial/${id}`} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 group-hover:bg-blue-200 transition-colors">
                <ArrowLeft className="w-4 h-4 text-blue-600" />
              </div>
              <span>Back to Tutorial</span>
            </Link>
            <div className="flex gap-3">
              <button 
                className={`flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-1 ${pdfLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={generatePDF}
                disabled={pdfLoading}
              >
                {pdfLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Certificate
                  </>
                )}
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-300 px-5 py-2 rounded-full hover:bg-gray-50 transition shadow-sm hover:shadow transform hover:-translate-y-1">
                <Share2 className="w-4 h-4 text-gray-600" />
                Share
              </button>
            </div>
          </div>
         

          {/* Certificate Display with subtle animation */}
          <div className="relative mb-8">
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-20px`,
                      fontSize: `${Math.random() * 10 + 10}px`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${Math.random() * 3 + 3}s`,
                    }}
                  >
                    {['🎉', '🌱', '🌿', '🌷', '🍀'][Math.floor(Math.random() * 5)]}
                  </div>
                ))}
              </div>
            )}
            
            <div id="certificate-content" className="border rounded-xl p-8 bg-white shadow-lg transform transition-all duration-700 hover:scale-[1.01]">
              <div className="border-4 border-green-100 p-8 rounded-lg bg-gradient-to-br from-white to-green-50">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center p-3">
                      <BookOpen className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-green-800 mb-1">GrowSphere</h1>
                  <div className="text-xl text-gray-600 font-serif">Certificate of Completion</div>
                  <div className="text-sm text-gray-500 mt-1 italic">This certifies that</div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-4xl font-bold text-green-700 font-serif">{userName}</h2>
                  <div className="text-sm text-gray-500 mt-1 italic">has successfully completed</div>
                </div>

<div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentTutorial?.title}</h3>
                  
                  <div className="flex justify-center gap-3 mt-3 flex-wrap">
                    {currentTutorial?.categories?.map((cat, idx) => (
                      <span key={idx} className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-5 max-w-md mx-auto font-serif">
                    Learn to grow plants successfully with proper sunlight, soil, watering, and pest control.
                  </p>
                </div>

                <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="font-semibold text-gray-800">Jane Gardener</div>
                    <div className="text-sm text-gray-500">Instructor</div>
                  </div>
                  <div className="h-16 w-16 mx-4 relative">
                    <div className="absolute inset-0 border-4 border-green-200 rounded-full opacity-30"></div>
                    <div className="absolute inset-3 border-2 border-green-300 rounded-full opacity-60"></div>
                    <div className="absolute inset-5 border-1 border-green-400 rounded-full opacity-90"></div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800">{dateCompleted}</div>
                    <div className="text-sm text-gray-500">Date Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border rounded-lg p-6 bg-white shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Customize Certificate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Completed</label>
                <input 
                  type="date" 
                  value={dateCompleted}
                  onChange={(e) => setDateCompleted(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Progress tracking view with plant animations and improved design
  const ProgressView = () => {
    useEffect(() => {
      // Trigger animation after component mounts
      setTimeout(() => setAnimate(true), 300);
    }, []);
    
    return (
      <div className="p-6 bg-gradient-to-b from-green-50 to-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Link to={`/explore-tutorial/${id}`} className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 group-hover:bg-blue-200 transition-colors">
              <ArrowLeft className="w-4 h-4 text-blue-600" />
            </div>
            <span>Back to Tutorial</span>
          </Link>
          
          <div className="bg-white rounded-xl border border-green-100 shadow-lg overflow-hidden">
            {/* Header with plant-themed background */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.25 16.5V14.5H11.75C10.79 14.5 10 13.71 10 12.75V9H12V7H10V5H8V7H6V9H8V12.75C8 14.82 9.68 16.5 11.75 16.5H12.25ZM16 9V7C16 5.9 16.9 5 18 5V7C18 8.1 17.1 9 16 9ZM13 9V7C13 5.9 13.9 5 15 5V7C15 8.1 14.1 9 13 9Z" fill="currentColor" />
                </svg>
              </div>
              
              <div className="flex items-center mb-3">
                <div>
                  <span className="inline-block px-2 py-1 text-xs bg-white text-green-800 rounded font-semibold">
                    {currentTutorial?.difficulty || 'Beginner'}
                  </span>
                </div>
		<div className="ml-auto">
                  <img 
                    src={`http://localhost:8080/api/v1/tutorial/viewtutorial/image/${currentTutorial?.tutorialImage}`}
                    alt={currentTutorial?.title}
                    className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-md"
                    onError={e => { e.currentTarget.src = '/placeholder.png'; }}
                  />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-1">{currentTutorial?.title || 'Loading tutorial...'}</h1>
              <p className="text-green-100 text-sm">
                {currentTutorial?.description?.substring(0, 120)}...
              </p>
            </div>
            
            <div className="p-6">
              {/* Progress visualization with growing plant animation */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 font-medium">Your Growth Progress</span>
                  <span className="text-sm font-semibold text-green-600">{progress}%</span>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-400 h-4 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: animate ? `${progress}%` : '0%' }}
                    ></div>
                  </div>
                  
                  {/* Plant growing based on progress */}
                  <div className="absolute -top-5 transition-all duration-1000" 
                       style={{ left: `${animate ? progress - 5 : 0}%` }}>
                    {progress < 30 ? (
                      <span className="text-xl" role="img" aria-label="seedling">🌱</span>
                    ) : progress < 60 ? (
                      <span className="text-xl" role="img" aria-label="growing plant">🌿</span>
                    ) : progress < 100 ? (
                      <span className="text-xl" role="img" aria-label="growing plant">🪴</span>
                    ) : (
                      <span className="text-xl" role="img" aria-label="full plant">🌳</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="bg-green-50 rounded-lg p-4 transform transition-transform duration-500 hover:scale-105">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="font-semibold text-lg">{currentTutorial?.outline?.length || 0}</div>
                  <div className="text-xs text-gray-500">Lessons</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 transform transition-transform duration-500 hover:scale-105">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="font-semibold text-lg">{currentTutorial?.estimatedDuration || "1 hr"}</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 transform transition-transform duration-500 hover:scale-105">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {progress < 100 ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ) : (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="font-semibold text-lg">{progress < 100 ? 'In Progress' : 'Completed'}</div>
                  <div className="text-xs text-gray-500">Status</div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lesson Progress
              </h2>
              
              <div className="space-y-3">
                {currentTutorial?.outline?.map((step, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg flex items-center justify-between p-4 transition-all duration-500 ${
                      completedSteps.includes(step.stepNumber || index + 1)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white hover:border-green-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {completedSteps.includes(step.stepNumber || index + 1) ? (
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-4 shadow-sm">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4">
                          <span className="text-sm font-medium text-gray-600">{step.stepNumber || index + 1}</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{step.title}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          25 min
                        </div>
                      </div>
                    </div>
                    
                    {completedSteps.includes(step.stepNumber || index + 1) ? (
                      <span className="text-xs text-green-600 font-medium px-3 py-1.5 bg-green-100 rounded-full flex items-center">
                        <Check className="w-3 h-3 mr-1" />
                        Completed
                      </span>
                    ) : (
                      <button 
                        onClick={() => markStepComplete(step.stepNumber || index + 1)}
                        className="text-sm bg-white border border-green-500 text-green-600 px-4 py-1.5 rounded-full hover:bg-green-50 transition-colors flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                        Start Lesson
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {progress >= 100 && (
                <div className="mt-8 text-center">
                  <div className="inline-block animate-bounce mb-4">
                    <span className="text-4xl" role="img" aria-label="celebration">🎉</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-3">Congratulations! You've completed this tutorial.</h3>
                  <p className="text-gray-600 mb-5">Claim your certificate and share your achievement!</p>
                  <button 
                    onClick={() => navigate(`/explore-tutorial/${id}/certificate`)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center mx-auto"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    View Your Certificate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

// Render tutorial detail view
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
          <Link to="/explore-tutorials" className="px-4 py-2 bg-green-600 text-white rounded">
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
            <Link to="/explore-tutorials" className="flex items-center text-blue-600 mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tutorials
            </Link>
            <h2 className="font-semibold text-lg line-clamp-2">{currentTutorial.title}</h2>
          </div>

          <div className="p-4">
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600">Your Progress</span>
                <span className="text-xs font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-600 h-1.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <h3 className="font-medium text-sm text-gray-500 uppercase mb-2">Tutorial Outline</h3>
            {currentTutorial.outline?.length > 0 ? (
              <div className="space-y-2">
                {currentTutorial.outline.map((step, index) => (
                  <div 
                    key={index} 
                    className="flex items-start p-2 hover:bg-gray-200 rounded cursor-pointer"
                    onClick={() => markStepComplete(step.stepNumber || index + 1)}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mr-2 ${
                      completedSteps.includes(step.stepNumber || index + 1) 
                        ? 'bg-green-500 text-white' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {completedSteps.includes(step.stepNumber || index + 1) ? <Check className="w-4 h-4" /> : (step.stepNumber || index + 1)}
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
            
            {/* Action buttons */}
            <div className="mt-6 space-y-2">
              <Link 
                to={`/explore-tutorial/${id}/progress`}
                className="block w-full py-2 px-4 bg-green-100 text-green-700 rounded text-center text-sm font-medium hover:bg-green-200 transition-colors"
              >
                View Progress
              </Link>
              
              {progress >= 100 && (
                <Link 
                  to={`/explore-tutorial/${id}/certificate`}
                  className="block w-full py-2 px-4 bg-green-600 text-white rounded text-center text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Get Certificate
                </Link>
              )}
            </div>
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
                      <div 
                        key={index} 
                        className="border-b pb-6"
                      >
                        <div className="flex items-start mb-3">
                          <div 
                           className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-3 ${
                            completedSteps.includes(step.stepNumber || index + 1)
                              ? 'bg-green-500 text-white'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {completedSteps.includes(step.stepNumber || index + 1) 
                            ? <Check className="w-5 h-5" /> 
                            : (step.stepNumber || index + 1)}
                        </div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <div className="ml-11">
                        <p className="text-gray-700">{step.content}</p>
                        
                        {!completedSteps.includes(step.stepNumber || index + 1) && (
                          <button
                            onClick={() => markStepComplete(step.stepNumber || index + 1)}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                          >
                            Mark as Complete
                          </button>
                        )}
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
                        className="border rounded overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
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
                  className="w-full mt-4 border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition" 
                  rows="6"
                  placeholder="Start taking notes here..."
                ></textarea>
                <div className="mt-3 flex justify-end">
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    Save Notes
                  </button>
                </div>
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
      <h1 className="text-3xl font-bold mb-2">Learn & Grow Your Gardening Skills</h1>
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
        items={filtered.slice(0, 4)}
      />
      <Section
        title="Most Popular Tutorials"
        items={filtered.slice(4, 8)}
      />
      <Section
        title="Beginner Friendly"
        items={filtered.filter(t => t.difficulty === 'Beginner').slice(0, 4)}
      />
    </div>
  );
};

return (
  <div className="min-h-screen bg-gray-50">
    {/* Use  navbar everywhere instead of the imported Nav */}
    <Nav />
    
    {/* Determine which view to render */}
       {id ? (
      window.location.pathname.includes('/certificate') ? (
        <CertificateView />
      ) : window.location.pathname.includes('/progress') ? (
        <ProgressView />
      ) : (
        renderTutorialDetail()
      )
    ) : (
      renderTutorialsList()
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
    
    {/* Custom CSS for animations - add this to your global CSS or in a style tag */}
    <style jsx>{`
      @keyframes confetti {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(500px) rotate(360deg); }
      }
      .animate-confetti {
        animation: confetti 5s ease-in-out forwards;
      }
    `}</style>
  </div>
);
}