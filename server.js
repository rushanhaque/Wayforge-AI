const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// In-memory database (in production, use MongoDB/PostgreSQL)
let database = {
    users: [],
    courses: [],
    pathways: [],
    assessments: [],
    opportunities: [],
    certifications: [],
    microCredentials: []
};

// AI-Powered Pathway Generation Engine
class PathwayAI {
    constructor() {
        this.skillWeights = {
            programming: { demand: 0.9, growth: 0.85, salary: 0.9 },
            design: { demand: 0.75, growth: 0.8, salary: 0.7 },
            data: { demand: 0.95, growth: 0.9, salary: 0.95 },
            business: { demand: 0.8, growth: 0.7, salary: 0.75 },
            marketing: { demand: 0.7, growth: 0.75, salary: 0.65 }
        };
        
        this.learningStyles = {
            visual: ['videos', 'infographics', 'diagrams', 'presentations'],
            auditory: ['podcasts', 'lectures', 'discussions', 'interviews'],
            kinesthetic: ['labs', 'projects', 'workshops', 'simulations'],
            reading: ['articles', 'books', 'documentation', 'case-studies']
        };
    }

    generatePersonalizedPathway(userProfile, assessmentResults, preferences) {
        const pathway = {
            id: `pathway_${Date.now()}`,
            userId: userProfile.id,
            title: this.generatePathwayTitle(userProfile, assessmentResults),
            description: this.generatePathwayDescription(userProfile, assessmentResults),
            duration: this.calculateOptimalDuration(userProfile, assessmentResults),
            difficulty: this.determineDifficulty(assessmentResults),
            personalizedScore: this.calculatePersonalizationScore(userProfile, assessmentResults),
            phases: this.createLearningPhases(userProfile, assessmentResults, preferences),
            recommendations: this.generateRecommendations(userProfile, assessmentResults),
            opportunities: this.findRelevantOpportunities(userProfile, assessmentResults),
            certifications: this.suggestCertifications(userProfile, assessmentResults),
            microCredentials: this.suggestMicroCredentials(userProfile, assessmentResults),
            adaptiveElements: this.createAdaptiveElements(userProfile, preferences),
            successMetrics: this.defineSuccessMetrics(userProfile, assessmentResults),
            created: new Date(),
            lastUpdated: new Date()
        };

        return pathway;
    }

    generatePathwayTitle(userProfile, assessmentResults) {
        const dominantSkill = this.findDominantSkill(assessmentResults);
        const experience = this.determineExperienceLevel(assessmentResults);
        const goal = userProfile.careerGoals || 'Professional Development';
        
        const titles = {
            programming: {
                beginner: `Complete ${goal} Bootcamp: From Zero to Hero`,
                intermediate: `Advanced ${goal} Mastery Program`,
                expert: `${goal} Leadership & Architecture Track`
            },
            design: {
                beginner: `Creative ${goal} Foundation Program`,
                intermediate: `Professional ${goal} Specialization`,
                expert: `${goal} Innovation & Strategy Track`
            },
            data: {
                beginner: `Data Science Fundamentals for ${goal}`,
                intermediate: `Advanced Analytics & ${goal} Program`,
                expert: `AI/ML Leadership in ${goal}`
            },
            business: {
                beginner: `Business Essentials for ${goal}`,
                intermediate: `Strategic ${goal} Development`,
                expert: `Executive ${goal} Leadership Program`
            }
        };

        return titles[dominantSkill]?.[experience] || `Personalized ${goal} Learning Journey`;
    }

    generatePathwayDescription(userProfile, assessmentResults) {
        const dominantSkill = this.findDominantSkill(assessmentResults);
        const weakAreas = this.identifyWeakAreas(assessmentResults);
        const strengths = this.identifyStrengths(assessmentResults);
        
        return `A meticulously crafted learning journey designed specifically for your unique profile. 
        This pathway leverages your strengths in ${strengths.join(', ')} while strategically 
        addressing growth opportunities in ${weakAreas.join(', ')}. Built around ${dominantSkill} 
        excellence, this program adapts to your learning style and career aspirations, ensuring 
        maximum engagement and practical skill development.`;
    }

