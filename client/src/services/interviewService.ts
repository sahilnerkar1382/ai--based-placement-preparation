// Mock interview data for development
const mockInterviews = [
  {
    _id: '1',
    user: '1',
    company: {
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
    },
    position: {
      title: 'Software Engineer',
      type: 'Full-time',
      level: 'Senior'
    },
    details: {
      date: '2024-02-01T15:00:00Z',
      package: 250000,
      location: 'Mountain View, CA',
      mode: 'On-site'
    },
    status: 'upcoming',
    rounds: [
      {
        type: 'Technical',
        date: '2024-02-01T15:00:00Z',
        status: 'scheduled',
        feedback: '',
        score: 0
      },
      {
        type: 'Behavioral',
        date: '2024-02-01T17:00:00Z',
        status: 'scheduled',
        feedback: '',
        score: 0
      }
    ],
    topics: [
      {
        name: 'Data Structures',
        category: 'Technical',
        completed: false
      },
      {
        name: 'Algorithms',
        category: 'Technical',
        completed: false
      },
      {
        name: 'System Design',
        category: 'Technical',
        completed: false
      },
      {
        name: 'Team Collaboration',
        category: 'Behavioral',
        completed: false
      }
    ],
    notes: [
      {
        content: 'Prepare for system design questions',
        createdAt: '2024-01-25T10:00:00Z'
      }
    ],
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  },
  {
    _id: '2',
    user: '1',
    company: {
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
    },
    position: {
      title: 'Frontend Developer',
      type: 'Full-time',
      level: 'Mid-level'
    },
    details: {
      date: '2024-01-15T14:00:00Z',
      package: 180000,
      location: 'Redmond, WA',
      mode: 'Remote'
    },
    status: 'completed',
    rounds: [
      {
        type: 'Technical',
        date: '2024-01-15T14:00:00Z',
        status: 'completed',
        feedback: 'Strong React skills, good problem solving',
        score: 85
      },
      {
        type: 'Behavioral',
        date: '2024-01-15T16:00:00Z',
        status: 'completed',
        feedback: 'Good cultural fit, communication skills need improvement',
        score: 75
      }
    ],
    topics: [
      {
        name: 'React',
        category: 'Technical',
        completed: true
      },
      {
        name: 'JavaScript',
        category: 'Technical',
        completed: true
      },
      {
        name: 'CSS',
        category: 'Technical',
        completed: true
      },
      {
        name: 'Communication',
        category: 'Behavioral',
        completed: true
      }
    ],
    notes: [
      {
        content: 'Good performance on React questions',
        createdAt: '2024-01-15T15:00:00Z'
      },
      {
        content: 'Need to improve system design knowledge',
        createdAt: '2024-01-15T17:00:00Z'
      }
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T17:00:00Z'
  },
  {
    _id: '3',
    user: '1',
    company: {
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
    },
    position: {
      title: 'Full Stack Developer',
      type: 'Full-time',
      level: 'Mid-level'
    },
    details: {
      date: '2024-01-10T10:00:00Z',
      package: 200000,
      location: 'Seattle, WA',
      mode: 'Hybrid'
    },
    status: 'completed',
    rounds: [
      {
        type: 'Technical',
        date: '2024-01-10T10:00:00Z',
        status: 'completed',
        feedback: 'Excellent problem solving skills',
        score: 90
      },
      {
        type: 'Behavioral',
        date: '2024-01-10T12:00:00Z',
        status: 'completed',
        feedback: 'Strong leadership qualities',
        score: 88
      }
    ],
    topics: [
      {
        name: 'AWS',
        category: 'Technical',
        completed: true
      },
      {
        name: 'Node.js',
        category: 'Technical',
        completed: true
      },
      {
        name: 'Databases',
        category: 'Technical',
        completed: true
      },
      {
        name: 'Leadership',
        category: 'Behavioral',
        completed: true
      }
    ],
    notes: [
      {
        content: 'Strong problem-solving skills',
        createdAt: '2024-01-10T11:00:00Z'
      },
      {
        content: 'Good cultural fit',
        createdAt: '2024-01-10T13:00:00Z'
      }
    ],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-10T13:00:00Z'
  }
];

export const interviewService = {
  getInterviews: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockInterviews;
  },

  getInterview: async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const interview = mockInterviews.find(i => i._id === id);
    if (!interview) {
      throw new Error('Interview not found');
    }
    
    return interview;
  },

  createInterview: async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newInterview = {
      _id: Date.now().toString(),
      ...data,
      status: 'upcoming',
      notes: [],
      createdAt: new Date().toISOString()
    };
    
    return newInterview;
  },

  updateInterview: async (id: string, data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const interview = mockInterviews.find(i => i._id === id);
    if (!interview) {
      throw new Error('Interview not found');
    }
    
    return { ...interview, ...data, updatedAt: new Date().toISOString() };
  },

  deleteInterview: async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockInterviews.findIndex(i => i._id === id);
    if (index === -1) {
      throw new Error('Interview not found');
    }
    
    return { success: true };
  },

  addNote: async (interviewId: string, content: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const interview = mockInterviews.find(i => i._id === interviewId);
    if (!interview) {
      throw new Error('Interview not found');
    }
    
    const newNote = {
      content,
      createdAt: new Date().toISOString()
    };
    
    return {
      ...interview,
      notes: [...interview.notes, newNote]
    };
  }
};
