import React, { useState, useEffect } from 'react';
// Removed Firebase imports
import { User, GraduationCap, Briefcase, Code, Award, Lightbulb, Save, Download, Trash2, ArrowLeft, ArrowRight, Home, FileText } from 'lucide-react';

const App = () => {
    // Simplified user state for local storage (no Firebase auth)
    const [userId, setUserId] = useState('local-user'); // A static ID for local storage
    const [loadingApp, setLoadingApp] = useState(true); // Renamed from loadingAuth

    // State for the multi-step form
    const [currentStep, setCurrentStep] = useState(0);
    const [resumeData, setResumeData] = useState({
        personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '', website: '', cityState: '' },
        careerObjective: '',
        education: [{ degree: '', college: '', board: '', year: '', cgpa: '' }],
        projects: [{ title: '', role: '', description: '', techStack: '', link: '' }],
        internships: [{ company: '', role: '', duration: '', summary: '' }],
        skills: { technical: '', soft: '' },
        certifications: [{ name: '', platform: '', year: '' }],
        achievements: '',
        extraCurricular: '',
        languages: '',
        references: 'References available upon request.'
    });
    const [resumeTitle, setResumeTitle] = useState('My New Resume');
    const [savedResumes, setSavedResumes] = useState([]);
    const [activeResumeId, setActiveResumeId] = useState(null); // ID of the currently loaded resume

    // State for UI views (form, dashboard, resources)
    const [currentView, setCurrentView] = useState('form'); // 'form', 'dashboard', 'resources'

    // Load saved resumes from local storage on component mount
    useEffect(() => {
        try {
            const storedResumes = localStorage.getItem('resumeBuilderResumes');
            if (storedResumes) {
                setSavedResumes(JSON.parse(storedResumes));
            }
        } catch (error) {
            console.error("Error loading resumes from local storage:", error);
        } finally {
            setLoadingApp(false);
        }
    }, []); // Empty dependency array means this runs once on mount

    // Form Navigation
    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // Input Change Handlers
    const handleInputChange = (e, section, index = null, field = null) => {
        const { name, value } = e.target;
        setResumeData((prevData) => {
            const newData = { ...prevData };
            if (index !== null && field !== null) {
                // For array sections like education, projects, internships, certifications
                newData[section] = newData[section].map((item, i) =>
                    i === index ? { ...item, [field]: value } : item
                );
            } else if (section === 'personalInfo') {
                newData.personalInfo = { ...newData.personalInfo, [name]: value };
            } else if (section === 'skills') {
                newData.skills = { ...newData.skills, [name]: value };
            } else {
                // For single string fields like careerObjective, achievements etc.
                newData[section] = value;
            }
            return newData;
        });
    };

    // Add/Remove dynamic fields (e.g., Education, Projects)
    const handleAddField = (section) => {
        setResumeData((prevData) => {
            const newData = { ...prevData };
            if (section === 'education') {
                newData.education = [...newData.education, { degree: '', college: '', board: '', year: '', cgpa: '' }];
            } else if (section === 'projects') {
                newData.projects = [...newData.projects, { title: '', role: '', description: '', techStack: '', link: '' }];
            } else if (section === 'internships') {
                newData.internships = [...newData.internships, { company: '', role: '', duration: '', summary: '' }];
            } else if (section === 'certifications') {
                newData.certifications = [...newData.certifications, { name: '', platform: '', year: '' }];
            }
            return newData;
        });
    };

    const handleRemoveField = (section, index) => {
        setResumeData((prevData) => {
            const newData = { ...prevData };
            newData[section] = newData[section].filter((_, i) => i !== index);
            return newData;
        });
    };

    // Save Resume to Local Storage
    const saveResume = () => {
        let updatedResumes;
        if (activeResumeId) {
            // Update existing resume
            updatedResumes = savedResumes.map(resume =>
                resume.id === activeResumeId
                    ? { ...resume, title: resumeTitle, data: resumeData, updatedAt: new Date() }
                    : resume
            );
            alert("Resume updated successfully!");
        } else {
            // Add new resume
            const newResume = {
                id: Date.now().toString(), // Simple unique ID
                title: resumeTitle,
                data: resumeData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            updatedResumes = [...savedResumes, newResume];
            setActiveResumeId(newResume.id); // Set the new resume as active
            alert("Resume saved successfully!");
        }
        setSavedResumes(updatedResumes);
        localStorage.setItem('resumeBuilderResumes', JSON.stringify(updatedResumes));
        console.log("Resumes saved to local storage:", updatedResumes);
    };

    // Load Resume from Local Storage
    const loadResume = (resume) => {
        setResumeData(resume.data);
        setResumeTitle(resume.title);
        setActiveResumeId(resume.id);
        setCurrentView('form'); // Switch to form view
        setCurrentStep(0); // Go to the first step of the form
    };

    // Delete Resume from Local Storage
    const deleteResume = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
        if (!confirmDelete) return;

        const updatedResumes = savedResumes.filter(resume => resume.id !== id);
        setSavedResumes(updatedResumes);
        localStorage.setItem('resumeBuilderResumes', JSON.stringify(updatedResumes));
        alert("Resume deleted successfully!");

        // If the deleted resume was the active one, clear active state and reset form
        if (activeResumeId === id) {
            setActiveResumeId(null);
            setResumeData({ // Reset to default empty state
                personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '', website: '', cityState: '' },
                careerObjective: '',
                education: [{ degree: '', college: '', board: '', year: '', cgpa: '' }],
                projects: [{ title: '', role: '', description: '', techStack: '', link: '' }],
                internships: [{ company: '', role: '', duration: '', summary: '' }],
                skills: { technical: '', soft: '' },
                certifications: [{ name: '', platform: '', year: '' }],
                achievements: '',
                extraCurricular: '',
                languages: '',
                references: 'References available upon request.'
            });
            setResumeTitle('My New Resume');
        }
    };

    // Placeholder for PDF download
    const downloadPdf = () => {
        // In a real application, you would use a library like jsPDF or react-pdf
        // to generate a PDF from the resumeData.
        // For this beginner project, we'll just log the data.
        console.log("Attempting to download PDF with data:", resumeData);
        alert("PDF download functionality is a future enhancement! For now, you can view your resume in the preview section.");
    };

    // Steps configuration
    const steps = [
        { name: 'Personal Information', icon: <User className="w-5 h-5" /> },
        { name: 'Career Objective', icon: <Lightbulb className="w-5 h-5" /> },
        { name: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'Projects', icon: <Code className="w-5 h-5" /> },
        { name: 'Internships/Trainings', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Skills', icon: <Award className="w-5 h-5" /> },
        { name: 'Certifications & Awards', icon: <Award className="w-5 h-5" /> },
        { name: 'Extra-Curricular & Languages', icon: <FileText className="w-5 h-5" /> },
    ];
    const totalSteps = steps.length;

    // Render functions for each step
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Personal Information
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                        <p className="text-sm text-gray-600">Let's start with your basic contact details.</p>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={resumeData.personalInfo.name}
                            onChange={(e) => handleInputChange(e, 'personalInfo')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={resumeData.personalInfo.email}
                            onChange={(e) => handleInputChange(e, 'personalInfo')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => handleInputChange(e, 'personalInfo')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="url"
                            name="linkedin"
                            placeholder="LinkedIn Profile URL"
                            value={resumeData.personalInfo.linkedin}
                            onChange={(e) => handleInputChange(e, 'personalInfo')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="url"
                            name="github"
                            placeholder="GitHub Profile URL"
                            value={resumeData.personalInfo.github}
                            onChange={(e) => handleInputChange(e, 'personalInfo')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="url"
                            name="website"
                            placeholder="Personal Website or Portfolio URL"
                            value={resumeData.personalInfo.website}
                            onChange={(e) => handleInputChange(e, 'personalInfo')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="text"
                            name="cityState"
                            placeholder="City, State (e.g., New Delhi, Delhi)"
                            value={resumeData.personalInfo.cityState}
                            onChange={(e) => handleInputChange(e, 'personalInfo')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                );
            case 1: // Career Objective
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Career Objective</h2>
                        <p className="text-sm text-gray-600">A brief statement about your career goals. Keep it concise (2-3 sentences).</p>
                        <textarea
                            name="careerObjective"
                            placeholder="E.g., Seeking an entry-level software development role to apply my skills in Python and React, eager to contribute to innovative projects and grow within a dynamic team."
                            value={resumeData.careerObjective}
                            onChange={(e) => handleInputChange(e, 'careerObjective')}
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                        <p className="text-xs text-gray-500">
                            <strong>Tip:</strong> Tailor this to the specific job/internship you're applying for.
                        </p>
                    </div>
                );
            case 2: // Education
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Education</h2>
                        <p className="text-sm text-gray-600">List your academic qualifications, most recent first.</p>
                        {resumeData.education.map((edu, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3 relative">
                                <h3 className="font-medium text-gray-700">Education Entry {index + 1}</h3>
                                <input
                                    type="text"
                                    placeholder="Degree (e.g., B.Tech in Computer Science)"
                                    value={edu.degree}
                                    onChange={(e) => handleInputChange(e, 'education', index, 'degree')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="College/University"
                                    value={edu.college}
                                    onChange={(e) => handleInputChange(e, 'education', index, 'college')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="University Board (e.g., AKTU, VTU)"
                                    value={edu.board}
                                    onChange={(e) => handleInputChange(e, 'education', index, 'board')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Year of Graduation (or expected)"
                                    value={edu.year}
                                    onChange={(e) => handleInputChange(e, 'education', index, 'year')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="CGPA or Percentage (e.g., 8.5/10 or 85%)"
                                    value={edu.cgpa}
                                    onChange={(e) => handleInputChange(e, 'education', index, 'cgpa')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {resumeData.education.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveField('education', index)}
                                        className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                        title="Remove Education Entry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => handleAddField('education')}
                            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                            <span>Add More Education</span>
                        </button>
                    </div>
                );
            case 3: // Projects
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
                        <p className="text-sm text-gray-600">Showcase your practical work. Focus on what you did, technologies used, and results.</p>
                        {resumeData.projects.map((proj, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3 relative">
                                <h3 className="font-medium text-gray-700">Project Entry {index + 1}</h3>
                                <input
                                    type="text"
                                    placeholder="Project Title"
                                    value={proj.title}
                                    onChange={(e) => handleInputChange(e, 'projects', index, 'title')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Your Role (e.g., Team Lead, Developer)"
                                    value={proj.role}
                                    onChange={(e) => handleInputChange(e, 'projects', index, 'role')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <textarea
                                    placeholder="Project Description (What problem did it solve? Key features?)"
                                    value={proj.description}
                                    onChange={(e) => handleInputChange(e, 'projects', index, 'description')}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                ></textarea>
                                <input
                                    type="text"
                                    placeholder="Tech Stack (e.g., React.js, Node.js, MongoDB)"
                                    value={proj.techStack}
                                    onChange={(e) => handleInputChange(e, 'projects', index, 'techStack')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="url"
                                    placeholder="Project Link (GitHub, live demo, etc.)"
                                    value={proj.link}
                                    onChange={(e) => handleInputChange(e, 'projects', index, 'link')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {resumeData.projects.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveField('projects', index)}
                                        className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                        title="Remove Project Entry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => handleAddField('projects')}
                            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                            <span>Add More Projects</span>
                        </button>
                    </div>
                );
            case 4: // Internships/Trainings
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Internships / Trainings</h2>
                        <p className="text-sm text-gray-600">Detail any work experience, internships, or significant training programs.</p>
                        {resumeData.internships.map((intern, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3 relative">
                                <h3 className="font-medium text-gray-700">Internship/Training Entry {index + 1}</h3>
                                <input
                                    type="text"
                                    placeholder="Company/Organization"
                                    value={intern.company}
                                    onChange={(e) => handleInputChange(e, 'internships', index, 'company')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Role/Position (e.g., Software Developer Intern)"
                                    value={intern.role}
                                    onChange={(e) => handleInputChange(e, 'internships', index, 'role')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Duration (e.g., May 2024 - July 2024)"
                                    value={intern.duration}
                                    onChange={(e) => handleInputChange(e, 'internships', index, 'duration')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <textarea
                                    placeholder="Work Summary (Key responsibilities and achievements)"
                                    value={intern.summary}
                                    onChange={(e) => handleInputChange(e, 'internships', index, 'summary')}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                ></textarea>
                                {resumeData.internships.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveField('internships', index)}
                                        className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                        title="Remove Internship Entry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => handleAddField('internships')}
                            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                            <span>Add More Internships/Trainings</span>
                        </button>
                    </div>
                );
            case 5: // Skills
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
                        <p className="text-sm text-gray-600">List your technical and soft skills. Separate with commas.</p>
                        <div>
                            <label htmlFor="technicalSkills" className="block text-sm font-medium text-gray-700 mb-1">Technical Skills:</label>
                            <textarea
                                id="technicalSkills"
                                name="technical"
                                placeholder="E.g., Python, Java, JavaScript, React.js, Node.js, MongoDB, SQL, Git"
                                value={resumeData.skills.technical}
                                onChange={(e) => handleInputChange(e, 'skills')}
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="softSkills" className="block text-sm font-medium text-gray-700 mb-1">Soft Skills:</label>
                            <textarea
                                id="softSkills"
                                name="soft"
                                placeholder="E.g., Teamwork, Problem-Solving, Communication, Leadership, Adaptability"
                                value={resumeData.skills.soft}
                                onChange={(e) => handleInputChange(e, 'skills')}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>
                    </div>
                );
            case 6: // Certifications & Awards
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Certifications & Awards</h2>
                        <p className="text-sm text-gray-600">Include any formal certifications or notable awards/achievements.</p>
                        {resumeData.certifications.map((cert, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3 relative">
                                <h3 className="font-medium text-gray-700">Certification Entry {index + 1}</h3>
                                <input
                                    type="text"
                                    placeholder="Certification Name (e.g., Machine Learning Specialization)"
                                    value={cert.name}
                                    onChange={(e) => handleInputChange(e, 'certifications', index, 'name')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Platform/Issuing Body (e.g., Coursera, NPTEL)"
                                    value={cert.platform}
                                    onChange={(e) => handleInputChange(e, 'certifications', index, 'platform')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="text"
                                    placeholder="Year of Completion"
                                    value={cert.year}
                                    onChange={(e) => handleInputChange(e, 'certifications', index, 'year')}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {resumeData.certifications.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveField('certifications', index)}
                                        className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                        title="Remove Certification Entry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => handleAddField('certifications')}
                            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                            <span>Add More Certifications</span>
                        </button>

                        <div className="mt-6 space-y-3">
                            <h3 className="font-medium text-gray-700">Additional Achievements & Awards</h3>
                            <textarea
                                placeholder="List any other significant achievements or awards (e.g., 'Won 1st prize in National Robotics Competition 2023')"
                                value={resumeData.achievements}
                                onChange={(e) => handleInputChange(e, 'achievements')}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-md"
                            ></textarea>
                        </div>
                    </div>
                );
            case 7: // Extra-Curricular & Languages
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Extra-Curricular Activities & Languages</h2>
                        <p className="text-sm text-gray-600">Showcase your involvement outside academics and language proficiencies.</p>
                        <div>
                            <label htmlFor="extraCurricular" className="block text-sm font-medium text-gray-700 mb-1">Extra-Curricular Activities / Volunteering:</label>
                            <textarea
                                id="extraCurricular"
                                placeholder="E.g., 'President, Tech Club (2023-2024) - Organized 5 workshops and 2 hackathons'; 'Volunteer, XYZ NGO - Taught basic computer skills to underprivileged children'"
                                value={resumeData.extraCurricular}
                                onChange={(e) => handleInputChange(e, 'extraCurricular')}
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-1">Languages Known:</label>
                            <input
                                type="text"
                                id="languages"
                                placeholder="E.g., English (Fluent), Hindi (Native), Telugu (Conversational)"
                                value={resumeData.languages}
                                onChange={(e) => handleInputChange(e, 'languages')}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="mt-6 space-y-3">
                            <h3 className="font-medium text-gray-700">References</h3>
                            <textarea
                                placeholder="Typically 'References available upon request.' unless specified."
                                value={resumeData.references}
                                onChange={(e) => handleInputChange(e, 'references')}
                                rows="2"
                                className="w-full p-3 border border-gray-300 rounded-md"
                            ></textarea>
                        </div>
                    </div>
                );
            default:
                return <p>Unknown step.</p>;
        }
    };

    // Resume Preview Component (simplified for display)
    const ResumePreview = ({ data }) => (
        <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 max-w-2xl mx-auto my-8 font-inter text-gray-800">
            {/* Personal Information */}
            <div className="text-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-blue-700">{data.personalInfo.name || 'Your Name'}</h1>
                <p className="text-sm text-gray-600 mt-1">
                    {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.cityState}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                    {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline mr-2">LinkedIn</a>}
                    {data.personalInfo.github && <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline mr-2">GitHub</a>}
                    {data.personalInfo.website && <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>}
                </p>
            </div>

            {/* Career Objective */}
            {data.careerObjective && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Career Objective</h2>
                    <p className="text-sm leading-relaxed">{data.careerObjective}</p>
                </div>
            )}

            {/* Education */}
            {data.education && data.education.some(edu => edu.degree) && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Education</h2>
                    {data.education.map((edu, index) => edu.degree && (
                        <div key={index} className="mb-3 last:mb-0">
                            <h3 className="font-medium text-md">{edu.degree}</h3>
                            <p className="text-sm text-gray-700">{edu.college}, {edu.board}</p>
                            <p className="text-xs text-gray-500">{edu.year} | CGPA/Percentage: {edu.cgpa}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.some(proj => proj.title) && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Projects</h2>
                    {data.projects.map((proj, index) => proj.title && (
                        <div key={index} className="mb-3 last:mb-0">
                            <h3 className="font-medium text-md">{proj.title} {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm ml-2">(Link)</a>}</h3>
                            <p className="text-sm text-gray-700 italic">{proj.role}</p>
                            <p className="text-sm leading-relaxed">{proj.description}</p>
                            {proj.techStack && <p className="text-xs text-gray-500 mt-1"><strong>Tech Stack:</strong> {proj.techStack}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Internships/Trainings */}
            {data.internships && data.internships.some(intern => intern.company) && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Internships / Trainings</h2>
                    {data.internships.map((intern, index) => intern.company && (
                        <div key={index} className="mb-3 last:mb-0">
                            <h3 className="font-medium text-md">{intern.role} at {intern.company}</h3>
                            <p className="text-sm text-gray-700">{intern.duration}</p>
                            <p className="text-sm leading-relaxed">{intern.summary}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {(data.skills.technical || data.skills.soft) && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Skills</h2>
                    {data.skills.technical && (
                        <p className="text-sm mb-1"><strong>Technical Skills:</strong> {data.skills.technical}</p>
                    )}
                    {data.skills.soft && (
                        <p className="text-sm"><strong>Soft Skills:</strong> {data.skills.soft}</p>
                    )}
                </div>
            )}

            {/* Certifications & Awards */}
            {(data.certifications && data.certifications.some(cert => cert.name)) || data.achievements && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Certifications & Awards</h2>
                    {data.certifications.map((cert, index) => cert.name && (
                        <div key={index} className="mb-2 last:mb-0">
                            <p className="text-sm font-medium">{cert.name}</p>
                            <p className="text-xs text-gray-600">{cert.platform} ({cert.year})</p>
                        </div>
                    ))}
                    {data.achievements && (
                        <div className="mt-3">
                            <p className="text-sm leading-relaxed">{data.achievements}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Extra-Curricular Activities / Volunteering */}
            {data.extraCurricular && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Extra-Curricular Activities / Volunteering</h2>
                    <p className="text-sm leading-relaxed">{data.extraCurricular}</p>
                </div>
            )}

            {/* Languages Known */}
            {data.languages && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">Languages Known</h2>
                    <p className="text-sm">{data.languages}</p>
                </div>
            )}

            {/* References */}
            {data.references && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-1 mb-3">References</h2>
                    <p className="text-sm">{data.references}</p>
                </div>
            )}
        </div>
    );

    if (loadingApp) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700">Loading application...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-inter text-gray-900 flex flex-col">
            {/* Header/Navigation Bar */}
            <header className="bg-blue-700 text-white p-4 shadow-md">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-2xl font-bold mb-2 sm:mb-0">Resume Builder</h1>
                    <nav className="flex space-x-4">
                        <button
                            onClick={() => setCurrentView('form')}
                            className={`p-2 rounded-md transition-colors duration-200 ${currentView === 'form' ? 'bg-blue-800' : 'hover:bg-blue-600'}`}
                        >
                            <FileText className="inline-block mr-1" /> Build Resume
                        </button>
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`p-2 rounded-md transition-colors duration-200 ${currentView === 'dashboard' ? 'bg-blue-800' : 'hover:bg-blue-600'}`}
                        >
                            <Home className="inline-block mr-1" /> Dashboard
                        </button>
                        <button
                            onClick={() => setCurrentView('resources')}
                            className={`p-2 rounded-md transition-colors duration-200 ${currentView === 'resources' ? 'bg-blue-800' : 'hover:bg-blue-600'}`}
                        >
                            <Lightbulb className="inline-block mr-1" /> Tips & Resources
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4 md:p-8">
                {currentView === 'form' && (
                    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            {activeResumeId ? `Editing: ${resumeTitle}` : 'Create Your New Resume'}
                        </h2>

                        {/* Resume Title Input */}
                        <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                            <label htmlFor="resumeTitle" className="block text-sm font-medium text-blue-700 mb-2">
                                Resume Title:
                            </label>
                            <input
                                type="text"
                                id="resumeTitle"
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)}
                                className="w-full p-3 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                                placeholder="e.g., John Doe - Software Engineer Resume"
                            />
                        </div>

                        {/* Step Indicator */}
                        <div className="flex justify-between mb-8 overflow-x-auto pb-2">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`flex-1 text-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-300
                                        ${index === currentStep ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700'}
                                        ${index < currentStep ? 'bg-blue-200 text-blue-800' : ''}
                                        flex items-center justify-center space-x-1 min-w-[120px] mx-1`}
                                >
                                    {step.icon}
                                    <span>{step.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Form Content */}
                        <div className="min-h-[400px] bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                            {renderStepContent()}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Previous</span>
                            </button>
                            <button
                                onClick={saveResume}
                                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
                            >
                                <Save className="w-5 h-5" />
                                <span>Save Resume</span>
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentStep === totalSteps - 1}
                                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <span>Next</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Resume Preview */}
                        <div className="mt-12 p-6 bg-blue-50 rounded-lg shadow-inner border border-blue-200">
                            <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Resume Preview</h2>
                            <ResumePreview data={resumeData} />
                            <div className="text-center mt-6">
                                <button
                                    onClick={downloadPdf}
                                    className="px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto space-x-3"
                                >
                                    <Download className="w-6 h-6" />
                                    <span>Download PDF (Placeholder)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {currentView === 'dashboard' && (
                    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Your Saved Resumes</h2>
                        {/* User ID display removed as it's not relevant for local storage */}
                        {savedResumes.length === 0 ? (
                            <div className="text-center p-8 bg-gray-50 rounded-md">
                                <p className="text-lg text-gray-600">You haven't saved any resumes yet!</p>
                                <button
                                    onClick={() => { setCurrentView('form'); setActiveResumeId(null); setResumeTitle('My New Resume'); setResumeData({ personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '', website: '', cityState: '' }, careerObjective: '', education: [{ degree: '', college: '', board: '', year: '', cgpa: '' }], projects: [{ title: '', role: '', description: '', techStack: '', link: '' }], internships: [{ company: '', role: '', duration: '', summary: '' }], skills: { technical: '', soft: '' }, certifications: [{ name: '', platform: '', year: '' }], achievements: '', extraCurricular: '', languages: '', references: 'References available upon request.' }); }}
                                    className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Start a New Resume
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedResumes.map((resume) => (
                                    <div key={resume.id} className="bg-gray-50 p-5 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-700 mb-2">{resume.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                Last Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex space-x-2">
                                            <button
                                                onClick={() => loadResume(resume)}
                                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
                                            >
                                                <FileText className="w-4 h-4" /> <span>Load</span>
                                            </button>
                                            <button
                                                onClick={() => deleteResume(resume.id)}
                                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                                            >
                                                <Trash2 className="w-4 h-4" /> <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {currentView === 'resources' && (
                    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Tips & Resources for Resume Building</h2>

                        <div className="space-y-8">
                            {/* Section: Sample Resumes */}
                            <div className="p-5 bg-blue-50 rounded-md border border-blue-200">
                                <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center space-x-2">
                                    <FileText className="w-6 h-6" /> <span>Sample Resumes for Inspiration</span>
                                </h3>
                                <p className="text-gray-700 mb-3">
                                    Reviewing well-crafted resumes can give you ideas for structure, wording, and content.
                                    While we don't host samples directly here, you can find excellent examples on:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-blue-600">
                                    <li><a href="https://www.linkedin.com/in/yourname/overlay/resumes/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn's Resume Examples</a></li>
                                    <li><a href="https://www.indeed.com/career-advice/resume-samples" target="_blank" rel="noopener noreferrer" className="hover:underline">Indeed Resume Samples</a></li>
                                    <li><a href="https://zety.com/blog/resume-examples" target="_blank" rel="noopener noreferrer" className="hover:underline">Zety Resume Examples</a></li>
                                </ul>
                            </div>

                            {/* Section: Resume Writing Tips */}
                            <div className="p-5 bg-green-50 rounded-md border border-green-200">
                                <h3 className="text-xl font-semibold text-green-700 mb-3 flex items-center space-x-2">
                                    <Lightbulb className="w-6 h-6" /> <span>Essential Resume Writing Tips</span>
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li><strong>Tailor Your Resume:</strong> Always customize your resume for each job application. Highlight skills and experiences most relevant to the job description.</li>
                                    <li><strong>Use Action Verbs:</strong> Start bullet points with strong action verbs (e.g., "Developed," "Managed," "Implemented," "Analyzed").</li>
                                    <li><strong>Quantify Achievements:</strong> Whenever possible, use numbers and metrics to describe your accomplishments (e.g., "Increased sales by 15%", "Reduced bug count by 20%").</li>
                                    <li><strong>Keep it Concise:</strong> For freshers, a one-page resume is generally preferred. Be clear and to the point.</li>
                                    <li><strong>Proofread Meticulously:</strong> Grammar and spelling errors can leave a negative impression. Use tools like Grammarly.</li>
                                    <li><strong>ATS-Friendly:</strong> Use keywords from the job description to ensure your resume passes Applicant Tracking Systems (ATS).</li>
                                </ul>
                            </div>

                            {/* Section: Common Do's and Don'ts */}
                            <div className="p-5 bg-red-50 rounded-md border border-red-200">
                                <h3 className="text-xl font-semibold text-red-700 mb-3 flex items-center space-x-2">
                                    <Trash2 className="w-6 h-6" /> <span>Common Do's and Don'ts</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-green-800 mb-2">DO's:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            <li>Use a professional email address.</li>
                                            <li>Include relevant keywords.</li>
                                            <li>Highlight your strengths and unique experiences.</li>
                                            <li>Keep formatting consistent.</li>
                                            <li>Get feedback from peers or mentors.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-red-800 mb-2">DON'Ts:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            <li>Include personal information like marital status or religion.</li>
                                            <li>Use unprofessional fonts or excessive colors.</li>
                                            <li>Lie or exaggerate your experience.</li>
                                            <li>Have typos or grammatical errors.</li>
                                            <li>Use a generic resume for all applications.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4 text-center text-sm mt-8">
                <div className="container mx-auto">
                    <p>&copy; {new Date().getFullYear()} Resume Builder for Beginners. All rights reserved.</p>
                    <p className="mt-1">Designed with <span className="text-red-500">&hearts;</span> for Tier-2/Tier-3 Students.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