    createLearningPhases(userProfile, assessmentResults, preferences) {
        const phases = [];
        const dominantSkill = this.findDominantSkill(assessmentResults);
        const experience = this.determineExperienceLevel(assessmentResults);
        
        // Phase 1: Foundation Building
        phases.push({
            id: 1,
            title: "Foundation Mastery",
            duration: this.calculatePhaseDuration(experience, 'foundation'),
            description: "Build rock-solid fundamentals tailored to your current skill level",
            modules: this.generateFoundationModules(dominantSkill, experience, preferences),
            assessments: this.generatePhaseAssessments('foundation', dominantSkill),
            projects: this.generatePhaseProjects('foundation', dominantSkill, preferences),
            resources: this.selectOptimalResources(dominantSkill, 'foundation', preferences.learningStyle)
        });

        // Phase 2: Skill Development
        phases.push({
            id: 2,
            title: "Advanced Skill Development",
            duration: this.calculatePhaseDuration(experience, 'development'),
            description: "Deep-dive into specialized skills with hands-on practice",
            modules: this.generateDevelopmentModules(dominantSkill, assessmentResults, preferences),
            assessments: this.generatePhaseAssessments('development', dominantSkill),
            projects: this.generatePhaseProjects('development', dominantSkill, preferences),
            resources: this.selectOptimalResources(dominantSkill, 'development', preferences.learningStyle)
        });

        // Phase 3: Specialization & Mastery
        phases.push({
            id: 3,
            title: "Specialization & Mastery",
            duration: this.calculatePhaseDuration(experience, 'mastery'),
            description: "Achieve expertise in your chosen specialization",
            modules: this.generateMasteryModules(dominantSkill, userProfile.careerGoals, preferences),
            assessments: this.generatePhaseAssessments('mastery', dominantSkill),
            projects: this.generatePhaseProjects('mastery', dominantSkill, preferences),
            resources: this.selectOptimalResources(dominantSkill, 'mastery', preferences.learningStyle)
        });

        // Phase 4: Real-World Application
        phases.push({
            id: 4,
            title: "Professional Application",
            duration: this.calculatePhaseDuration(experience, 'application'),
            description: "Apply skills in real-world scenarios and build portfolio",
            modules: this.generateApplicationModules(dominantSkill, userProfile, preferences),
            assessments: this.generatePhaseAssessments('application', dominantSkill),
            projects: this.generateCapstoneProjects(dominantSkill, userProfile, preferences),
            resources: this.selectOptimalResources(dominantSkill, 'application', preferences.learningStyle)
        });

        return phases;
    }

    generateFoundationModules(skill, experience, preferences) {
        const modules = {
            programming: [
                {
                    title: "Programming Fundamentals",
                    duration: "2 weeks",
                    type: "interactive",
                    difficulty: experience === 'beginner' ? 'easy' : 'medium',
                    content: ["Variables & Data Types", "Control Structures", "Functions", "Basic Algorithms"],
                    practiceHours: 20
                },
                {
                    title: "Development Environment Setup",
                    duration: "1 week",
                    type: "hands-on",
                    difficulty: 'easy',
                    content: ["IDE Configuration", "Version Control", "Debugging Tools", "Best Practices"],
                    practiceHours: 10
                }
            ],
            design: [
                {
                    title: "Design Principles & Theory",
                    duration: "2 weeks",
                    type: "visual",
                    difficulty: experience === 'beginner' ? 'easy' : 'medium',
                    content: ["Color Theory", "Typography", "Layout Principles", "Visual Hierarchy"],
                    practiceHours: 15
                },
                {
                    title: "Design Tools Mastery",
                    duration: "2 weeks",
                    type: "hands-on",
                    difficulty: 'medium',
                    content: ["Figma/Adobe Suite", "Prototyping", "Asset Management", "Collaboration"],
                    practiceHours: 25
                }
            ],
            data: [
                {
                    title: "Data Analysis Fundamentals",
                    duration: "3 weeks",
                    type: "analytical",
                    difficulty: experience === 'beginner' ? 'easy' : 'medium',
                    content: ["Statistics Basics", "Data Cleaning", "Visualization", "Interpretation"],
                    practiceHours: 30
                },
                {
                    title: "Tools & Technologies",
                    duration: "2 weeks",
                    type: "hands-on",
                    difficulty: 'medium',
                    content: ["Python/R Basics", "SQL", "Excel Advanced", "BI Tools"],
                    practiceHours: 20
                }
            ]
        };

        return modules[skill] || [];
    }

