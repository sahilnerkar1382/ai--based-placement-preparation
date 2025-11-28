import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Practice: React.FC = () => {
  const { isDarkMode } = useTheme();

  const practiceSessions = [
    {
      id: 'data-structures',
      title: 'Data Structures',
      description: 'Master arrays, trees, graphs, and algorithms with technical questions',
      icon: '',
      tags: ['Algorithms', 'Complexity', 'Trees', 'Sorting'],
      difficulty: ['Easy', 'Medium', 'Hard'],
      path: '/practice/data-structures'
    },
    {
      id: 'interview-questions',
      title: 'Interview Questions',
      description: 'Prepare for behavioral, technical, and HR interview scenarios',
      icon: '',
      tags: ['Behavioral', 'Technical', 'HR', 'Communication'],
      difficulty: ['Easy', 'Medium', 'Hard'],
      path: '/practice/interview-questions'
    },
    {
      id: 'aptitude',
      title: 'Aptitude Test',
      description: 'Sharpen quantitative aptitude, reasoning, and problem-solving skills',
      icon: '',
      tags: ['Mathematics', 'Reasoning', 'Problem Solving', 'Speed'],
      difficulty: ['Easy', 'Medium', 'Hard'],
      path: '/practice/aptitude'
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-4`}>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          Practice Sessions
        </h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Choose from our specialized practice sessions to improve your skills
        </p>
      </div>

      {/* Practice Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {practiceSessions.map((session) => (
          <div
            key={session.id}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow`}
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl">{session.icon}</span>
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {session.title}
            </h3>

            {/* Description */}
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              {session.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {session.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Difficulty:
              </p>
              <div className="flex gap-2">
                {session.difficulty.map((level, index) => (
                  <button
                    key={level}
                    className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                      index === 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : isDarkMode
                        ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link
                to={session.path}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium text-center transition-colors"
              >
                Start Practice
              </Link>
              <button
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                  isDarkMode
                    ? 'border-purple-600 text-purple-400 hover:bg-purple-900 hover:text-purple-300'
                    : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
              >
                Customize
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Features */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Practice Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Adaptive Learning
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Questions adapt to your skill level
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Detailed Analytics
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Track your progress and identify weak areas
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⏱️</span>
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Time Management
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Practice with realistic time constraints
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
