import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const AddInterview: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    type: 'SDE-1',
    date: '',
    package: '',
    location: '',
    mode: 'Online',
    rounds: '',
    status: 'upcoming',
    notes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.date) newErrors.date = 'Interview date is required';
    if (!formData.package.trim()) newErrors.package = 'Package is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Create a mock interview object (in a real app, this would be an API call)
    const newInterview = {
      _id: Date.now().toString(), // Generate a unique ID
      company: formData.company,
      role: formData.type,
      date: new Date(formData.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      package: formData.package,
      logo: '', // Will be generated from company name
      paqCompleted: false,
      topics: [
        { 
          id: '1', 
          name: 'Data Structures & Algorithms', 
          type: 'Core' as const, 
          completed: false,
          questions: [
            { id: '1-1', text: 'Implement a binary search algorithm', difficulty: 'Easy' as const, completed: false, frequency: 'High' as const },
            { id: '1-2', text: 'Find the kth largest element in an array', difficulty: 'Medium' as const, completed: false, frequency: 'High' as const },
            { id: '1-3', text: 'Detect a cycle in a linked list', difficulty: 'Medium' as const, completed: false, frequency: 'Medium' as const }
          ]
        },
        { 
          id: '2', 
          name: 'System Design', 
          type: 'Core' as const, 
          completed: false,
          questions: [
            { id: '2-1', text: 'Design a URL shortening service', difficulty: 'Medium' as const, completed: false, frequency: 'High' as const },
            { id: '2-2', text: 'Design a messaging system', difficulty: 'Medium' as const, completed: false, frequency: 'Medium' as const }
          ]
        },
        { 
          id: '3', 
          name: 'Behavioral Questions', 
          type: 'Important' as const, 
          completed: false,
          questions: [
            { id: '3-1', text: `Tell me about a time you faced a challenge`, difficulty: 'Easy' as const, completed: false, frequency: 'High' as const },
            { id: '3-2', text: `Why do you want to work at ${formData.company}?`, difficulty: 'Easy' as const, completed: false, frequency: 'High' as const }
          ]
        }
      ]
    };
    
    // Store the interview in localStorage for demo purposes
    const existingInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
    existingInterviews.push(newInterview);
    localStorage.setItem('interviews', JSON.stringify(existingInterviews));
    
    console.log('Created interview:', newInterview);
    
    // Navigate to the interview details page to show mock tests
    navigate(`/interviews/${newInterview._id}`);
  };

  const handleCancel = () => {
    navigate('/interviews');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} mb-4`}
          >
            ← Back to Interviews
          </button>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Add New Interview
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter the details of your upcoming interview
          </p>
        </div>

        {/* Form */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.company ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Google, Microsoft, Amazon"
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Position Title *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.position ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Software Engineer, SDE-1"
                />
                {errors.position && (
                  <p className="text-red-500 text-sm mt-1">{errors.position}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="SDE-1">SDE-1</option>
                  <option value="SDE-2">SDE-2</option>
                  <option value="SDE-3">SDE-3</option>
                  <option value="Senior SDE">Senior SDE</option>
                  <option value="Staff Engineer">Staff Engineer</option>
                  <option value="Principal Engineer">Principal Engineer</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="ML Engineer">ML Engineer</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Interview Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.date ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              {/* Package */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Package/Salary *
                </label>
                <input
                  type="text"
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.package ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., $120,000/year, 25-35 LPA"
                />
                {errors.package && (
                  <p className="text-red-500 text-sm mt-1">{errors.package}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., San Francisco, CA; Remote; Bangalore"
                />
              </div>

              {/* Mode */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Interview Mode
                </label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="Online">Online</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Phone Screen">Phone Screen</option>
                </select>
              </div>

              {/* Rounds */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Number of Rounds
                </label>
                <select
                  name="rounds"
                  value={formData.rounds}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select rounds</option>
                  <option value="1">1 Round</option>
                  <option value="2">2 Rounds</option>
                  <option value="3">3 Rounds</option>
                  <option value="4">4 Rounds</option>
                  <option value="5">5+ Rounds</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="offer">Offer Received</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Any additional information about the interview..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Create Interview
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={`px-8 py-3 rounded-xl font-semibold border-2 transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInterview;