    generateRecommendations(userProfile, assessmentResults) {
        const recommendations = {
            courses: this.recommendCourses(userProfile, assessmentResults),
            books: this.recommendBooks(userProfile, assessmentResults),
            communities: this.recommendCommunities(userProfile, assessmentResults),
            mentors: this.recommendMentors(userProfile, assessmentResults),
            tools: this.recommendTools(userProfile, assessmentResults),
            events: this.recommendEvents(userProfile, assessmentResults)
        };

        return recommendations;
    }

    recommendCourses(userProfile, assessmentResults) {
        const skill = this.findDominantSkill(assessmentResults);
        const courses = {
            programming: [
                {
                    title: "Complete JavaScript Mastery 2024",
                    provider: "TechAcademy Pro",
                    rating: 4.9,
                    duration: "40 hours",
                    price: "$89",
                    level: "Intermediate",
                    matchScore: 98,
                    reasons: ["Matches your JavaScript interest", "Perfect for your experience level", "Highly rated by similar learners"]
                },
                {
                    title: "React Advanced Patterns",
                    provider: "Frontend Masters",
                    rating: 4.8,
                    duration: "25 hours",
                    price: "$39/month",
                    level: "Advanced",
                    matchScore: 95,
                    reasons: ["Builds on your React knowledge", "Industry-relevant patterns", "Practical projects included"]
                }
            ],
            design: [
                {
                    title: "UX Design Comprehensive Course",
                    provider: "Design Institute",
                    rating: 4.9,
                    duration: "60 hours",
                    price: "$149",
                    level: "All Levels",
                    matchScore: 97,
                    reasons: ["Perfect for career transition", "Portfolio-focused", "Industry mentorship included"]
                }
            ],
            data: [
                {
                    title: "Data Science with Python Specialization",
                    provider: "DataCamp Pro",
                    rating: 4.8,
                    duration: "80 hours",
                    price: "$29/month",
                    level: "Intermediate",
                    matchScore: 96,
                    reasons: ["Matches your Python skills", "Real-world datasets", "Industry-recognized certificate"]
                }
            ]
        };

        return courses[skill] || [];
    }

    findDominantSkill(assessmentResults) {
        let maxScore = 0;
        let dominantSkill = 'programming';
        
        Object.keys(assessmentResults).forEach(skill => {
            const avgScore = Object.values(assessmentResults[skill]).reduce((a, b) => a + b, 0) / Object.values(assessmentResults[skill]).length;
            if (avgScore > maxScore) {
                maxScore = avgScore;
                dominantSkill = skill;
            }
        });
        
        return dominantSkill;
    }

    determineExperienceLevel(assessmentResults) {
        const avgScore = Object.values(assessmentResults).flat().reduce((a, b) => a + b, 0) / Object.values(assessmentResults).flat().length;
        
        if (avgScore < 2.5) return 'beginner';
        if (avgScore < 3.5) return 'intermediate';
        return 'expert';
    }

    calculatePersonalizationScore(userProfile, assessmentResults) {
        // Complex algorithm to calculate how well-matched the pathway is
        let score = 85; // Base score
        
        // Boost for complete profile
        if (userProfile.careerGoals) score += 5;
        if (userProfile.timeCommitment) score += 3;
        if (userProfile.learningStyle) score += 4;
        if (userProfile.budget) score += 3;
        
        return Math.min(score, 100);
    }

