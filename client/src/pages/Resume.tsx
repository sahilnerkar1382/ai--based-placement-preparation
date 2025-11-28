import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ResumeData } from '../types';
import { resumeService } from '../services/resumeService';

const Resume: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    contactInfo: {
      fullName: '',
      email: '',
      phone: '',
      portfolioUrl: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: []
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    portfolioUrl: ''
  });
  const [educationData, setEducationData] = useState({
    school: '',
    degree: '',
    duration: '',
    gpa: '',
    achievements: ''
  });
  const [experienceData, setExperienceData] = useState({
    company: '',
    position: '',
    duration: '',
    description: '',
    achievements: ''
  });
  const [skillsData, setSkillsData] = useState({
    name: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    category: ''
  });
  const [projectsData, setProjectsData] = useState({
    name: '',
    description: '',
    technologies: '',
    link: '',
    duration: ''
  });
  const [isDragging, setIsDragging] = useState(false);

  const steps = [
    'Contact Information',
    'Education', 
    'Experience',
    'Skills',
    'Projects'
  ];

  useEffect(() => {
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    try {
      const result = await resumeService.getResumeData();
      if (result.success && result.data) {
        setResumeData(result.data);
        setFormData(result.data.contactInfo);
      }
    } catch (error) {
      console.error('Failed to load resume data:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      alert('Please upload a PDF or DOC file');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await resumeService.uploadResume(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        setResumeFile(file);
        setResumeUrl(result.resumeUrl || '');
        
        // If enhanced data is available, update the resume
        if (result.enhancedData) {
          setResumeData(result.enhancedData);
          setFormData(result.enhancedData.contactInfo);
          
          // Show success message with enhancement details
          const enhancedSections = [];
          if (result.enhancedData.education && result.enhancedData.education.length > 0) {
            enhancedSections.push(`${result.enhancedData.education.length} enhanced education entries`);
          }
          if (result.enhancedData.experience && result.enhancedData.experience.length > 0) {
            enhancedSections.push(`${result.enhancedData.experience.length} enhanced experience entries`);
          }
          if (result.enhancedData.skills && result.enhancedData.skills.length > 0) {
            enhancedSections.push(`${result.enhancedData.skills.length} optimized skills`);
          }
          if (result.enhancedData.projects && result.enhancedData.projects.length > 0) {
            enhancedSections.push(`${result.enhancedData.projects.length} highlighted projects`);
          }
          
          alert(`✅ Resume uploaded and enhanced successfully!\n\n🤖 AI-powered improvements:\n• ${enhancedSections.join('\n• ')}\n\nNavigate through the steps to review your enhanced resume with:\n• Stronger action verbs\n• Quantified achievements\n• Optimized skill descriptions\n• Professional formatting\n\nYour resume is now ready to impress!`);
        } else {
          alert('Resume uploaded successfully!');
        }
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setResumeData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
  };

  const handleImportLinkedIn = async () => {
    setLoading(true);
    try {
      const result = await resumeService.importFromLinkedIn();
      
      if (result.success && result.data) {
        const importedData = result.data;
        
        // Update contact info form
        if (importedData.contactInfo) {
          setFormData(importedData.contactInfo);
        }
        
        // Update resume data with all imported sections
        setResumeData(prev => ({
          contactInfo: importedData.contactInfo || prev.contactInfo,
          education: importedData.education || prev.education,
          experience: importedData.experience || prev.experience,
          skills: importedData.skills || prev.skills,
          projects: importedData.projects || prev.projects
        }));
        
        // Show success message with details
        const importedSections = [];
        if (importedData.contactInfo) importedSections.push('Contact Information');
        if (importedData.education && importedData.education.length > 0) importedSections.push(`${importedData.education.length} Education entries`);
        if (importedData.experience && importedData.experience.length > 0) importedSections.push(`${importedData.experience.length} Experience entries`);
        if (importedData.skills && importedData.skills.length > 0) importedSections.push(`${importedData.skills.length} Skills`);
        if (importedData.projects && importedData.projects.length > 0) importedSections.push(`${importedData.projects.length} Projects`);
        
        alert(`LinkedIn data imported successfully!\n\nImported:\n• ${importedSections.join('\n• ')}\n\nNavigate through the steps to review and edit the imported data.`);
        
        // Navigate to first step to show imported contact info
        setActiveStep(0);
      } else {
        alert(result.error || 'Import failed');
      }
    } catch (error) {
      alert('Import failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async () => {
    setLoading(true);
    try {
      const result = await resumeService.saveResumeData(resumeData);
      
      if (result.success) {
        alert('Resume saved successfully!');
      } else {
        alert(result.error || 'Save failed');
      }
    } catch (error) {
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContactInfo = () => {
    setResumeData(prev => ({
      ...prev,
      contactInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        portfolioUrl: formData.portfolioUrl
      }
    }));
    // Move to next step after saving
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      // Check if resume has required data
      if (!resumeData.contactInfo.fullName) {
        alert('Please fill in your name to generate a resume');
        return;
      }

      // Generate HTML content for the resume
      const resumeHTML = generateResumeHTML(resumeData);
      
      // Create a temporary HTML document
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${resumeData.contactInfo.fullName}'s Resume</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
                color: #333;
                line-height: 1.6;
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .name {
                font-size: 28px;
                font-weight: bold;
                margin: 0;
              }
              .contact-info {
                font-size: 14px;
                color: #666;
                margin: 5px 0;
              }
              .section {
                margin-bottom: 25px;
              }
              .section-title {
                font-size: 18px;
                font-weight: bold;
                border-bottom: 1px solid #333;
                padding-bottom: 5px;
                margin-bottom: 15px;
                text-transform: uppercase;
              }
              .item {
                margin-bottom: 15px;
              }
              .item-title {
                font-weight: bold;
                margin-bottom: 3px;
              }
              .item-subtitle {
                font-style: italic;
                color: #666;
                font-size: 14px;
                margin-bottom: 5px;
              }
              .item-details {
                font-size: 14px;
                margin-bottom: 3px;
              }
              .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
              }
              .skill-item {
                background: #f5f5f5;
                padding: 5px 10px;
                border-radius: 3px;
                font-size: 14px;
              }
              .projects-list {
                list-style: none;
                padding: 0;
              }
              .project-item {
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
              }
              .project-item:last-child {
                border-bottom: none;
              }
              @media print {
                body { margin: 0; padding: 10px; }
                .header { page-break-after: avoid; }
                .section { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            ${resumeHTML}
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              }
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateResumeHTML = (data: any) => {
    return `
      <div class="header">
        <h1 class="name">${data.contactInfo.fullName || 'Your Name'}</h1>
        <div class="contact-info">
          ${data.contactInfo.email ? `📧 ${data.contactInfo.email}` : ''}
          ${data.contactInfo.phone ? `📱 ${data.contactInfo.phone}` : ''}
          ${data.contactInfo.portfolioUrl ? `🌐 ${data.contactInfo.portfolioUrl}` : ''}
        </div>
      </div>

      ${data.education.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${data.education.map((edu: any) => `
            <div class="item">
              <div class="item-title">${edu.school}</div>
              <div class="item-subtitle">${edu.degree} • ${edu.duration}</div>
              ${edu.gpa ? `<div class="item-details">GPA: ${edu.gpa}</div>` : ''}
              ${edu.achievements ? `<div class="item-details">${edu.achievements}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.experience.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${data.experience.map((exp: any) => `
            <div class="item">
              <div class="item-title">${exp.position}</div>
              <div class="item-subtitle">${exp.company} • ${exp.duration}</div>
              ${exp.description ? `<div class="item-details">${exp.description}</div>` : ''}
              ${exp.achievements ? `<div class="item-details">${exp.achievements}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">
            ${data.skills.map((skill: any) => `
              <div class="skill-item">
                ${skill.name} • ${skill.level} ${skill.category ? `• ${skill.category}` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${data.projects.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          <div class="projects-list">
            ${data.projects.map((project: any) => `
              <div class="project-item">
                <div class="item-title">${project.name}</div>
                <div class="item-subtitle">${project.duration}</div>
                ${project.description ? `<div class="item-details">${project.description}</div>` : ''}
                ${project.technologies ? `<div class="item-details"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
                ${project.link ? `<div class="item-details"><strong>Link:</strong> ${project.link}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  };

  const handleGetAISuggestions = async (section: string) => {
    setLoading(true);
    try {
      const result = await resumeService.getAISuggestions(section, '');
      
      if (result.success && result.suggestions) {
        setAiSuggestions(result.suggestions);
        setShowSuggestions(true);
      } else {
        alert(result.error || 'Failed to get suggestions');
      }
    } catch (error) {
      alert('Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    // In a real app, this would apply the suggestion to the relevant section
    alert(`Applied suggestion: ${suggestion}`);
    setShowSuggestions(false);
  };

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCreateNewResume = () => {
    setResumeData({
      contactInfo: {
        fullName: '',
        email: '',
        phone: '',
        portfolioUrl: ''
      },
      education: [],
      experience: [],
      skills: [],
      projects: []
    });
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      portfolioUrl: ''
    });
    setEducationData({
      school: '',
      degree: '',
      duration: '',
      gpa: '',
      achievements: ''
    });
    setExperienceData({
      company: '',
      position: '',
      duration: '',
      description: '',
      achievements: ''
    });
    setSkillsData({
      name: '',
      level: 'Beginner',
      category: ''
    });
    setProjectsData({
      name: '',
      description: '',
      technologies: '',
      link: '',
      duration: ''
    });
    setActiveStep(0);
  };

  const handleEducationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExperienceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSkillsData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProjectsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectsData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEducation = () => {
    if (educationData.school && educationData.degree) {
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, {
          school: educationData.school,
          degree: educationData.degree,
          duration: educationData.duration,
          gpa: educationData.gpa,
          achievements: educationData.achievements ? educationData.achievements.split(',').map(a => a.trim()) : []
        }]
      }));
      setEducationData({
        school: '',
        degree: '',
        duration: '',
        gpa: '',
        achievements: ''
      });
    }
  };

  const handleAddExperience = () => {
    if (experienceData.company && experienceData.position) {
      setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, {
          company: experienceData.company,
          position: experienceData.position,
          duration: experienceData.duration,
          description: experienceData.description,
          achievements: experienceData.achievements ? experienceData.achievements.split(',').map(a => a.trim()) : []
        }]
      }));
      setExperienceData({
        company: '',
        position: '',
        duration: '',
        description: '',
        achievements: ''
      });
    }
  };

  const handleAddSkill = () => {
    if (skillsData.name && skillsData.category) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, {
          name: skillsData.name,
          level: skillsData.level,
          category: skillsData.category
        }]
      }));
      setSkillsData({
        name: '',
        level: 'Beginner',
        category: ''
      });
    }
  };

  const handleAddProject = () => {
    if (projectsData.name && projectsData.description) {
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, {
          name: projectsData.name,
          description: projectsData.description,
          technologies: projectsData.technologies.split(',').map(t => t.trim()),
          link: projectsData.link,
          duration: projectsData.duration
        }]
      }));
      setProjectsData({
        name: '',
        description: '',
        technologies: '',
        link: '',
        duration: ''
      });
    }
  };

  const renderFormSection = () => {
    switch (activeStep) {
      case 0: // Contact Information
        return (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h2>
              <button
                onClick={() => handleGetAISuggestions('contact')}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white disabled:opacity-50`}
              >
                {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveContactInfo}
                disabled={loading || !formData.fullName || !formData.email}
                className={`px-6 py-2 rounded-lg ${
                  loading || !formData.fullName || !formData.email
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          </div>
        );

      case 1: // Education
        return (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Education
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleGetAISuggestions('education')}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white disabled:opacity-50`}
                >
                  {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
                </button>
                <button 
                  onClick={handleAddEducation}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50`}
                >
                  Add Education
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  School
                </label>
                <input
                  type="text"
                  name="school"
                  value={educationData.school}
                  onChange={handleEducationInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="University of Technology"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Degree
                </label>
                <input
                  type="text"
                  name="degree"
                  value={educationData.degree}
                  onChange={handleEducationInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={educationData.duration}
                  onChange={handleEducationInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="2018-2022"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  GPA
                </label>
                <input
                  type="text"
                  name="gpa"
                  value={educationData.gpa}
                  onChange={handleEducationInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="3.8"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Achievements (comma separated)
                </label>
                <textarea
                  name="achievements"
                  value={educationData.achievements}
                  onChange={handleEducationInputChange}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Dean's List, Academic Excellence Award"
                />
              </div>
            </div>

            {resumeData.education.length > 0 && (
              <div className="mt-6">
                <h3 className={`text-md font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Added Education
                </h3>
                <div className="space-y-2">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {edu.degree} at {edu.school}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {edu.duration} {edu.gpa && `• GPA: ${edu.gpa}`}
                      </p>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="mt-2">
                          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                            Achievements:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {edu.achievements.map((achievement, achIndex) => (
                              <span key={achIndex} className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>
                                {achievement}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Experience
        return (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Experience
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleGetAISuggestions('experience')}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white disabled:opacity-50`}
                >
                  {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
                </button>
                <button 
                  onClick={handleAddExperience}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50`}
                >
                  Add Experience
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={experienceData.company}
                  onChange={handleExperienceInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Tech Company"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={experienceData.position}
                  onChange={handleExperienceInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={experienceData.duration}
                  onChange={handleExperienceInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="2022-Present"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={experienceData.description}
                  onChange={handleExperienceInputChange}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Developed and maintained web applications..."
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Achievements (comma separated)
                </label>
                <textarea
                  name="achievements"
                  value={experienceData.achievements}
                  onChange={handleExperienceInputChange}
                  rows={2}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Improved performance by 30%, Led team of 5 developers"
                />
              </div>
            </div>

            {resumeData.experience.length > 0 && (
              <div className="mt-6">
                <h3 className={`text-md font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Added Experience
                </h3>
                <div className="space-y-2">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {exp.position} at {exp.company}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {exp.duration}
                      </p>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {exp.description}
                      </p>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-2">
                          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                            Key Achievements:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {exp.achievements.map((achievement, achIndex) => (
                              <span key={achIndex} className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}>
                                {achievement}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3: // Skills
        return (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Skills
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleGetAISuggestions('skills')}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white disabled:opacity-50`}
                >
                  {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
                </button>
                <button 
                  onClick={handleAddSkill}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50`}
                >
                  Add Skill
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={skillsData.name}
                  onChange={handleSkillsInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="React"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Level
                </label>
                <select
                  name="level"
                  value={skillsData.level}
                  onChange={handleSkillsInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={skillsData.category}
                  onChange={handleSkillsInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Frontend"
                />
              </div>
            </div>

            {resumeData.skills.length > 0 && (
              <div className="mt-6">
                <h3 className={`text-md font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Added Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {skill.name}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {skill.level} • {skill.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4: // Projects
        return (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Projects
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleGetAISuggestions('projects')}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white disabled:opacity-50`}
                >
                  {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
                </button>
                <button 
                  onClick={handleAddProject}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50`}
                >
                  Add Project
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={projectsData.name}
                  onChange={handleProjectsInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="E-commerce Platform"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={projectsData.duration}
                  onChange={handleProjectsInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="3 months"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={projectsData.link}
                  onChange={handleProjectsInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://github.com/username/project"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={projectsData.technologies}
                  onChange={handleProjectsInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={projectsData.description}
                  onChange={handleProjectsInputChange}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="A full-stack e-commerce platform with user authentication..."
                />
              </div>
            </div>

            {resumeData.projects.length > 0 && (
              <div className="mt-6">
                <h3 className={`text-md font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Added Projects
                </h3>
                <div className="space-y-2">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project.name}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {project.duration}
                      </p>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {project.description}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-2">
                          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                            Technologies:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.link && (
                        <div className="mt-2">
                          <a href={project.link} target="_blank" rel="noopener noreferrer" 
                             className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} inline-flex items-center`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Project
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
        <div className="flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Manage Your Resume
          </h1>
          <div className="flex space-x-3">
            <button 
              onClick={handleGeneratePDF}
              disabled={loading || !resumeData.contactInfo.fullName}
              className={`px-6 py-2 rounded-lg font-medium ${
                loading || !resumeData.contactInfo.fullName
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isDarkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {loading ? 'Generating...' : 'Download PDF'}
            </button>
            <button 
              onClick={handleCreateNewResume}
              className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              Create New Resume
            </button>
          </div>
        </div>
      </div>

      {/* Upload Resume Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Upload & Enhance Resume
        </h2>
        <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
            🤖 AI-Powered Resume Enhancement: Upload your existing resume and our AI will analyze it to provide professional improvements, better formatting, and optimized content to help you stand out to recruiters.
          </p>
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : isDarkMode
              ? 'border-gray-600 hover:border-gray-500'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Drop your resume here or <span className="text-blue-500 hover:text-blue-600 cursor-pointer">browse</span>
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Supports PDF, DOC files up to 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Upload & Enhance'}
            </button>
          </div>
          
          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
          
          {resumeFile && (
            <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Uploaded: {resumeFile.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resume Form */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Build Your Resume
        </h2>
        
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= activeStep 
                    ? 'bg-blue-600 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-400' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  index <= activeStep 
                    ? 'text-blue-600 font-medium' 
                    : isDarkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    index < activeStep 
                      ? 'bg-blue-600' 
                      : isDarkMode 
                        ? 'bg-gray-700' 
                        : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={handlePrevStep}
              disabled={activeStep === 0}
              className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDarkMode ? 'text-white' : 'text-gray-700'} disabled:opacity-50`}
            >
              Previous
            </button>
            <button 
              onClick={handleNextStep}
              disabled={activeStep === steps.length - 1}
              className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </div>

        {renderFormSection()}

        {/* AI Suggestions */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mt-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Suggestions
            </h2>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              {showSuggestions ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showSuggestions && (
            <div className="space-y-3">
              {aiSuggestions.length > 0 ? (
                aiSuggestions.map((suggestion, index) => (
                  <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {suggestion}
                    </p>
                    <button 
                      onClick={() => handleApplySuggestion(suggestion)}
                      className={`mt-2 text-xs px-3 py-1 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                      Apply Suggestion
                    </button>
                  </div>
                ))
              ) : (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No suggestions available. Start filling out your resume to get AI-powered suggestions.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;
