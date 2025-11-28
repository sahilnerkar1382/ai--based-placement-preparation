import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

const PracticeResults: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load results from localStorage
    const loadResults = () => {
      const storedResults = localStorage.getItem('practiceResults');
      
      console.log('Stored results:', storedResults); // Debug log
      
      if (storedResults) {
        try {
          const results = JSON.parse(storedResults);
          console.log('Parsed results:', results); // Debug log
          setQuestions(results.questions || []);
          setUserAnswers(results.userAnswers || []);
          setTimeTaken(results.timeTaken || 0);
        } catch (error) {
          console.error('Error parsing stored results:', error);
          // Fallback to mock data
          loadMockData();
        }
      } else {
        console.log('No stored results found, using mock data'); // Debug log
        // Fallback to mock data if no stored results
        loadMockData();
      }
      setLoading(false);
    };

    const loadMockData = () => {
      // Fallback to mock data if no stored results
      const mockQuestions: Question[] = [
        {
          id: 1,
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correctAnswer: "O(log n)"
        },
        {
          id: 2,
          question: "Which data structure uses LIFO principle?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correctAnswer: "Stack"
        },
        {
          id: 3,
          question: "What is the output of 2 + '2' in JavaScript?",
          options: ["4", "22", "Error", "undefined"],
          correctAnswer: "22"
        },
        {
          id: 4,
          question: "Which sorting algorithm has the best average case time complexity?",
          options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
          correctAnswer: "Quick Sort"
        },
        {
          id: 5,
          question: "What is the maximum value of an 8-bit unsigned integer?",
          options: ["127", "255", "256", "511"],
          correctAnswer: "255"
        }
      ];

      // Mock user answers (some correct, some wrong, some unanswered)
      const mockUserAnswers: UserAnswer[] = [
        { questionId: 1, selectedAnswer: "O(log n)", isCorrect: true, timeSpent: 45 },
        { questionId: 2, selectedAnswer: "Stack", isCorrect: true, timeSpent: 30 },
        { questionId: 3, selectedAnswer: "22", isCorrect: true, timeSpent: 25 },
        { questionId: 4, selectedAnswer: "Bubble Sort", isCorrect: false, timeSpent: 60 },
        { questionId: 5, selectedAnswer: "255", isCorrect: true, timeSpent: 40 }
      ];

      setQuestions(mockQuestions);
      setUserAnswers(mockUserAnswers);
      setTimeTaken(720); // 12 minutes in seconds
    };

    loadResults();
  }, []);

  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const wrongAnswers = userAnswers.filter(answer => !answer.isCorrect && answer.selectedAnswer !== "").length;
  const unansweredQuestions = userAnswers.filter(answer => answer.selectedAnswer === "").length;
  const totalQuestions = questions.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Debug logs
  console.log('User Answers:', userAnswers);
  console.log('Questions:', questions);
  console.log('Correct:', correctAnswers, 'Wrong:', wrongAnswers, 'Unanswered:', unansweredQuestions);
  console.log('Total Questions:', totalQuestions, 'Score:', scorePercentage + '%');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-xl">Loading results...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Practice Results
        </h1>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 text-center`}>
          <div className="text-3xl font-bold text-green-500 mb-2">{correctAnswers}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Correct</div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 text-center`}>
          <div className="text-3xl font-bold text-red-500 mb-2">{wrongAnswers}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wrong</div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 text-center`}>
          <div className="text-3xl font-bold text-yellow-500 mb-2">{unansweredQuestions}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unanswered</div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 text-center`}>
          <div className="text-3xl font-bold text-blue-500 mb-2">{scorePercentage}%</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Performance Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between">
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Questions:</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalQuestions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Taken:</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatTime(timeTaken)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Accuracy:</span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{scorePercentage}%</span>
          </div>
        </div>
      </div>

      {/* Question-wise Analysis */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Question-wise Analysis
        </h2>
        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = userAnswers.find(answer => answer.questionId === question.id);
            const isCorrect = userAnswer?.isCorrect || false;
            const isUnanswered = !userAnswer || userAnswer.selectedAnswer === "";

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border ${
                  isCorrect
                    ? 'bg-green-50 border-green-200'
                    : isUnanswered
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`font-semibold mr-2 ${isDarkMode ? 'text-gray-900' : 'text-gray-900'}`}>
                        Q{index + 1}.
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isCorrect
                          ? 'bg-green-100 text-green-800'
                          : isUnanswered
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct' : isUnanswered ? 'Unanswered' : 'Wrong'}
                      </span>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-800' : 'text-gray-900'} mb-2`}>
                      {question.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded text-sm ${
                            option === question.correctAnswer
                              ? 'bg-green-100 text-green-800 font-medium'
                              : option === userAnswer?.selectedAnswer && !isCorrect
                              ? 'bg-red-100 text-red-800'
                              : isDarkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {option === question.correctAnswer && ' ✓'}
                          {option === userAnswer?.selectedAnswer && !isCorrect && ' ✗'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/practice"
          className={`flex-1 px-6 py-3 rounded-lg text-center font-medium ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
        >
          Practice Again
        </Link>
        <Link
          to="/dashboard"
          className={`flex-1 px-6 py-3 rounded-lg text-center font-medium ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDarkMode ? 'text-white' : 'text-gray-700'} transition-colors`}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PracticeResults;
