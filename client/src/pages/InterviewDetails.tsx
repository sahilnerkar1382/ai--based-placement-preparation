import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import MockTestCard from '../components/MockTestCard';

interface Interview {
  _id: string;
  company: string;
  role: string;
  date: string;
  package: string;
  logo: string;
  paqCompleted: boolean;
  topics: Topic[];
}

interface Topic {
  id: string;
  name: string;
  type: 'Core' | 'Important' | 'Optional';
  completed: boolean;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  frequency: 'High' | 'Medium' | 'Low';
}

const InterviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'topics' | 'questions' | 'tips'>('topics');

  useEffect(() => {
    // First check localStorage for newly created interviews
    const storedInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
    const foundInterview = storedInterviews.find((i: any) => i._id === id);
    
    if (foundInterview) {
      // Use stored interview if found
      setInterview(foundInterview);
      setLoading(false);
    } else {
      // Fallback to mock data if no stored interview found
      const mockInterviews: Interview[] = [
        {
          _id: '1',
          company: 'Google',
          role: 'SDE 1',
          date: '24 Aug, 2024',
          package: '$150,000 / year',
          logo: '/logos/google.png',
          paqCompleted: false,
          topics: [
            { 
              id: '1', 
              name: 'Data Structures & Algorithms', 
              type: 'Core', 
              completed: false,
              questions: [
                { id: '1-1', text: 'Implement a binary search algorithm', difficulty: 'Easy', completed: false, frequency: 'High' },
                { id: '1-2', text: 'Find the kth largest element in an array', difficulty: 'Medium', completed: false, frequency: 'High' },
                { id: '1-3', text: 'Detect a cycle in a linked list', difficulty: 'Medium', completed: false, frequency: 'Medium' },
                { id: '1-4', text: 'Implement LRU cache', difficulty: 'Hard', completed: false, frequency: 'High' },
                { id: '1-5', text: 'Merge k sorted lists', difficulty: 'Hard', completed: false, frequency: 'Medium' }
              ]
            },
            { 
              id: '2', 
              name: 'System Design', 
              type: 'Core', 
              completed: false,
              questions: [
                { id: '2-1', text: 'Design a URL shortening service', difficulty: 'Medium', completed: false, frequency: 'High' },
                { id: '2-2', text: 'Design a Twitter-like service', difficulty: 'Hard', completed: false, frequency: 'High' },
                { id: '2-3', text: 'Design a web crawler', difficulty: 'Hard', completed: false, frequency: 'Medium' },
                { id: '2-4', text: 'Design a messaging system', difficulty: 'Medium', completed: false, frequency: 'Medium' }
              ]
            },
            { 
              id: '3', 
              name: 'Behavioral Questions', 
              type: 'Important', 
              completed: true,
              questions: [
                { id: '3-1', text: 'Tell me about a time you faced a challenge', difficulty: 'Easy', completed: true, frequency: 'High' },
                { id: '3-2', text: 'Why do you want to work at Google?', difficulty: 'Easy', completed: false, frequency: 'High' },
                { id: '3-3', text: 'Describe your biggest failure', difficulty: 'Medium', completed: false, frequency: 'Medium' },
                { id: '3-4', text: 'How do you handle conflict with team members?', difficulty: 'Medium', completed: false, frequency: 'Medium' }
              ]
            },
            { 
              id: '4', 
              name: 'Object-Oriented Design', 
              type: 'Core', 
              completed: false,
              questions: [
                { id: '4-1', text: 'Design a parking lot system', difficulty: 'Medium', completed: false, frequency: 'High' },
                { id: '4-2', text: 'Design an elevator system', difficulty: 'Medium', completed: false, frequency: 'Medium' },
                { id: '4-3', text: 'Design a chess game', difficulty: 'Hard', completed: false, frequency: 'Low' },
                { id: '4-4', text: 'Design a library management system', difficulty: 'Easy', completed: false, frequency: 'Low' }
              ]
            },
          ],
        },
        {
          _id: '2',
          company: 'Microsoft',
          role: 'Software Engineer',
          date: '15 Sep, 2024',
          package: '$120,000 / year',
          logo: '/logos/microsoft.png',
          paqCompleted: true,
          topics: [
            { 
              id: '1', 
              name: 'Data Structures & Algorithms', 
              type: 'Core', 
              completed: true,
              questions: [
                { id: '1-1', text: 'Reverse a linked list', difficulty: 'Easy', completed: true, frequency: 'High' },
                { id: '1-2', text: 'Validate binary search tree', difficulty: 'Medium', completed: false, frequency: 'High' },
                { id: '1-3', text: 'Implement trie data structure', difficulty: 'Medium', completed: false, frequency: 'Medium' },
                { id: '1-4', text: 'Solve N-Queens problem', difficulty: 'Hard', completed: false, frequency: 'Low' }
              ]
            },
            { 
              id: '2', 
              name: 'System Design', 
              type: 'Important', 
              completed: false,
              questions: [
                { id: '2-1', text: 'Design Azure blob storage', difficulty: 'Hard', completed: false, frequency: 'High' },
                { id: '2-2', text: 'Design a distributed cache', difficulty: 'Medium', completed: false, frequency: 'Medium' },
                { id: '2-3', text: 'Design API gateway', difficulty: 'Medium', completed: false, frequency: 'Medium' }
              ]
            },
            { 
              id: '3', 
              name: 'Behavioral Questions', 
              type: 'Important', 
              completed: false,
              questions: [
                { id: '3-1', text: 'What makes you a good team player?', difficulty: 'Easy', completed: false, frequency: 'High' },
                { id: '3-2', text: 'How do you stay updated with technology?', difficulty: 'Medium', completed: false, frequency: 'Medium' },
                { id: '3-3', text: 'Describe a project you are proud of', difficulty: 'Easy', completed: false, frequency: 'High' }
              ]
            },
            { 
              id: '4', 
              name: 'Cloud Computing', 
              type: 'Core', 
              completed: false,
              questions: [
                { id: '4-1', text: 'Explain microservices architecture', difficulty: 'Medium', completed: false, frequency: 'High' },
                { id: '4-2', text: 'Design serverless application', difficulty: 'Hard', completed: false, frequency: 'Medium' },
                { id: '4-3', text: 'Compare AWS vs Azure services', difficulty: 'Easy', completed: false, frequency: 'Medium' }
              ]
            },
          ],
        }
      ];

      // Simulate API call for mock data
      setTimeout(() => {
        const foundMockInterview = mockInterviews.find(i => i._id === id);
        setInterview(foundMockInterview || null);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const toggleTopic = (topicId: string) => {
    if (!interview) return;
    
    const updatedInterview = { ...interview };
    updatedInterview.topics = updatedInterview.topics.map(topic =>
      topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
    );
    setInterview(updatedInterview);
  };

  const toggleQuestion = (topicId: string, questionId: string) => {
    if (!interview) return;
    
    const updatedInterview = { ...interview };
    updatedInterview.topics = updatedInterview.topics.map(topic => {
      if (topic.id === topicId) {
        const updatedQuestions = topic.questions.map(q =>
          q.id === questionId ? { ...q, completed: !q.completed } : q
        );
        const completedCount = updatedQuestions.filter(q => q.completed).length;
        return {
          ...topic,
          questions: updatedQuestions,
          completed: completedCount === topic.questions.length
        };
      }
      return topic;
    });
    setInterview(updatedInterview);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Interview not found</p>
        <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/interviews" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              All Interviews
            </Link>
          </li>
          <li className="flex items-center">
            <span className={`mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>/</span>
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {interview.company} {interview.role} Interview
            </span>
          </li>
        </ol>
      </nav>

      {/* Interview Overview Card */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 mb-6`}>
        <div className="flex items-start space-x-6">
          {/* Company Logo/Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {interview.company.charAt(0)}
            </div>
            <p className="text-center mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {interview.company}
            </p>
          </div>
          
          {/* Interview Details */}
          <div className="flex-1">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Interview on {interview.date}
            </h1>
            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
              {interview.company} - {interview.role}
            </p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Package: {interview.package}
            </p>
          </div>
        </div>
        
        {/* PAQ Banner */}
        <div className={`mt-8 p-4 rounded-xl ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} border ${isDarkMode ? 'border-blue-700' : 'border-blue-200'}`}>
          <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-800'} font-medium`}>
            Complete your Placement Assessment Questionnaire (PAQ) for tailored tips.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg">
            Start Full Mock
          </button>
          <Link
            to={`/interview-test/${interview._id}`}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Practice Rounds
          </Link>
          <button className={`px-8 py-3 rounded-xl font-semibold border-2 transition-all transform hover:scale-105 ${
            isDarkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}>
            Add Note
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl`}>
        {/* Tab Headers */}
        <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav className="flex -mb-px">
            {[
              { key: 'topics', label: 'Topics Required' },
              { key: 'questions', label: 'Past Questions' },
              { key: 'tips', label: 'Candidate Tips' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-8 font-semibold text-base border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : isDarkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'topics' && (
            <div>
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Topics to Prepare
              </h3>
              <div className="space-y-6">
                {interview.topics.map((topic) => (
                  <div key={topic.id} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6`}>
                    {/* Topic Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={topic.completed}
                          onChange={() => toggleTopic(topic.id)}
                          className="w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        />
                        <span className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {topic.name}
                        </span>
                      </div>
                      <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                        topic.type === 'Core'
                          ? 'bg-red-100 text-red-800'
                          : topic.type === 'Important'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {topic.type}
                      </span>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-3 ml-10">
                      <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Questions ({topic.questions.filter(q => q.completed).length}/{topic.questions.length})
                      </p>
                      {topic.questions.map((question) => (
                        <div
                          key={question.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:shadow-md transition-all`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={question.completed}
                              onChange={() => toggleQuestion(topic.id, question.id)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {question.text}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getFrequencyColor(question.frequency)}`}>
                              {question.frequency}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div>
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Past Interview Questions
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                Past questions will appear here once you complete practice rounds.
              </p>
            </div>
          )}

          {activeTab === 'tips' && (
            <div>
              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Candidate Tips & Notes
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                Tips and notes will appear here as you prepare for your interview.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mock Tests Section */}
      <div className={`mt-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
        <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Available Mock Tests
        </h3>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
          Practice with company-specific mock tests tailored to your interview topics
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Full Mock Test */}
          <MockTestCard
            testId={`${interview._id}-full`}
            title={`${interview.company} Full Mock Interview`}
            company={interview.company}
            role={interview.role}
            duration={60}
            questionCount={10}
            topics={interview.topics.map(t => t.name)}
            difficulty="Hard"
          />
          
          {/* Technical Mock Test */}
          <MockTestCard
            testId={`${interview._id}-technical`}
            title={`${interview.company} Technical Assessment`}
            company={interview.company}
            role={interview.role}
            duration={45}
            questionCount={8}
            topics={interview.topics.filter(t => t.type === 'Core').map(t => t.name)}
            difficulty="Medium"
          />
          
          {/* Behavioral Mock Test */}
          <MockTestCard
            testId={`${interview._id}-behavioral`}
            title={`${interview.company} Behavioral Interview`}
            company={interview.company}
            role={interview.role}
            duration={30}
            questionCount={5}
            topics={interview.topics.filter(t => t.name.includes('Behavioral')).map(t => t.name)}
            difficulty="Easy"
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
