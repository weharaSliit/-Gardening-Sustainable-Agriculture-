// src/components/Tutorial/DisplayTutorial.jsx

import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { Link } from 'react-router-dom';

export default function DisplayTutorial() {
  const [tutorials, setTutorials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    axiosClient
      .get('/tutorial/viewtutorial')
      .then(res => setTutorials(res.data))
      .catch(err => console.error(err));
  }, []);

  // filter by title or description
  const filtered = tutorials.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // partition into three sections
  const featured = filtered.slice(0, 4);
  const recent   = filtered.slice(4, 8);
  const popular  = filtered.slice(8, 12);

   // fixed navigation function
   const UpdateNavigation = (id) => {
    navigate(`/updatetutorial/${id}`);
  };

  // card component
  const TutorialCard = ({ t }) => (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <span
        className={
          'self-start text-xs font-semibold px-2 py-1 rounded ' +
          (t.difficulty === 'Beginner'
            ? 'bg-green-100 text-green-800'
            : t.difficulty === 'Intermediate'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800')
        }
      >
        {t.difficulty}
      </span>

      <div className="mt-2 h-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        <img
          src={`http://localhost:8080/api/v1/tutorial/viewtutorial/image/${t.tutorialImage}`}
          alt={t.title}
          className="object-cover h-full w-full"
          onError={e => { e.currentTarget.src = '/placeholder.png'; }}
        />
       
      </div>

      <h3 className="mt-4 font-semibold text-lg line-clamp-2">{t.title}</h3>
      <p className="text-sm text-gray-600 flex-grow mt-2 line-clamp-3">
        {t.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {t.categories.map(cat => (
          <span
            key={cat}
            className="text-xs bg-gray-200 px-2 py-0.5 rounded"
          >
            {cat}
          </span>
        ))}
      </div>

      <Link
        to={`/thome/${t.id}`}
        className="mt-4 text-green-600 font-medium hover:underline"
      >
        View Tutorial &rarr;
      </Link>
      
    </div>
  );

  // section wrapper
  const Section = ({ title, linkText, linkUrl, items }) =>
    items.length > 0 && (
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {linkText && (
            <Link to={linkUrl} className="text-sm text-green-600 hover:underline">
              {linkText} &rarr;
            </Link>
          )}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(t => <TutorialCard key={t.id} t={t} />)}
        </div>
      </section>
    );



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
}
