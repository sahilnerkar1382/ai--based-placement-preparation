import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Topic {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalQuestions: number;
  completedQuestions: number;
  subtopics: Subtopic[];
}

interface Subtopic {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hasVideo: boolean;
  videoUrl?: string;
  completed: boolean;
}

const CompanyQuestions: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { isDarkMode } = useTheme();
  const [companyName, setCompanyName] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockCompanyData: { [key: string]: { name: string; topics: Topic[] } } = {
      '1': {
        name: 'Google',
        topics: [
          {
            id: '1',
            name: 'Arrays & Hashing',
            description: 'Master array manipulation and hash table techniques',
            progress: 65,
            totalQuestions: 15,
            completedQuestions: 10,
            subtopics: [
              { id: '1-1', name: 'Two Pointers', difficulty: 'Easy', hasVideo: true, videoUrl: 'https://example.com/video1', completed: true },
              { id: '1-2', name: 'Sliding Window', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video2', completed: true },
              { id: '1-3', name: 'Hash Maps', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video3', completed: false },
              { id: '1-4', name: 'Cyclic Sort', difficulty: 'Easy', hasVideo: false, completed: false },
              { id: '1-5', name: 'Tree Breadth First Search', difficulty: 'Easy', hasVideo: true, videoUrl: 'https://example.com/video5', completed: true }
            ]
          },
          {
            id: '2',
            name: 'Advanced Data Structures',
            description: 'Complex data structures and their applications',
            progress: 40,
            totalQuestions: 20,
            completedQuestions: 8,
            subtopics: [
              { id: '2-1', name: 'Tree Depth First Search', difficulty: 'Easy', hasVideo: true, videoUrl: 'https://example.com/video6', completed: true },
              { id: '2-2', name: 'Tries', difficulty: 'Hard', hasVideo: true, videoUrl: 'https://example.com/video7', completed: false },
              { id: '2-3', name: 'Heap', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video8', completed: false },
              { id: '2-4', name: 'Binary Search', difficulty: 'Easy', hasVideo: true, videoUrl: 'https://example.com/video9', completed: true }
            ]
          },
          {
            id: '3',
            name: 'System Design Basics',
            description: 'Fundamental concepts for system design interviews',
            progress: 25,
            totalQuestions: 12,
            completedQuestions: 3,
            subtopics: [
              { id: '3-1', name: 'Load Balancer', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video10', completed: false },
              { id: '3-2', name: 'Caching', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video11', completed: false },
              { id: '3-3', name: 'Data Partitioning', difficulty: 'Hard', hasVideo: true, videoUrl: 'https://example.com/video12', completed: false },
              { id: '3-4', name: 'CDN', difficulty: 'Easy', hasVideo: false, completed: true }
            ]
          }
        ]
      },
      '2': {
        name: 'Microsoft',
        topics: [
          {
            id: '1',
            name: 'Dynamic Programming',
            description: 'Master DP patterns and problem-solving techniques',
            progress: 50,
            totalQuestions: 18,
            completedQuestions: 9,
            subtopics: [
              { id: '1-1', name: '0/1 Knapsack', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video13', completed: true },
              { id: '1-2', name: 'Unbounded Knapsack', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video14', completed: false },
              { id: '1-3', name: 'Fibonacci Numbers', difficulty: 'Easy', hasVideo: true, videoUrl: 'https://example.com/video15', completed: true }
            ]
          },
          {
            id: '2',
            name: 'Graph Algorithms',
            description: 'Essential graph traversal and pathfinding algorithms',
            progress: 30,
            totalQuestions: 14,
            completedQuestions: 4,
            subtopics: [
              { id: '2-1', name: 'BFS', difficulty: 'Easy', hasVideo: true, videoUrl: 'https://example.com/video16', completed: true },
              { id: '2-2', name: 'DFS', difficulty: 'Easy', hasVideo: true, videoUrl: 'https://example.com/video17', completed: false },
              { id: '2-3', name: 'Dijkstra\'s Algorithm', difficulty: 'Hard', hasVideo: true, videoUrl: 'https://example.com/video18', completed: false }
            ]
          }
        ]
      },
      '3': {
        name: 'Amazon',
        topics: [
          {
            id: '1',
            name: 'String Manipulation',
            description: 'Common string processing patterns and algorithms',
            progress: 70,
            totalQuestions: 16,
            completedQuestions: 11,
            subtopics: [
              { id: '1-1', name: 'String Reversal', difficulty: 'Easy', hasVideo: true, videoUrl: 'https://example.com/video19', completed: true },
              { id: '1-2', name: 'Anagrams', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video20', completed: true },
              { id: '1-3', name: 'Longest Substring', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video21', completed: false }
            ]
          },
          {
            id: '2',
            name: 'Tree Algorithms',
            description: 'Binary tree operations and advanced tree structures',
            progress: 45,
            totalQuestions: 20,
            completedQuestions: 9,
            subtopics: [
              { id: '2-1', name: 'Binary Tree Traversal', difficulty: 'Easy', hasVideo: true, videoUrl: 'https://example.com/video22', completed: true },
              { id: '2-2', name: 'BST Operations', difficulty: 'Medium', hasVideo: true, videoUrl: 'https://example.com/video23', completed: false },
              { id: '2-3', name: 'Balanced Trees', difficulty: 'Hard', hasVideo: true, videoUrl: 'https://example.com/video24', completed: false }
            ]
          }
        ]
      }
    };

    // Simulate API call
    setTimeout(() => {
      const data = mockCompanyData[companyId || '1'];
      if (data) {
        setCompanyName(data.name);
        setTopics(data.topics);
      }
      setLoading(false);
    }, 500);
  }, [companyId]);

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

  const toggleSubtopicCompletion = (topicId: string, subtopicId: string) => {
    setTopics(prevTopics => 
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          const updatedSubtopics = topic.subtopics.map(subtopic => 
            subtopic.id === subtopicId 
              ? { ...subtopic, completed: !subtopic.completed }
              : subtopic
          );
          const completedCount = updatedSubtopics.filter(st => st.completed).length;
          return {
            ...topic,
            subtopics: updatedSubtopics,
            completedQuestions: completedCount,
            progress: Math.round((completedCount / topic.totalQuestions) * 100)
          };
        }
        return topic;
      })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link 
            to="/dashboard" 
            className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ← Back to Dashboard
          </Link>
        </div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          {companyName} Interview Questions
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Master the topics and questions commonly asked in {companyName} interviews
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <div key={topic.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
            {/* Topic Header */}
            <div className={`p-6 ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                {topic.name}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                {topic.description}
              </p>
              
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Progress
                  </span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {topic.completedQuestions}/{topic.totalQuestions} questions
                  </span>
                </div>
                <div className={`w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${topic.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Subtopics List */}
            <div className="p-6">
              <div className="space-y-3">
                {topic.subtopics.map((subtopic) => (
                  <div 
                    key={subtopic.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-md transition-all`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={subtopic.completed}
                        onChange={() => toggleSubtopicCompletion(topic.id, subtopic.id)}
                        className="w-5 h-5 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <div>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {subtopic.name}
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(subtopic.difficulty)}`}>
                            {subtopic.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {subtopic.hasVideo && (
                        <button
                          onClick={() => {
                            // In a real app, this would open the video modal or navigate to video page
                            window.open(subtopic.videoUrl, '_blank');
                          }}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            isDarkMode 
                              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                              : 'bg-purple-500 hover:bg-purple-600 text-white'
                          }`}
                        >
                          🎬 Watch Video
                        </button>
                      )}
                      {!subtopic.hasVideo && (
                        <span className={`px-4 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          No Video
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress Summary */}
      <div className={`mt-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Overall Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {topics.reduce((acc, topic) => acc + topic.completedQuestions, 0)}
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Questions Completed
            </p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {topics.reduce((acc, topic) => acc + topic.totalQuestions, 0)}
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Total Questions
            </p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {Math.round(topics.reduce((acc, topic) => acc + topic.progress, 0) / topics.length)}%
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Average Progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyQuestions;
