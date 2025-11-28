import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { testService } from '../services/testService';
import { Test } from '../types';

const TestResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    const fetchTestResults = async () => {
      if (!id) return;

      try {
        const test = await testService.getTest(id);
        setTest(test);
      } catch (error) {
        console.error('Failed to fetch test results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Test results not found</p>
        <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { results } = test;
  const percentage = Math.round((results.score / results.maxScore) * 100);

  const strengths = results.topicBreakdown
    .filter(topic => (topic.correctAnswers / topic.totalQuestions) >= 0.8)
    .sort((a, b) => (b.correctAnswers / b.totalQuestions) - (a.correctAnswers / a.totalQuestions));

  const improvements = results.topicBreakdown
    .filter(topic => (topic.correctAnswers / topic.totalQuestions) < 0.6)
    .sort((a, b) => (a.correctAnswers / a.totalQuestions) - (b.correctAnswers / b.totalQuestions));

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Test Results: {test.title}
        </h1>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Here's a detailed breakdown of your performance.
        </p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Overall Score */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 lg:col-span-2`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            OVERALL SCORE
          </h3>
          <p className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {results.score} / {results.maxScore}
          </p>
          <p className={`mt-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            Excellent Work! You're in the top tier of performers.
          </p>
        </div>

        {/* Percentile */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 flex flex-col items-center justify-center`}>
          <div className="relative w-24 h-24 mb-3">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - results.percentile / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {results.percentile}%
              </span>
            </div>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Percentile</p>
        </div>

        {/* Correct Answers */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 flex flex-col items-center justify-center`}>
          <p className={`text-3xl font-bold text-green-600`}>{results.correctAnswers}</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Correct Answers</p>
        </div>

        {/* Incorrect Answers */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 flex flex-col items-center justify-center`}>
          <p className={`text-3xl font-bold text-red-600`}>{results.incorrectAnswers}</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Incorrect Answers</p>
        </div>

        {/* Time Taken */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 flex flex-col items-center justify-center`}>
          <p className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {formatTime(results.timeTaken)}
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Time Taken</p>
        </div>
      </div>

      {/* Analysis and Solutions Tabs */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
        <div className="border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
          <nav className="flex -mb-px">
            {['analysis', 'solutions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : isDarkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'analysis' ? 'Analysis' : 'Solutions'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Strengths */}
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Your Strengths
                </h3>
                <div className="space-y-3">
                  {strengths.map((topic, index) => {
                    const accuracy = Math.round((topic.correctAnswers / topic.totalQuestions) * 100);
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {topic.topic}
                          </span>
                          <span className="text-green-600 font-medium">{accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Areas for Improvement
                </h3>
                <div className="space-y-3">
                  {improvements.map((topic, index) => {
                    const accuracy = Math.round((topic.correctAnswers / topic.totalQuestions) * 100);
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {topic.topic}
                          </span>
                          <span className="text-red-600 font-medium">{accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium">
                  Practice Weak Topics
                </button>
              </div>

              {/* Recommended Learning Path */}
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recommended Learning Path
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {improvements.slice(0, 2).map((topic, index) => (
                    <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 h-12 bg-gray-300 rounded"></div>
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Mastering {topic.topic}
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Learn the fundamental concepts and solve common problems.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium">
                  Watch Suggested Videos
                </button>
              </div>

              {/* Next Practice Steps */}
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Next Practice Steps
                </h3>
                <div className="space-y-3">
                  {improvements.slice(0, 2).map((topic, index) => (
                    <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} flex items-center justify-between`}>
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Topic Test: {topic.topic}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          15 Questions • 20 Mins
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-800 font-medium">
                        MEDIUM
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'solutions' && (
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Question Solutions
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Detailed solutions and explanations will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={`mt-12 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <p>© 2024 PrepDash. All Rights Reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link to="/support" className="hover:underline">Support</Link>
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
