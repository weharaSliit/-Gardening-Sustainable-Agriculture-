import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Register from './components/User/Register';
import LoginPage from './components/User/LoginPage';
import ProfilePage from './components/User/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';   

//main components
import Home from './components/MainComponents/Home';
import About from './components/MainComponents/About';
import ContactUs from './components/MainComponents/ContactUs';

//challanges
import AddChallenge from './components/Challenges/AddChallenge';
import QuizManagement from './components/Challenges/QuizManagement';
import EditChallenge from './components/Challenges/EditChallenge';
import ChallengeHome from './components/Challenges/ChallengeHome';
import TakeQuizPage from './components/Challenges/TakeQuizPage';
import Leaderboard from './components/Challenges/Leaderboard';
import AllPostedQuizzes from './components/Challenges/AllPostedQuizzes';
import QuizStatistics from './components/Challenges/QuizStatistics';



//garden logs
import GardenCalendar from './components/GardenLogs/GardenCalendar';

//tutorial
import THome from './components/Tutorial/THome';
import AddTutorial from './components/Tutorial/AddTutorial';
import DisplayTutorial from './components/Tutorial/DisplayTutorial';
import UpdateTutorial from './components/Tutorial/UpdateTutorial';
import ExploreTutorial from './components/Tutorial/ExploreTutorial';  








const App = () => {
  return (
    <Router>
      <Routes>

      {/* Main components */}

      <Route path="/" element={<Home />} /> {/*  Home as default route */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactUs />} />
     

       {/* User Registation and Login */}

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        

         {/* Challenge */}
         <Route path="/challenge-home" element={<ChallengeHome />} />
         <Route path="/add-challenge" element={<AddChallenge />} />
         <Route path="/all-challenge" element={<QuizManagement />} />
         <Route path="/update-challenge/:challengeId" element={<EditChallenge />} />
         <Route path="/quiz-statistics" element={<QuizStatistics />} />


         <Route path="/take-quiz/:id" element={<TakeQuizPage />} />
        <Route path="/leaderboard/:id" element={<Leaderboard />} />
        <Route path="/all-posted-quizzes" element={<AllPostedQuizzes />} />




         {/* Garden logs */}
         <Route
          path="/garden-calendar"
          element={
            <ProtectedRoute>
              <GardenCalendar />
            </ProtectedRoute>
          }
        />



         {/* Community */}






         {/* Tutorial */}

         {/* Tutorial - Admin Views */}
         <Route path="/thome" element={<THome />} />
         <Route path="/addtutorial" element={<AddTutorial/>} />
         <Route path="/alltutorial" element={<DisplayTutorial />} />
        <Route path="/tutorial/:id" element={<DisplayTutorial />} />
        <Route path="/updatetutorial/:id" element={<UpdateTutorial />} />
        {/* Explore Tutorials - Public Views */}
        <Route path="/explore-tutorials" element={<ExploreTutorial />} />
        <Route path="/explore-tutorial/:id" element={<ExploreTutorial />} />
        <Route path="/explore-tutorial/:id/progress" element={<ExploreTutorial />} />
        <Route path="/explore-tutorial/:id/certificate" element={<ExploreTutorial />} />


       

        

          
  
          









      </Routes>

      
    </Router>
  );
};

export default App;