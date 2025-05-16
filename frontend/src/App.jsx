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
import QuizStatusPage from './components/Challenges/QuizStatusPage';
import TakeQuizPage from './components/Challenges/TakeQuizPage';
import Leaderboard from './components/Challenges/Leaderboard';
import AllPostedQuizzes from './components/Challenges/AllPostedQuizzes';

//Community
import CommunityHome from './components/Community/CommunityHome';
import AddPost from './components/Community/AddPost';
import CommentSection from './components/Community/CommentSection';
import EditPost from './components/Community/EditPost';
import UserPosts from './components/Community/UserPosts';
import VerifiedPosts from './components/Community/VerifiedPosts';
import PostDetails from './components/Community/PostDetails';

//garden logs
import GardenCalendar from './components/GardenLogs/GardenCalendar';

//tutorial
import THome from './components/Tutorial/THome';
import AddTutorial from './components/Tutorial/AddTutorial';
import DisplayTutorial from './components/Tutorial/DisplayTutorial';






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
         <Route path="/quiz-status" element={<QuizStatusPage />} />


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
         <Route path="/community" element={<CommunityHome />} />
         <Route path="/add-post" element={<AddPost />} />  
         <Route path="/edit-post/:postId" element={<EditPost />} />
         <Route path="/user/:userId" element={<UserPosts />} /> 
         <Route path="/verified" element={<VerifiedPosts />} />
         <Route path="/community/posts/:postId/comments" element={<CommentSection />} />
         <Route path="/post/:id" element={<PostDetails />} />
         {/* <Route path="*" element={<NotFound />} />*/}






         {/* Tutorial */}
         <Route path="/thome" element={<THome />} />
         <Route path="/addtutorial" element={<AddTutorial/>} />
         <Route path="/alltutorial" element={<DisplayTutorial />} />
          
  
          









      </Routes>

      
    </Router>
  );
};

export default App;