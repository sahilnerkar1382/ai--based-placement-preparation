import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface MockTestCardProps {
  testId: string;
  title: string;
  company: string;
  role: string;
  duration: number;
  questionCount: number;
  topics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const MockTestCard: React.FC<MockTestCardProps> = ({
  testId,
  title,
  company,
  role,
  duration,
  questionCount,
  topics,
  difficulty
}) => {
  const { isDarkMode } = useTheme();

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:scale-105`}>
      {/* Test Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {title}
          </h3>
          <div className="flex items-center space-x-4 mb-3">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {company}
            </span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {role}
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
      </div>

      {/* Test Details */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {duration} min
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration</p>
        </div>
        <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            {questionCount}
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Questions</p>
        </div>
        <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            {topics.length}
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Topics</p>
        </div>
      </div>

      {/* Topics List */}
      <div className="mb-4">
        <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Topics Covered:
        </p>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs font-medium rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Link
        to={`/interview-test/${testId}`}
        className={`block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg`}
      >
        Start Mock Test
      </Link>
    </div>
  );
};

export default MockTestCard;
