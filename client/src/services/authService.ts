import { User } from '../types';

// Mock user data for development
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  mobile: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  bio: 'Software Engineer passionate about building great products.',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  portfolio: 'https://johndoe.dev',
  profile: {
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Software Engineer with 5+ years of experience in full-stack development.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
    experience: '5 years'
  },
  stats: {
    totalInterviews: 25,
    completedTests: 18,
    averageScore: 85,
    totalTimeSpent: 1200
  }
};

export const authService = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - accept any email/password for demo
    if (email && password) {
      return {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    throw new Error('Invalid credentials');
  },

  register: async (name: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration
    if (name && email && password) {
      return {
        user: { ...mockUser, name, email },
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    throw new Error('Registration failed');
  },

  getProfile: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user is "logged in" (has token)
    const token = localStorage.getItem('token');
    if (token) {
      return { user: mockUser };
    }
    
    throw new Error('Not authenticated');
  },

  updateProfile: async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock profile update
    return { user: { ...mockUser, ...data } };
  }
};
