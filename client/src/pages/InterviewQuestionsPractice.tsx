import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const InterviewQuestionsPractice: React.FC = () => {
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
      question: "What is the most important thing to research before a job interview?",
      options: ["Company's products", "Company culture and values", "Salary range", "All of the above"],
      correctAnswer: "All of the above"
    },
    {
      id: 2,
      question: "How should you answer the question 'Tell me about yourself'?",
      options: ["Share your life story", "Focus on relevant experience and skills", "Talk about your hobbies", "Mention your salary expectations"],
      correctAnswer: "Focus on relevant experience and skills"
    },
    {
      id: 3,
      question: "What is the best way to handle behavioral questions?",
      options: ["Give vague answers", "Use the STAR method", "Only talk about successes", "Avoid giving specific examples"],
      correctAnswer: "Use the STAR method"
    },
    {
      id: 4,
      question: "What should you do when you don't know the answer to a technical question?",
      options: ["Panic and stay silent", "Make up an answer", "Admit you don't know but explain your thought process", "Ask the interviewer to skip it"],
      correctAnswer: "Admit you don't know but explain your thought process"
    },
    {
      id: 5,
      question: "When should you discuss salary in an interview?",
      options: ["At the very beginning", "When the interviewer brings it up", "Never let them bring it up first", "Only in the final round"],
      correctAnswer: "When the interviewer brings it up"
    },
    {
      id: 6,
      question: "What is the best way to answer 'What is your greatest weakness'?",
      options: ["Say you have no weaknesses", "Mention a real weakness and how you're improving", "Blame previous employers", "Use a fake weakness like 'I'm a perfectionist'"],
      correctAnswer: "Mention a real weakness and how you're improving"
    },
    {
      id: 7,
      question: "How should you prepare for a technical interview?",
      options: ["Memorize solutions", "Practice problem-solving and understand concepts", "Focus only on one programming language", "Study the night before"],
      correctAnswer: "Practice problem-solving and understand concepts"
    },
    {
      id: 8,
      question: "What is the appropriate dress code for most tech interviews?",
      options: ["Formal suit and tie", "Business casual", "Casual clothes", "Whatever you want"],
      correctAnswer: "Business casual"
    },
    {
      id: 9,
      question: "How should you follow up after an interview?",
      options: ["Call them every day", "Send a thank-you email within 24 hours", "Wait for them to contact you", "Send a text message"],
      correctAnswer: "Send a thank-you email within 24 hours"
    },
    {
      id: 10,
      question: "What is the best way to answer 'Why do you want to work here'?",
      options: ["Because I need a job", "Mention company's mission and how you fit", "Talk about the salary", "Say it's close to your home"],
      correctAnswer: "Mention company's mission and how you fit"
    },
    {
      id: 11,
      question: "How should you handle the question 'Where do you see yourself in 5 years'?",
      options: ["Say you want their job", "Focus on learning and growth", "Say you'll be at a different company", "Talk about starting your own business"],
      correctAnswer: "Focus on learning and growth"
    },
    {
      id: 12,
      question: "What is the most important body language tip for interviews?",
      options: ["Avoid eye contact", "Sit with arms crossed", "Maintain good posture and eye contact", "Fidget to show you're energetic"],
      correctAnswer: "Maintain good posture and eye contact"
    },
    {
      id: 13,
      question: "How should you answer 'Why are you leaving your current job'?",
      options: ["Complain about your boss", "Focus on seeking new challenges and growth", "Say you were fired", "Talk about better salary"],
      correctAnswer: "Focus on seeking new challenges and growth"
    },
    {
      id: 14,
      question: "What questions should you ask the interviewer?",
      options: ["No questions, they should ask all", "Only about salary and benefits", "About team, role, and company culture", "Personal questions about the interviewer"],
      correctAnswer: "About team, role, and company culture"
    },
    {
      id: 15,
      question: "What is the best way to handle multiple interview rounds?",
      options: ["Give different answers each time", "Be consistent but elaborate more in later rounds", "Only prepare for the first round", "Treat all rounds the same"],
      correctAnswer: "Be consistent but elaborate more in later rounds"
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
      sessionType: "Interview Questions"
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
            Interview Questions Practice
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Master the art of answering common interview questions with 15 scenarios covering behavioral, technical, and situational questions.
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
              <span className="font-semibold">Behavioral, Technical, HR Questions</span>
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
                Interview Questions Practice
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

export default InterviewQuestionsPractice;
