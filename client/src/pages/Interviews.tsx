import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { interviewService } from '../services/interviewService';
import { Interview } from '../types';

const Interviews: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const interviews = await interviewService.getInterviews();
        setInterviews(interviews);
      } catch (error) {
        console.error('Failed to fetch interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          All Interviews
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage and track your upcoming interviews
        </p>
      </div>

      {interviews.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl`}>
          <div className="text-6xl mb-4">📋</div>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            No interviews yet
          </h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Start by adding your first interview to track your preparation
          </p>
          <button 
            onClick={() => navigate('/interviews/add')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Add Interview
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <Link
              key={interview._id}
              to={`/interviews/${interview._id}`}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {interview.company.name.charAt(0)}
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  interview.status === 'upcoming'
                    ? 'bg-green-100 text-green-800'
                    : interview.status === 'completed'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {interview.status}
                </span>
              </div>
              
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                {interview.company.name}
              </h3>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                {interview.position.title}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                {new Date(interview.details.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
              
              <div className={`flex items-center justify-between pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  ${interview.details.package.toLocaleString()}/year
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Floating Add Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => navigate('/interviews/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          title="Add New Interview"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Interviews;
