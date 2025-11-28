import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'coding' | 'behavioral';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  timeLimit: number; // in minutes
}

interface Test {
  id: string;
  title: string;
  company: string;
  role: string;
  duration: number; // in minutes
  questions: Question[];
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number;
  totalQuestions: number;
}

const InterviewTest: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { isDarkMode } = useTheme();
  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Mock test data with topic-based questions
    const generateTopicBasedQuestions = (testType: string, company: string, role: string) => {
      const questionBank: { [key: string]: Question[] } = {
        'Data Structures & Algorithms': [
          {
            id: 'dsa-1',
            text: 'What is the time complexity of binary search?',
            type: 'multiple-choice',
            topic: 'Data Structures & Algorithms',
            difficulty: 'Easy',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 'O(log n)',
            explanation: 'Binary search divides the search space in half with each comparison.',
            timeLimit: 2
          },
          {
            id: 'dsa-2',
            text: 'Implement a function to reverse a linked list.',
            type: 'coding',
            topic: 'Data Structures & Algorithms',
            difficulty: 'Medium',
            explanation: 'Write a function that takes the head of a linked list and returns the new head after reversing.',
            timeLimit: 15
          },
          {
            id: 'dsa-3',
            text: 'Find the kth largest element in an unsorted array.',
            type: 'coding',
            topic: 'Data Structures & Algorithms',
            difficulty: 'Hard',
            explanation: 'Implement an efficient algorithm to find the kth largest element.',
            timeLimit: 20
          }
        ],
        'System Design': [
          {
            id: 'sd-1',
            text: 'Design a URL shortening service like bit.ly.',
            type: 'coding',
            topic: 'System Design',
            difficulty: 'Hard',
            explanation: 'Design a system that can convert long URLs to short URLs and redirect users.',
            timeLimit: 20
          },
          {
            id: 'sd-2',
            text: 'What is the purpose of a load balancer?',
            type: 'multiple-choice',
            topic: 'System Design',
            difficulty: 'Easy',
            options: [
              'To store data',
              'To distribute incoming traffic across multiple servers',
              'To encrypt data',
              'To compile code'
            ],
            correctAnswer: 'To distribute incoming traffic across multiple servers',
            explanation: 'Load balancers distribute network traffic across multiple servers.',
            timeLimit: 2
          }
        ],
        'Behavioral Questions': [
          {
            id: 'bq-1',
            text: 'Tell me about a time you faced a challenge.',
            type: 'behavioral',
            topic: 'Behavioral Questions',
            difficulty: 'Medium',
            explanation: 'Provide a specific example using the STAR method.',
            timeLimit: 5
          },
          {
            id: 'bq-2',
            text: `Why do you want to work at ${company}?`,
            type: 'behavioral',
            topic: 'Behavioral Questions',
            difficulty: 'Easy',
            explanation: 'Be specific about the company\'s products, culture, and how they align with your goals.',
            timeLimit: 3
          }
        ],
        'Object-Oriented Design': [
          {
            id: 'ood-1',
            text: 'Design a parking lot system.',
            type: 'coding',
            topic: 'Object-Oriented Design',
            difficulty: 'Medium',
            explanation: 'Design a class structure for a parking lot system with vehicles and spots.',
            timeLimit: 15
          },
          {
            id: 'ood-2',
            text: 'What is the difference between abstract classes and interfaces?',
            type: 'multiple-choice',
            topic: 'Object-Oriented Design',
            difficulty: 'Medium',
            options: [
              'No difference',
              'Abstract classes can have implementation, interfaces cannot',
              'Interfaces can have implementation, abstract classes cannot',
              'Abstract classes are for inheritance, interfaces are for composition'
            ],
            correctAnswer: 'Abstract classes can have implementation, interfaces cannot',
            explanation: 'Abstract classes can contain both abstract and concrete methods.',
            timeLimit: 3
          }
        ]
      };

      let questions: Question[] = [];
      let duration = 30;
      let title = '';

      if (testType.includes('full')) {
        // Full mock test - include all topics
        Object.values(questionBank).forEach(topicQuestions => {
          questions = questions.concat(topicQuestions.slice(0, 2));
        });
        duration = 60;
        title = `${company} Full Mock Interview`;
      } else if (testType.includes('technical')) {
        // Technical test - focus on core topics
        questions = [
          ...(questionBank['Data Structures & Algorithms'] || []),
          ...(questionBank['System Design'] || []),
          ...(questionBank['Object-Oriented Design'] || [])
        ];
        duration = 45;
        title = `${company} Technical Assessment`;
      } else if (testType.includes('behavioral')) {
        // Behavioral test
        questions = questionBank['Behavioral Questions'] || [];
        duration = 30;
        title = `${company} Behavioral Interview`;
      }

      return { questions, duration, title };
    };

    // Parse testId to get company and test type
    const parts = testId?.split('-') || [];
    const interviewId = parts[0];
    const testType = parts[1] || 'full';

    // Mock company data based on interviewId
    const companyData: { [key: string]: { company: string; role: string } } = {
      '1': { company: 'Google', role: 'SDE 1' },
      '2': { company: 'Microsoft', role: 'Software Engineer' },
      '3': { company: 'Amazon', role: 'Software Developer' }
    };

    const companyInfo = companyData[interviewId] || { company: 'Unknown', role: 'Unknown' };
    const { questions, duration, title } = generateTopicBasedQuestions(testType, companyInfo.company, companyInfo.role);

    const newTest: Test = {
      id: testId || 'unknown',
      title,
      company: companyInfo.company,
      role: companyInfo.role,
      duration,
      totalQuestions: questions.length,
      status: 'not-started',
      questions
    };

    setTest(newTest);
    setTimeRemaining(duration * 60);
  }, [testId]);

  useEffect(() => {
    if (testStarted && timeRemaining > 0 && !testCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !testCompleted) {
      completeTest();
    }
  }, [testStarted, timeRemaining, testCompleted]);

  const startTest = () => {
    setTestStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (test?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeTest = () => {
    setTestCompleted(true);
    setShowResults(true);
    // Calculate score (mock calculation)
    const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
    setTest(prev => prev ? { ...prev, score, status: 'completed' } : null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    if (!test) return 0;
    let correct = 0;
    test.questions.forEach(question => {
      if (question.type === 'multiple-choice' && answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / test.questions.length) * 100);
  };

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Test not found</div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <div className="mb-6">
              <Link to={`/interviews`} className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                ← Back to Interviews
              </Link>
            </div>

            <div className="text-center mb-8">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                {test.title}
              </h1>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {test.duration} min
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration</p>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {test.totalQuestions}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Questions</p>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {test.company}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Company</p>
                </div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 mb-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Test Instructions
              </h3>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• This test contains {test.totalQuestions} questions covering various topics</li>
                <li>• You have {test.duration} minutes to complete the test</li>
                <li>• Multiple choice questions have only one correct answer</li>
                <li>• Coding questions require you to write code solutions</li>
                <li>• Behavioral questions should be answered with specific examples</li>
                <li>• The test will automatically submit when time expires</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={startTest}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Test Completed!
              </h1>
              <div className={`text-6xl font-bold mb-4 ${test.score && test.score >= 80 ? 'text-green-500' : test.score && test.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                {test.score || calculateScore()}%
              </div>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Your performance score
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {Object.keys(answers).length}/{test.totalQuestions}
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Questions Attempted</p>
              </div>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className={`text-xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {formatTime(test.duration * 60 - timeRemaining)}
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time Taken</p>
              </div>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className={`text-xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  {test.company}
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Company</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                to="/interviews"
                className={`px-6 py-3 rounded-xl font-semibold ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
              >
                Back to Interviews
              </Link>
              <button
                onClick={() => {
                  setTestStarted(false);
                  setTestCompleted(false);
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setTimeRemaining(test.duration * 60);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Test Header */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {test.title}
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </p>
            </div>
            <div className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-500' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty}
              </span>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                {currentQuestion.topic}
              </span>
            </div>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              {currentQuestion.text}
            </h2>
            {currentQuestion.explanation && (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                {currentQuestion.explanation}
              </p>
            )}
          </div>

          {/* Answer Options */}
          <div className="mb-8">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                      answers[currentQuestion.id] === option
                        ? isDarkMode ? 'bg-blue-900 border-blue-500' : 'bg-blue-50 border-blue-500'
                        : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    } border-2`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="mr-3"
                    />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'coding' && (
              <div>
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Write your code solution here..."
                  className={`w-full h-64 p-4 rounded-xl font-mono text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            )}

            {currentQuestion.type === 'behavioral' && (
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Provide your answer using the STAR method (Situation, Task, Action, Result)..."
                className={`w-full h-32 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                currentQuestionIndex === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              {currentQuestionIndex === test.questions.length - 1 ? 'Submit Test' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewTest;
