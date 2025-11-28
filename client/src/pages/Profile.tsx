import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    location: user?.location || '',
    bio: user?.bio || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    portfolio: user?.portfolio || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the user profile
    console.log('Updating profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      location: user?.location || '',
      bio: user?.bio || '',
      linkedin: user?.linkedin || '',
      github: user?.github || '',
      portfolio: user?.portfolio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Profile
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
          {/* Profile Header */}
          <div className={`p-8 ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-blue-600">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold text-white mb-1`}>
                  {user?.name}
                </h2>
                <p className="text-blue-100">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="+1 (555) 123-4567"
                    />
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
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Portfolio */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Save Changes
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
            ) : (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Full Name
                      </p>
                      <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Email Address
                      </p>
                      <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user?.email || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Mobile Number
                      </p>
                      <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user?.mobile || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Location
                      </p>
                      <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user?.location || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {user?.bio && (
                  <div>
                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      About Me
                    </h3>
                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user.bio}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Social Profiles
                  </h3>
                  <div className="space-y-3">
                    {user?.linkedin && (
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💼</span>
                        <a
                          href={user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-lg ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {user?.github && (
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🐙</span>
                        <a
                          href={user.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-lg ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                          GitHub Profile
                        </a>
                      </div>
                    )}
                    {user?.portfolio && (
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🌐</span>
                        <a
                          href={user.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-lg ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                          Portfolio Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