    identifyWeakAreas(assessmentResults) {
        const weakAreas = [];
        Object.keys(assessmentResults).forEach(skill => {
            const avgScore = Object.values(assessmentResults[skill]).reduce((a, b) => a + b, 0) / Object.values(assessmentResults[skill]).length;
            if (avgScore < 2.5) {
                weakAreas.push(skill);
            }
        });
        return weakAreas.length > 0 ? weakAreas : ['foundational concepts'];
    }

    identifyStrengths(assessmentResults) {
        const strengths = [];
        Object.keys(assessmentResults).forEach(skill => {
            const avgScore = Object.values(assessmentResults[skill]).reduce((a, b) => a + b, 0) / Object.values(assessmentResults[skill]).length;
            if (avgScore >= 4) {
                strengths.push(skill);
            }
        });
        return strengths.length > 0 ? strengths : ['analytical thinking'];
    }

    calculateOptimalDuration(userProfile, assessmentResults) {
        const baseHours = 120; // Base learning hours
        const experience = this.determineExperienceLevel(assessmentResults);
        const timeCommitment = userProfile.timeCommitment || 10; // hours per week
        
        let totalHours = baseHours;
        if (experience === 'beginner') totalHours *= 1.5;
        if (experience === 'expert') totalHours *= 0.8;
        
        const weeks = Math.ceil(totalHours / timeCommitment);
        return `${weeks} weeks (${totalHours} hours)`;
    }

    // Additional helper methods...
    calculatePhaseDuration(experience, phase) {
        const baseDurations = {
            foundation: { beginner: 4, intermediate: 3, expert: 2 },
            development: { beginner: 6, intermediate: 5, expert: 4 },
            mastery: { beginner: 8, intermediate: 6, expert: 5 },
            application: { beginner: 4, intermediate: 3, expert: 2 }
        };
        
        return `${baseDurations[phase][experience]} weeks`;
    }

    generatePhaseAssessments(phase, skill) {
        return [
            {
                type: 'practical',
                title: `${phase} Skills Assessment`,
                duration: '2 hours',
                weight: 0.4
            },
            {
                type: 'project',
                title: `${phase} Project Evaluation`,
                duration: '1 week',
                weight: 0.6
            }
        ];
    }

    generatePhaseProjects(phase, skill, preferences) {
        const projects = {
            programming: {
                foundation: ["Personal Portfolio Website", "Simple Calculator App"],
                development: ["Full-Stack Web Application", "API Development Project"],
                mastery: ["Advanced Framework Implementation", "Performance Optimization Project"],
                application: ["Industry-Grade Application", "Open Source Contribution"]
            }
        };

        return projects[skill]?.[phase] || [`${phase} Capstone Project`];
    }

    selectOptimalResources(skill, phase, learningStyle) {
        // Return resources optimized for the user's learning style
        return {
            videos: 15,
            articles: 8,
            interactive: 12,
            books: 3,
            podcasts: 5
        };
    }
}

// Initialize AI Engine
const pathwayAI = new PathwayAI();

// API Routes

// Generate personalized learning pathway
app.post('/api/generate-pathway', async (req, res) => {
    try {
        const { userProfile, assessmentResults, preferences } = req.body;
        
        // Validate input
        if (!userProfile || !assessmentResults) {
            return res.status(400).json({ 
                error: 'Missing required data: userProfile and assessmentResults' 
            });
        }

        // Generate pathway using AI
        const pathway = pathwayAI.generatePersonalizedPathway(
            userProfile, 
            assessmentResults, 
            preferences || {}
        );

        // Save to database
        database.pathways.push(pathway);

        // Return the generated pathway
        res.json({
            success: true,
            pathway: pathway,
            message: "Your personalized learning pathway has been generated!"
        });

    } catch (error) {
        console.error('Error generating pathway:', error);
        res.status(500).json({ 
            error: 'Failed to generate pathway',
            details: error.message 
        });
    }
});

