import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const AptitudePractice: React.FC = () => {
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
      question: "If a train travels 300 km in 3 hours, what is its average speed?",
      options: ["50 km/h", "75 km/h", "100 km/h", "150 km/h"],
      correctAnswer: "100 km/h"
    },
    {
      id: 2,
      question: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
      options: ["36", "40", "42", "45"],
      correctAnswer: "42"
    },
    {
      id: 3,
      question: "If 15% of a number is 45, what is the number?",
      options: ["200", "300", "400", "500"],
      correctAnswer: "300"
    },
    {
      id: 4,
      question: "A man is 4 times as old as his son. In 20 years, he'll be twice as old. How old are they now?",
      options: ["Father: 40, Son: 10", "Father: 32, Son: 8", "Father: 48, Son: 12", "Father: 36, Son: 9"],
      correctAnswer: "Father: 40, Son: 10"
    },
    {
      id: 5,
      question: "What is the area of a circle with radius 7 cm? (π = 22/7)",
      options: ["154 cm²", "44 cm²", "77 cm²", "308 cm²"],
      correctAnswer: "154 cm²"
    },
    {
      id: 6,
      question: "If A:B = 3:4 and B:C = 5:6, what is A:C?",
      options: ["15:24", "3:6", "5:8", "15:8"],
      correctAnswer: "5:8"
    },
    {
      id: 7,
      question: "A shopkeeper sells an article at 20% profit. If he bought it for ₹400, what's the selling price?",
      options: ["₹480", "₹500", "₹520", "₹450"],
      correctAnswer: "₹480"
    },
    {
      id: 8,
      question: "What is the average of first 10 odd numbers?",
      options: ["9", "10", "11", "12"],
      correctAnswer: "10"
    },
    {
      id: 9,
      question: "If 5 workers can complete a task in 12 days, how many days will 3 workers take?",
      options: ["18 days", "20 days", "15 days", "24 days"],
      correctAnswer: "20 days"
    },
    {
      id: 10,
      question: "What is 25% of 200 + 15% of 300?",
      options: ["95", "105", "115", "125"],
      correctAnswer: "95"
    },
    {
      id: 11,
      question: "A rectangular field has dimensions 30m × 20m. What's the cost of fencing at ₹15 per meter?",
      options: ["₹1500", "₹3000", "₹4500", "₹6000"],
      correctAnswer: "₹1500"
    },
    {
      id: 12,
      question: "If the sum of two numbers is 45 and their difference is 15, what are the numbers?",
      options: ["25 and 20", "30 and 15", "35 and 10", "40 and 5"],
      correctAnswer: "30 and 15"
    },
    {
      id: 13,
      question: "What is the compound interest on ₹1000 at 10% per annum for 2 years?",
      options: ["₹200", "₹210", "₹220", "₹240"],
      correctAnswer: "₹210"
    },
    {
      id: 14,
      question: "If 3/4 of a number is 48, what is 5/6 of the same number?",
      options: ["40", "50", "60", "70"],
      correctAnswer: "40"
    },
    {
      id: 15,
      question: "A boat travels upstream in 4 hours and downstream in 2 hours. If the speed of the stream is 3 km/h, what's the speed of the boat in still water?",
      options: ["6 km/h", "9 km/h", "12 km/h", "15 km/h"],
      correctAnswer: "9 km/h"
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
      sessionType: "Aptitude"
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
            Aptitude Practice
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Sharpen your quantitative aptitude skills with 15 questions covering mathematics, reasoning, and problem-solving.
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
              <span className="font-semibold">Math, Reasoning, Problem Solving</span>
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
                Aptitude Practice
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
        <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
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

export default AptitudePractice;
