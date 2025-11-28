import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { interviewService } from '../services/interviewService';
import { Interview } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedDate, setSelectedDate] = useState('All Dates');
  const [selectedPackage, setSelectedPackage] = useState('All Packages');

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const interviews = await interviewService.getInterviews();
        setInterviews(interviews || []);
      } catch (error) {
        console.error('Failed to fetch interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Mock data for interviews based on the design
  const mockInterviews = [
    {
      _id: '1',
      company: 'Google',
      position: 'Software Engineer',
      type: 'SDE-1',
      status: 'Scheduled',
      date: '2024-12-15',
      logo: '🔍',
      package: '35-45 LPA',
      difficulty: 'Hard'
    },
    {
      _id: '2', 
      company: 'Microsoft',
      position: 'Software Engineer',
      type: 'SDE-2',
      status: 'Completed',
      date: '2024-12-10',
      logo: '🪟',
      package: '25-35 LPA',
      difficulty: 'Medium'
    },
    {
      _id: '3',
      company: 'Amazon',
      position: 'Software Developer',
      type: 'SDE-1',
      status: 'Scheduled',
      date: '2024-12-20',
      logo: '📦',
      package: '20-30 LPA',
      difficulty: 'Medium'
    }
  ];

  const displayInterviews = mockInterviews;

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-6 py-4">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PrepDash</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
          {/* Filters */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 mb-6`}>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option>All Roles</option>
                <option>SDE-1</option>
                <option>SDE-2</option>
                <option>SDE-3</option>
              </select>

              <select 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option>All Dates</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
              </select>

              <select 
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option>All Packages</option>
                <option>10-20 LPA</option>
                <option>20-30 LPA</option>
                <option>30-40 LPA</option>
                <option>40+ LPA</option>
              </select>

              <button className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                Search
              </button>
            </div>
          </div>

          {/* Interview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayInterviews.map((interview) => (
              <div key={interview._id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                {/* Company Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center text-2xl`}>
                      {interview.logo}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{interview.company}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{interview.position}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    interview.status === 'Scheduled' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {interview.status}
                  </span>
                </div>

                {/* Interview Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role:</span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{interview.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Package:</span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{interview.package}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date:</span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{interview.date}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link 
                    to={`/company/${interview._id}/questions`}
                    className={`flex-1 px-4 py-2 rounded-lg text-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                  >
                    View Details
                  </Link>
                  <button className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Interview Button */}
          <div className="mt-6">
            <Link 
              to="/interviews/add"
              className={`inline-flex items-center px-6 py-3 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              <span className="mr-2">+</span> Add New Interview
            </Link>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