// Get user's pathways
app.get('/api/pathways/:userId', (req, res) => {
    const { userId } = req.params;
    const userPathways = database.pathways.filter(p => p.userId === userId);
    
    res.json({
        success: true,
        pathways: userPathways
    });
});

// Save assessment results
app.post('/api/assessment/save', (req, res) => {
    try {
        const assessmentData = {
            id: `assessment_${Date.now()}`,
            ...req.body,
            timestamp: new Date()
        };
        
        database.assessments.push(assessmentData);
        
        res.json({
            success: true,
            assessmentId: assessmentData.id,
            message: "Assessment results saved successfully"
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to save assessment',
            details: error.message 
        });
    }
});

// Get course recommendations
app.post('/api/recommendations/courses', (req, res) => {
    try {
        const { userProfile, assessmentResults } = req.body;
        const recommendations = pathwayAI.recommendCourses(userProfile, assessmentResults);
        
        res.json({
            success: true,
            recommendations
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to get recommendations',
            details: error.message 
        });
    }
});

// Get learning opportunities
app.get('/api/opportunities', (req, res) => {
    const opportunities = [
        {
            id: 1,
            title: "Google Developer Student Club - Web Development Workshop",
            type: "Workshop",
            date: "2024-11-15",
            location: "Online",
            description: "Hands-on workshop covering modern web development practices",
            skills: ["JavaScript", "React", "Node.js"],
            level: "Intermediate",
            duration: "4 hours",
            price: "Free",
            provider: "Google",
            rating: 4.8,
            spots: 50,
            spotsLeft: 12
        },
        {
            id: 2,
            title: "AWS Cloud Practitioner Certification Bootcamp",
            type: "Certification",
            date: "2024-11-20",
            location: "Hybrid",
            description: "Intensive bootcamp to prepare for AWS Cloud Practitioner certification",
            skills: ["Cloud Computing", "AWS", "Infrastructure"],
            level: "Beginner",
            duration: "2 days",
            price: "$299",
            provider: "AWS Training",
            rating: 4.9,
            certification: "AWS Certified Cloud Practitioner",
            examIncluded: true
        }
    ];
    
    res.json({
        success: true,
        opportunities
    });
});

// Get micro-credentials
app.get('/api/micro-credentials', (req, res) => {
    const microCredentials = [
        {
            id: 1,
            title: "JavaScript ES6+ Mastery Badge",
            provider: "Mozilla Developer Network",
            duration: "2 weeks",
            effort: "3-5 hours/week",
            skills: ["JavaScript", "ES6+", "Modern Syntax"],
            level: "Intermediate",
            price: "$49",
            credentialType: "Digital Badge",
            verification: "Blockchain verified",
            acceptedBy: ["Google", "Microsoft", "Meta", "Netflix"],
            completionRate: 89,
            rating: 4.7
        },
        {
            id: 2,
            title: "UX Research Specialist Micro-Credential",
            provider: "Nielsen Norman Group",
            duration: "4 weeks",
            effort: "4-6 hours/week",
            skills: ["User Research", "Usability Testing", "Data Analysis"],
            level: "Advanced",
            price: "$199",
            credentialType: "Professional Certificate",
            verification: "Industry verified",
            acceptedBy: ["Apple", "Airbnb", "Spotify", "Adobe"],
            completionRate: 92,
            rating: 4.9
        }
    ];
    
    res.json({
        success: true,
        microCredentials
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date(),
        pathways: database.pathways.length,
        assessments: database.assessments.length
    });
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Wayforge Backend Server running on port ${PORT}`);
    console.log(`🤖 AI-Powered Pathway Generation: ACTIVE`);
    console.log(`📊 Real-time Analytics: ENABLED`);
    console.log(`🎯 Personalization Engine: OPTIMIZED`);
    console.log(`\n🌟 Ready to create mind-blowing learning experiences!`);
});

module.exports = app;
