// Mock test data for development
const mockTests = [
  {
    _id: '1',
    user: '1',
    title: 'JavaScript Fundamentals',
    type: 'technical',
    company: 'General',
    questions: [
      {
        text: 'What is the output of `typeof null` in JavaScript?',
        type: 'multiple-choice',
        options: [
          { text: '"null"', isCorrect: true },
          { text: '"undefined"', isCorrect: false },
          { text: '"object"', isCorrect: false },
          { text: '"number"', isCorrect: false }
        ],
        correctAnswer: '"object"',
        explanation: 'In JavaScript, typeof null returns "object" due to a historical bug.',
        difficulty: 'easy',
        topic: 'JavaScript Basics'
      },
      {
        text: 'Which method is used to add an element to the end of an array?',
        type: 'multiple-choice',
        options: [
          { text: 'push()', isCorrect: true },
          { text: 'pop()', isCorrect: false },
          { text: 'shift()', isCorrect: false },
          { text: 'unshift()', isCorrect: false }
        ],
        correctAnswer: 'push()',
        explanation: 'The push() method adds one or more elements to the end of an array.',
        difficulty: 'easy',
        topic: 'Arrays'
      }
    ],
    duration: 30,
    totalQuestions: 20,
    results: {
      score: 85,
      maxScore: 100,
      correctAnswers: 17,
      incorrectAnswers: 3,
      percentile: 85,
      timeTaken: 25,
      topicBreakdown: [
        {
          topic: 'JavaScript Basics',
          score: 90,
          totalQuestions: 10,
          correctAnswers: 9
        },
        {
          topic: 'Arrays',
          score: 80,
          totalQuestions: 10,
          correctAnswers: 8
        }
      ]
    },
    status: 'completed',
    completedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    user: '1',
    title: 'React Components',
    type: 'technical',
    company: 'General',
    questions: [
      {
        text: 'What hook is used to manage state in functional components?',
        type: 'multiple-choice',
        options: [
          { text: 'useState', isCorrect: true },
          { text: 'useEffect', isCorrect: false },
          { text: 'useContext', isCorrect: false },
          { text: 'useReducer', isCorrect: false }
        ],
        correctAnswer: 'useState',
        explanation: 'useState is the hook used to add state to functional components.',
        difficulty: 'medium',
        topic: 'React Hooks'
      }
    ],
    duration: 45,
    totalQuestions: 25,
    results: {
      score: 0,
      maxScore: 100,
      correctAnswers: 0,
      incorrectAnswers: 0,
      percentile: 0,
      timeTaken: 0,
      topicBreakdown: [
        {
          topic: 'React Hooks',
          score: 0,
          totalQuestions: 25,
          correctAnswers: 0
        }
      ]
    },
    status: 'in-progress',
    startedAt: '2024-01-20T14:00:00Z',
    createdAt: '2024-01-20T13:30:00Z',
    updatedAt: '2024-01-20T14:00:00Z'
  },
  {
    _id: '3',
    user: '1',
    title: 'Problem Solving',
    type: 'aptitude',
    company: 'General',
    questions: [
      {
        text: 'If a train travels 300 miles in 3 hours, what is its average speed?',
        type: 'multiple-choice',
        options: [
          { text: '100 mph', isCorrect: true },
          { text: '90 mph', isCorrect: false },
          { text: '110 mph', isCorrect: false },
          { text: '95 mph', isCorrect: false }
        ],
        correctAnswer: '100 mph',
        explanation: 'Speed = Distance / Time = 300 miles / 3 hours = 100 mph.',
        difficulty: 'easy',
        topic: 'Basic Arithmetic'
      }
    ],
    duration: 60,
    totalQuestions: 30,
    results: {
      score: 0,
      maxScore: 100,
      correctAnswers: 0,
      incorrectAnswers: 0,
      percentile: 0,
      timeTaken: 0,
      topicBreakdown: [
        {
          topic: 'Basic Arithmetic',
          score: 0,
          totalQuestions: 30,
          correctAnswers: 0
        }
      ]
    },
    status: 'not-started',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  }
];

export const testService = {
  getTests: async (params?: { type?: string; status?: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredTests = mockTests;
    
    if (params?.type) {
      filteredTests = filteredTests.filter(test => test.type === params.type);
    }
    
    if (params?.status) {
      filteredTests = filteredTests.filter(test => test.status === params.status);
    }
    
    return filteredTests;
  },

  getTest: async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const test = mockTests.find(t => t._id === id);
    if (!test) {
      throw new Error('Test not found');
    }
    
    return test;
  },

  createTest: async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTest = {
      _id: Date.now().toString(),
      user: '1',
      ...data,
      questions: data.questions || [],
      results: {
        score: 0,
        maxScore: 100,
        correctAnswers: 0,
        incorrectAnswers: 0,
        percentile: 0,
        timeTaken: 0
      },
      status: 'not-started',
      createdAt: new Date().toISOString()
    };
    
    return newTest;
  },

  startTest: async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const test = mockTests.find(t => t._id === id);
    if (!test) {
      throw new Error('Test not found');
    }
    
    return {
      ...test,
      status: 'in-progress',
      startedAt: new Date().toISOString()
    };
  },

  submitTest: async (id: string, answers: any[], timeTaken: number) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calculate mock score
    const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
    
    return {
      testId: id,
      score,
      answers,
      timeTaken,
      completedAt: new Date().toISOString(),
      passed: score >= 80
    };
  }
};
