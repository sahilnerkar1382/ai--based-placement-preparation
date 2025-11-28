export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  location?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  profile: {
    avatar: string;
    bio: string;
    skills: string[];
    experience: string;
  };
  stats: {
    totalInterviews: number;
    completedTests: number;
    averageScore: number;
    totalTimeSpent: number;
  };
}

export interface Interview {
  _id: string;
  user: string;
  company: {
    name: string;
    logo: string;
  };
  position: {
    title: string;
    type: string;
    level: string;
  };
  details: {
    date: string;
    package: number;
    location: string;
    mode: string;
  };
  status: string;
  rounds: Array<{
    type: string;
    date: string;
    status: string;
    feedback: string;
    score: number;
  }>;
  topics: Array<{
    name: string;
    category: string;
    completed: boolean;
  }>;
  notes: Array<{
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Test {
  _id: string;
  user: string;
  title: string;
  type: string;
  company: string;
  questions: Question[];
  duration: number;
  totalQuestions: number;
  results: {
    score: number;
    maxScore: number;
    correctAnswers: number;
    incorrectAnswers: number;
    percentile: number;
    timeTaken: number;
    topicBreakdown: Array<{
      topic: string;
      score: number;
      totalQuestions: number;
      correctAnswers: number;
    }>;
  };
  status: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  text: string;
  type: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  topic: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface ResumeData {
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    portfolioUrl: string;
  };
  education: Array<{
    school: string;
    degree: string;
    duration: string;
    gpa?: string;
    achievements?: string[];
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    achievements?: string[];
  }>;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    duration: string;
  }>;
}
