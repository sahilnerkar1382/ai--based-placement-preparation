import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { testService } from '../services/testService';
import { Test, Question } from '../types';

const TestInterface: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;

      try {
        const test = await testService.getTest(id);
        setTest(test);
        setAnswers(new Array(test.questions.length).fill(''));
        setTimeRemaining(test.duration * 60);
        
        if (test.status === 'not-started') {
          await testService.startTest(id);
        }
      } catch (error) {
        console.error('Failed to fetch test:', error);
        navigate('/practice');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id, navigate]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')} Hours ${minutes.toString().padStart(2, '0')} Minutes ${secs.toString().padStart(2, '0')} Seconds`;
  };

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (test?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestion(index);
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmitTest = async () => {
    if (!test || !id) return;

    try {
      const timeTaken = test.duration * 60 - timeRemaining;
      await testService.submitTest(id, answers, timeTaken);
      navigate(`/test-results/${id}`);
    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };

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
        <p className="text-lg text-gray-500">Test not found</p>
      </div>
    );
  }

  const question = test.questions[currentQuestion];
  const answeredCount = answers.filter(answer => answer !== '').length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      {/* Questions Navigation */}
      <div className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-4 hidden lg:block`}>
        <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Questions
        </h3>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {test.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleQuestionSelect(index)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : answers[index]
                  ? 'bg-green-600 text-white'
                  : flaggedQuestions.has(index)
                  ? 'bg-orange-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {/* Legend */}
        <div className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-600 rounded"></div>
            <span>Flagged</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span>Not Answered</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {test.company} - {test.type} Round
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Question {currentQuestion + 1} of {test.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </span>
              <button
                onClick={handleSubmitTest}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {question.text}
              </h2>

              {/* Multiple Choice Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                      answers[currentQuestion] === option.text
                        ? isDarkMode
                          ? 'bg-blue-900 border-blue-600'
                          : 'bg-blue-50 border-blue-600'
                        : isDarkMode
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    } border`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={option.text}
                      checked={answers[currentQuestion] === option.text}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="mr-3"
                    />
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {option.text}
                    </span>
                  </label>
                ))}
              </div>

              {/* Auto-save Message */}
              <div className="flex items-center mt-4 text-green-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Your answer is autosaved.</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentQuestion === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              <button
                onClick={toggleFlag}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  flaggedQuestions.has(currentQuestion)
                    ? 'bg-orange-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag for Review'}
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestion === test.questions.length - 1}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentQuestion === test.questions.length - 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>

          {/* Right Panel - Test Info */}
          <div className={`w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6 hidden xl:block`}>
            {/* Time Remaining */}
            <div className="mb-6">
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Time Remaining
              </h3>
              <div className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Progress
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(answeredCount / test.questions.length) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {answeredCount}/{test.questions.length}
                </span>
              </div>
            </div>

            {/* Flagged Questions Count */}
            {flaggedQuestions.size > 0 && (
              <div className="mb-6">
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Flagged Questions
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {flaggedQuestions.size} question{flaggedQuestions.size > 1 ? 's' : ''} flagged for review
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitTest}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
