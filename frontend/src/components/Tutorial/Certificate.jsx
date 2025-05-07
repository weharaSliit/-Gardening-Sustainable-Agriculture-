// src/components/Tutorial/Certificate.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Certificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [dateCompleted, setDateCompleted] = useState(new Date().toISOString().split('T')[0]);
  const certificateRef = useRef(null);
  
  // Fetch tutorial data
  useEffect(() => {
    const fetchTutorialDetail = async () => {
      try {
        setLoading(true);
        // In a real app, this would get the tutorial and user's progress
        const response = await axiosClient.get(`/tutorial/viewtutorial/${id}`);
        setTutorial(response.data);
        
        // Get current user info from auth context or local storage
        // For demo, we're using a mock user
        setUserName("Jane Gardener");
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tutorial details:', err);
        setLoading(false);
      }
    };
    
    fetchTutorialDetail();
  }, [id]);

  const handleDownloadPDF = () => {
    if (!certificateRef.current) return;
    
    html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
      logging: false
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 297;
      const imgHeight = 210;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${userName.replace(/\s/g, '_')}_${tutorial.title.replace(/\s/g, '_')}_Certificate.pdf`);
    });
  };

  const handleShare = () => {
    // This would implement social sharing
    alert("Sharing functionality would be implemented here. For now, please download the certificate and share it manually.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-red-600">Tutorial Not Found</h1>
          <p className="mt-4">The tutorial you're looking for doesn't exist or has been removed.</p>
          <Link to="/alltutorial" className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Back to All Tutorials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
              </svg>
              <span className="font-bold">GrowSphere</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/thome" className="text-sm">Home</Link>
            <Link to="/alltutorial" className="text-sm">Tutorials</Link>
          </div>
        </div>
      </nav>

      {/* Divider */}
      <div className="h-1 bg-blue-200 w-full"></div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Link to={`/tutorial/${id}`} className="flex items-center text-blue-600 hover:text-blue-800">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Tutorial</span>
          </Link>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleDownloadPDF} 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
            <button 
              onClick={handleShare} 
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">Certificate of Completion</h2>
          
          <div className="overflow-auto">
            {/* Certificate */}
            <div 
              ref={certificateRef}
              className="relative bg-blue-50 border-8 border-blue-200 rounded-lg p-8 mx-auto"
              style={{ width: '800px', height: '600px' }}
            >
              {/* Certificate Border */}
              <div className="absolute inset-0 border-4 border-blue-300 m-4 pointer-events-none"></div>
              
              {/* Certificate Content */}
              <div className="h-full flex flex-col items-center justify-between">
                {/* Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
                    </svg>
                    <h1 className="text-3xl font-bold text-blue-800 ml-2">GrowSphere</h1>
                  </div>
                  <h2 className="text-2xl text-blue-600">Certificate of Completion</h2>
                </div>
                
                {/* Main Content */}
                <div className="text-center">
                  <p className="text-lg text-gray-700 mb-4">This certifies that</p>
                  <p className="text-3xl font-bold text-blue-800 mb-4">{userName}</p>
                  <p className="text-lg text-gray-700 mb-4">has successfully completed</p>
                  <p className="text-3xl font-bold text-blue-800 mb-4">{tutorial.title}</p>
                  <p className="text-xl font-medium text-blue-600 mb-4">{tutorial.categories?.join(', ')}</p>
                  <p className="text-lg text-gray-700 mb-6 max-w-lg mx-auto">
                    {tutorial.description && tutorial.description.length > 150 
                      ? tutorial.description.substring(0, 150) + '...' 
                      : tutorial.description
                    }
                  </p>
                </div>
                
                {/* Footer */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="border-t-2 border-blue-300 w-32"></div>
                  </div>
                  <div className="flex justify-between w-full px-20">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-800">{tutorial.author || "GrowSphere Instructor"}</p>
                      <p className="text-sm text-gray-600">Instructor</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-800">{new Date(dateCompleted).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Date Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customize Certificate */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Customize Certificate</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Date Completed</label>
              <input
                type="date"
                value={dateCompleted}
                onChange={(e) => setDateCompleted(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-4 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© 2023 GrowSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Certificate;