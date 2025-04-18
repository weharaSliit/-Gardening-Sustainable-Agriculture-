import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';   
import AddChallenge from './components/Challenges/AddChallenge';
import QuizManagement from './components/Challenges/QuizManagement';
import EditChallenge from './components/Challenges/EditChallenge';
import Home from './components/MainComponents/Home';
import ChallengeHome from './components/Challenges/ChallengeHome';

const App = () => {
  return (
    <Router>
      <Routes>

      {/* Main components */}

      <Route path="/" element={<Home />} /> {/*  Home as default route */}
     

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




         {/* Garden logs */}






         {/* Community */}






         {/* Tutorial */}









      </Routes>

      
    </Router>
  );
};

export default App;