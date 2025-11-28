import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Interviews from './pages/Interviews';
import InterviewDetails from './pages/InterviewDetails';
import InterviewTest from './pages/InterviewTest';
import AddInterview from './pages/AddInterview';
import CompanyQuestions from './pages/CompanyQuestions';
import Practice from './pages/Practice';
import DataStructuresPractice from './pages/DataStructuresPractice';
import InterviewQuestionsPractice from './pages/InterviewQuestionsPractice';
import AptitudePractice from './pages/AptitudePractice';
import PracticeResults from './pages/PracticeResults';
import TestInterface from './pages/TestInterface';
import TestResults from './pages/TestResults';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Resume from './pages/Resume';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="interviews" element={<Interviews />} />
                <Route path="interviews/add" element={<AddInterview />} />
                <Route path="interviews/:id" element={<InterviewDetails />} />
                <Route path="interview-test/:testId" element={<InterviewTest />} />
                <Route path="company/:companyId/questions" element={<CompanyQuestions />} />
                <Route path="practice" element={<Practice />} />
                <Route path="practice/data-structures" element={<DataStructuresPractice />} />
                <Route path="practice/interview-questions" element={<InterviewQuestionsPractice />} />
                <Route path="practice/aptitude" element={<AptitudePractice />} />
                <Route path="practice-results" element={<PracticeResults />} />
                <Route path="test/:id" element={<TestInterface />} />
                <Route path="test-results/:id" element={<TestResults />} />
                <Route path="profile" element={<Profile />} />
                <Route path="resume" element={<ErrorBoundary><Resume /></ErrorBoundary>} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
