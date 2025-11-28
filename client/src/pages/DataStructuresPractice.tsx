import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const DataStructuresPractice: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isStarted, setIsStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{questionId: number, selectedAnswer: string, timeSpent: number}[]>([]);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the time complexity of inserting an element at the beginning of a linked list?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: "O(1)"
    },
    {
      id: 2,
      question: "Which data structure is best suited for implementing LIFO (Last In First Out)?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correctAnswer: "Stack"
    },
    {
      id: 3,
      question: "What is the height of a balanced binary tree with n nodes?",
      options: ["O(log n)", "O(n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)"
    },
    {
      id: 4,
      question: "Which traversal technique uses a queue?",
      options: ["Inorder", "Preorder", "Postorder", "Level Order"],
      correctAnswer: "Level Order"
    },
    {
      id: 5,
      question: "What is the maximum number of nodes in a binary tree of height h?",
      options: ["2^h - 1", "2^h", "2^(h+1) - 1", "h^2"],
      correctAnswer: "2^(h+1) - 1"
    },
    {
      id: 6,
      question: "Which sorting algorithm has the worst-case time complexity of O(n²)?",
      options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
      correctAnswer: "Bubble Sort"
    },
    {
      id: 7,
      question: "What data structure is used for implementing priority queue?",
      options: ["Stack", "Queue", "Heap", "Linked List"],
      correctAnswer: "Heap"
    },
    {
      id: 8,
      question: "What is the time complexity of binary search in a sorted array?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)"
    },
    {
      id: 9,
      question: "Which of the following is a non-linear data structure?",
      options: ["Array", "Stack", "Queue", "Tree"],
      correctAnswer: "Tree"
    },
    {
      id: 10,
      question: "What is the time complexity of inserting an element in a hash table (average case)?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: "O(1)"
    },
    {
      id: 11,
      question: "Which algorithm is used to find the shortest path in a weighted graph?",
      options: ["DFS", "BFS", "Dijkstra's", "Binary Search"],
      correctAnswer: "Dijkstra's"
    },
    {
      id: 12,
      question: "What is the space complexity of recursive implementation of binary search?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: "O(log n)"
    },
    {
      id: 13,
      question: "Which data structure is used in browser history functionality?",
      options: ["Queue", "Stack", "Heap", "Tree"],
      correctAnswer: "Stack"
    },
    {
      id: 14,
      question: "What is the time complexity of merge sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correctAnswer: "O(n log n)"
    },
    {
      id: 15,
      question: "Which of the following is a disadvantage of arrays?",
      options: ["Random access", "Cache friendly", "Fixed size", "Simple implementation"],
      correctAnswer: "Fixed size"
    }
  ];

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const existingAnswerIndex = userAnswers.findIndex(ans => ans.questionId === questions[currentQuestion].id);
      const newAnswer = {
        questionId: questions[currentQuestion].id,
        selectedAnswer: selectedAnswer,
        timeSpent: 30
      };

      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[existingAnswerIndex] = newAnswer;
        setUserAnswers(updatedAnswers);
      } else {
        setUserAnswers([...userAnswers, newAnswer]);
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousAnswer = userAnswers.find(ans => ans.questionId === questions[currentQuestion - 1].id);
      setSelectedAnswer(previousAnswer?.selectedAnswer || '');
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      const existingAnswerIndex = userAnswers.findIndex(ans => ans.questionId === questions[currentQuestion].id);
      const newAnswer = {
        questionId: questions[currentQuestion].id,
        selectedAnswer: selectedAnswer,
        timeSpent: 30
      };

      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[existingAnswerIndex] = newAnswer;
        setUserAnswers(updatedAnswers);
      } else {
        setUserAnswers([...userAnswers, newAnswer]);
      }
    }

    const allAnswers = questions.map(question => {
      const existingAnswer = userAnswers.find(ans => ans.questionId === question.id);
      return existingAnswer || {
        questionId: question.id,
        selectedAnswer: "",
        timeSpent: 0
      };
    });

    const resultsWithCorrectness = allAnswers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      return {
        ...answer,
        isCorrect: question ? answer.selectedAnswer === question.correctAnswer : false
      };
    });

    const resultsData = {
      userAnswers: resultsWithCorrectness,
      questions: questions,
      timeTaken: 900 - timeLeft,
      completedAt: new Date().toISOString(),
      sessionType: "Data Structures"
    };

    localStorage.setItem('practiceResults', JSON.stringify(resultsData));
    navigate('/practice-results');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!isStarted) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 max-w-md w-full`}>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Data Structures Practice
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Test your knowledge of data structures, algorithms, and their complexities with 15 multiple choice questions.
          </p>
          <div className="space-y-4 mb-6">
            <div className={`flex items-center justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span>Questions:</span>
              <span className="font-semibold">15 MCQs</span>
            </div>
            <div className={`flex items-center justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span>Time Limit:</span>
              <span className="font-semibold">15 minutes</span>
            </div>
            <div className={`flex items-center justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span>Topics:</span>
              <span className="font-semibold">Arrays, Trees, Graphs, Sorting</span>
            </div>
          </div>
          <button
            onClick={handleStart}
            className={`w-full py-3 px-4 rounded-lg font-medium ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            Start Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navigation Bar */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Data Structures Practice
              </h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-800' : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className={`font-medium ${timeLeft < 60 ? 'text-red-800' : isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  ⏱️ {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="px-6 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Questions
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full bg-blue-500 mr-2`}></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full bg-green-500 mr-2`}></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Answered</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full bg-gray-400 mr-2`}></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not Answered</span>
              </div>
            </div>
          </div>
          
          {/* Question Buttons Grid */}
          <div className="flex flex-wrap gap-2 mt-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(ans => ans.questionId === question.id);
              const isAnswered = userAnswer && userAnswer.selectedAnswer !== "";
              const isCurrent = index === currentQuestion;
              
              return (
                <button
                  key={question.id}
                  onClick={() => {
                    setCurrentQuestion(index);
                    const answer = userAnswers.find(ans => ans.questionId === question.id);
                    setSelectedAnswer(answer?.selectedAnswer || '');
                  }}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                    isCurrent
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isAnswered
                      ? isDarkMode
                        ? 'bg-green-600 text-white'
                        : 'bg-green-500 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Progress
              </span>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {userAnswers.filter(ans => ans.selectedAnswer !== "").length} of {questions.length} answered
              </span>
            </div>
            <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Question Card */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 mb-6 max-w-4xl mx-auto`}>
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                Question {currentQuestion + 1}
              </span>
              <span className={`ml-3 px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
                Single Choice
              </span>
            </div>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              {questions[currentQuestion].question}
            </h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose the correct answer from the options below
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedAnswer === option
                    ? isDarkMode 
                      ? 'bg-blue-900 border-blue-500'
                      : 'bg-blue-50 border-blue-500'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-500'
                    : isDarkMode
                      ? 'border-gray-500'
                      : 'border-gray-400'
                }`}>
                  {selectedAnswer === option && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex-1`}>
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQuestion === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className={`px-6 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
              >
                Submit →
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`px-6 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataStructuresPractice;
