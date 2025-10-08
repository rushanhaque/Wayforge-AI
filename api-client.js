// Advanced API Client for Wayforge Backend Integration
class WayforgeAPI {
    constructor() {
        this.baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api' 
            : '/api';
        this.cache = new Map();
        this.requestQueue = [];
        this.isOnline = navigator.onLine;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Network status monitoring
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    async request(endpoint, options = {}) {
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add request to queue if offline
        if (!this.isOnline) {
            return this.queueRequest(endpoint, config);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache successful GET requests
            if (config.method === 'GET') {
                this.cache.set(endpoint, { data, timestamp: Date.now() });
            }

            return data;
        } catch (error) {
            console.error(`API Request failed: ${endpoint}`, error);
            
            // Return cached data if available
            if (config.method === 'GET' && this.cache.has(endpoint)) {
                const cached = this.cache.get(endpoint);
                // Return cached data if less than 5 minutes old
                if (Date.now() - cached.timestamp < 300000) {
                    return cached.data;
                }
            }
            
            throw error;
        }
    }

    queueRequest(endpoint, config) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ endpoint, config, resolve, reject });
        });
    }

    async processQueue() {
        while (this.requestQueue.length > 0) {
            const { endpoint, config, resolve, reject } = this.requestQueue.shift();
            try {
                const result = await this.request(endpoint, config);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    }

    // Assessment API
    async saveAssessment(assessmentData) {
        return this.request('/assessment/save', {
            method: 'POST',
            body: JSON.stringify(assessmentData)
        });
    }

    // Pathway Generation API
    async generatePathway(userProfile, assessmentResults, preferences = {}) {
        const requestData = {
            userProfile,
            assessmentResults,
            preferences
        };

        return this.request('/generate-pathway', {
            method: 'POST',
            body: JSON.stringify(requestData)
        });
    }

    // Get user pathways
    async getUserPathways(userId) {
        return this.request(`/pathways/${userId}`);
    }

    // Recommendations API
    async getCourseRecommendations(userProfile, assessmentResults) {
        return this.request('/recommendations/courses', {
            method: 'POST',
            body: JSON.stringify({ userProfile, assessmentResults })
        });
    }

    // Opportunities API
    async getOpportunities() {
        return this.request('/opportunities');
    }

    // Micro-credentials API
    async getMicroCredentials() {
        return this.request('/micro-credentials');
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Enhanced Questionnaire Manager with Backend Integration
class EnhancedQuestionnaireManager extends QuestionnaireManager {
    constructor() {
        super();
        this.api = new WayforgeAPI();
        this.userProfile = this.loadUserProfile();
        this.isGeneratingPathway = false;
    }

    loadUserProfile() {
        const saved = localStorage.getItem('wayforge_user_profile');
        return saved ? JSON.parse(saved) : {
            id: `user_${Date.now()}`,
            name: '',
            email: '',
            careerGoals: '',
            timeCommitment: 10,
            budget: '',
            learningStyle: 'visual',
            experience: 'intermediate',
            interests: []
        };
    }

    saveUserProfile() {
        localStorage.setItem('wayforge_user_profile', JSON.stringify(this.userProfile));
    }

    async generateLearningPaths() {
        if (this.isGeneratingPathway) return;
        
        try {
            this.isGeneratingPathway = true;
            this.showPathwayGenerationUI();

            // Collect user preferences
            const preferences = this.collectUserPreferences();
            
            // Update user profile
            this.updateUserProfile();

            // Save assessment results
            await this.api.saveAssessment({
                userId: this.userProfile.id,
                results: this.formData,
                timestamp: new Date()
            });

            // Generate personalized pathway
            const response = await this.api.generatePathway(
                this.userProfile,
                this.formData,
                preferences
            );

            if (response.success) {
                this.displayGeneratedPathway(response.pathway);
                this.saveGeneratedPathway(response.pathway);
                this.showSuccessMessage("Your personalized learning pathway is ready!");
            } else {
                throw new Error(response.error || 'Failed to generate pathway');
            }

        } catch (error) {
            console.error('Error generating pathway:', error);
            this.showErrorMessage('Failed to generate pathway. Please try again.');
        } finally {
            this.isGeneratingPathway = false;
        }
    }

    collectUserPreferences() {
        return {
            learningStyle: this.userProfile.learningStyle,
            timeCommitment: this.userProfile.timeCommitment,
            budget: this.userProfile.budget,
            careerGoals: this.userProfile.careerGoals,
            preferredFormat: this.getPreferredFormat(),
            difficulty: this.getPreferredDifficulty(),
            timeline: this.getPreferredTimeline()
        };
    }

    updateUserProfile() {
        // Update profile based on questionnaire responses
        if (this.formData.careerGoals) {
            this.userProfile.careerGoals = this.formData.careerGoals;
        }
        if (this.formData.timeCommitment) {
            this.userProfile.timeCommitment = parseInt(this.formData.timeCommitment);
        }
        if (this.formData.learningStyle) {
            this.userProfile.learningStyle = this.formData.learningStyle;
        }
        
        this.saveUserProfile();
    }

    showPathwayGenerationUI() {
        // Create and show pathway generation modal
        const modal = document.createElement('div');
        modal.className = 'pathway-generation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="generation-header">
                    <h2>🤖 AI is crafting your perfect learning pathway...</h2>
                    <p>Analyzing your profile and creating a personalized journey</p>
                </div>
                <div class="generation-progress">
                    <div class="progress-steps">
                        <div class="step active">
                            <div class="step-icon">🧠</div>
                            <span>Analyzing Skills</span>
                        </div>
                        <div class="step">
                            <div class="step-icon">🎯</div>
                            <span>Matching Goals</span>
                        </div>
                        <div class="step">
                            <div class="step-icon">📚</div>
                            <span>Selecting Resources</span>
                        </div>
                        <div class="step">
                            <div class="step-icon">✨</div>
                            <span>Personalizing</span>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>
                <div class="generation-insights">
                    <div class="insight-item">
                        <span class="insight-label">Skill Match Score:</span>
                        <span class="insight-value">98%</span>
                    </div>
                    <div class="insight-item">
                        <span class="insight-label">Career Alignment:</span>
                        <span class="insight-value">Perfect</span>
                    </div>
                    <div class="insight-item">
                        <span class="insight-label">Learning Style:</span>
                        <span class="insight-value">Visual + Hands-on</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate progress
        this.animatePathwayGeneration(modal);
    }

    animatePathwayGeneration(modal) {
        const steps = modal.querySelectorAll('.step');
        const progressFill = modal.querySelector('.progress-fill');
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep > 0) {
                steps[currentStep - 1].classList.remove('active');
                steps[currentStep - 1].classList.add('completed');
            }
            
            if (currentStep < steps.length) {
                steps[currentStep].classList.add('active');
                progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 800);
    }

    displayGeneratedPathway(pathway) {
        // Remove generation modal
        const modal = document.querySelector('.pathway-generation-modal');
        if (modal) modal.remove();

        // Create pathway display
        const pathwayDisplay = document.createElement('div');
        pathwayDisplay.className = 'pathway-display-modal';
        pathwayDisplay.innerHTML = `
            <div class="modal-content">
                <div class="pathway-header">
                    <div class="pathway-score">
                        <div class="score-circle">
                            <span class="score-number">${pathway.personalizedScore}</span>
                            <span class="score-label">Match Score</span>
                        </div>
                    </div>
                    <div class="pathway-info">
                        <h1>${pathway.title}</h1>
                        <p class="pathway-description">${pathway.description}</p>
                        <div class="pathway-meta">
                            <span class="duration">📅 ${pathway.duration}</span>
                            <span class="difficulty">⚡ ${pathway.difficulty}</span>
                            <span class="phases">📚 ${pathway.phases.length} Phases</span>
                        </div>
                    </div>
                </div>

                <div class="pathway-phases">
                    <h3>Your Learning Journey</h3>
                    <div class="phases-timeline">
                        ${pathway.phases.map((phase, index) => `
                            <div class="phase-card">
                                <div class="phase-number">${index + 1}</div>
                                <div class="phase-content">
                                    <h4>${phase.title}</h4>
                                    <p>${phase.description}</p>
                                    <div class="phase-stats">
                                        <span>📖 ${phase.modules.length} Modules</span>
                                        <span>⏱️ ${phase.duration}</span>
                                        <span>🎯 ${phase.projects.length} Projects</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="pathway-recommendations">
                    <h3>Recommended for You</h3>
                    <div class="recommendations-grid">
                        ${pathway.recommendations.courses.slice(0, 3).map(course => `
                            <div class="recommendation-card">
                                <div class="rec-score">${course.matchScore}%</div>
                                <h4>${course.title}</h4>
                                <p class="rec-provider">${course.provider}</p>
                                <div class="rec-meta">
                                    <span>⭐ ${course.rating}</span>
                                    <span>⏱️ ${course.duration}</span>
                                    <span>💰 ${course.price}</span>
                                </div>
                                <div class="rec-reasons">
                                    ${course.reasons.slice(0, 2).map(reason => `
                                        <span class="reason-tag">✓ ${reason}</span>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="pathway-actions">
                    <button class="btn btn-primary pathway-start-btn">
                        🚀 Start Your Journey
                    </button>
                    <button class="btn btn-outline pathway-customize-btn">
                        ⚙️ Customize Pathway
                    </button>
                    <button class="btn btn-outline pathway-save-btn">
                        💾 Save for Later
                    </button>
                </div>

                <button class="close-pathway-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(pathwayDisplay);
        
        // Add event listeners
        this.bindPathwayEvents(pathwayDisplay, pathway);
        
        // Animate entrance
        setTimeout(() => pathwayDisplay.classList.add('show'), 100);
    }

    bindPathwayEvents(modal, pathway) {
        const startBtn = modal.querySelector('.pathway-start-btn');
        const customizeBtn = modal.querySelector('.pathway-customize-btn');
        const saveBtn = modal.querySelector('.pathway-save-btn');
        const closeBtn = modal.querySelector('.close-pathway-btn');

        startBtn.addEventListener('click', () => {
            this.startLearningJourney(pathway);
        });

        customizeBtn.addEventListener('click', () => {
            this.customizePathway(pathway);
        });

        saveBtn.addEventListener('click', () => {
            this.savePathwayForLater(pathway);
        });

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
    }

    startLearningJourney(pathway) {
        // Navigate to learning paths page with the generated pathway
        localStorage.setItem('active_pathway', JSON.stringify(pathway));
        window.location.href = 'learning-paths.html';
    }

    saveGeneratedPathway(pathway) {
        const pathways = JSON.parse(localStorage.getItem('generated_pathways') || '[]');
        pathways.unshift(pathway);
        localStorage.setItem('generated_pathways', JSON.stringify(pathways.slice(0, 10))); // Keep last 10
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Helper methods
    getPreferredFormat() {
        // Analyze user responses to determine preferred learning format
        return 'mixed'; // video, text, interactive, mixed
    }

    getPreferredDifficulty() {
        // Determine preferred difficulty based on assessment
        const avgScore = Object.values(this.formData).flat().reduce((a, b) => a + b, 0) / Object.values(this.formData).flat().length;
        if (avgScore < 2.5) return 'beginner';
        if (avgScore < 3.5) return 'intermediate';
        return 'advanced';
    }

    getPreferredTimeline() {
        return this.userProfile.timeCommitment > 15 ? 'intensive' : 'flexible';
    }
}

// Initialize API client globally
window.wayforgeAPI = new WayforgeAPI();

// Enhanced Dashboard Manager with Real Data
class EnhancedDashboardManager extends DashboardManager {
    constructor() {
        super();
        this.api = new WayforgeAPI();
        this.realTimeData = {
            opportunities: [],
            microCredentials: [],
            recommendations: []
        };
    }

    async init() {
        await this.loadRealTimeData();
        super.init();
        this.updateWithRealData();
    }

    async loadRealTimeData() {
        try {
            // Load real opportunities and credentials
            const [opportunities, microCredentials] = await Promise.all([
                this.api.getOpportunities(),
                this.api.getMicroCredentials()
            ]);

            this.realTimeData.opportunities = opportunities.opportunities || [];
            this.realTimeData.microCredentials = microCredentials.microCredentials || [];
        } catch (error) {
            console.error('Error loading real-time data:', error);
        }
    }

    updateWithRealData() {
        this.updateOpportunities();
        this.updateMicroCredentials();
    }

    updateOpportunities() {
        const container = document.querySelector('.opportunities-section');
        if (!container || this.realTimeData.opportunities.length === 0) return;

        const opportunitiesHTML = this.realTimeData.opportunities.slice(0, 6).map(opp => `
            <div class="opportunity-card" data-type="${opp.type.toLowerCase()}">
                <div class="opp-header">
                    <div class="opp-type">${opp.type}</div>
                    <div class="opp-date">${new Date(opp.date).toLocaleDateString()}</div>
                </div>
                <h3>${opp.title}</h3>
                <p>${opp.description}</p>
                <div class="opp-meta">
                    <span class="level">📊 ${opp.level}</span>
                    <span class="duration">⏱️ ${opp.duration}</span>
                    <span class="price">💰 ${opp.price}</span>
                </div>
                <div class="opp-skills">
                    ${opp.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="opp-actions">
                    <button class="btn btn-primary btn-sm">Apply Now</button>
                    <button class="btn btn-outline btn-sm">Learn More</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <h2>🎯 Live Opportunities</h2>
            <div class="opportunities-grid">
                ${opportunitiesHTML}
            </div>
        `;
    }

    updateMicroCredentials() {
        const container = document.querySelector('.micro-credentials-section');
        if (!container || this.realTimeData.microCredentials.length === 0) return;

        const credentialsHTML = this.realTimeData.microCredentials.map(cred => `
            <div class="credential-card">
                <div class="cred-header">
                    <div class="cred-provider">${cred.provider}</div>
                    <div class="cred-rating">⭐ ${cred.rating}</div>
                </div>
                <h3>${cred.title}</h3>
                <div class="cred-meta">
                    <span>⏱️ ${cred.duration}</span>
                    <span>📈 ${cred.level}</span>
                    <span>💰 ${cred.price}</span>
                </div>
                <div class="cred-verification">
                    <i class="fas fa-certificate"></i>
                    <span>${cred.verification}</span>
                </div>
                <div class="cred-acceptance">
                    <span>Accepted by:</span>
                    <div class="company-logos">
                        ${cred.acceptedBy.slice(0, 4).map(company => `
                            <span class="company-tag">${company}</span>
                        `).join('')}
                    </div>
                </div>
                <button class="btn btn-primary btn-sm">Enroll Now</button>
            </div>
        `).join('');

        container.innerHTML = `
            <h2>🏆 Micro-Credentials</h2>
            <div class="credentials-grid">
                ${credentialsHTML}
            </div>
        `;
    }
}

// Initialize enhanced managers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the questionnaire page
    if (window.location.pathname.includes('questionnaire.html')) {
        window.questionnaireManager = new EnhancedQuestionnaireManager();
    }
    
    // Check if we're on the dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        window.dashboardManager = new EnhancedDashboardManager();
        window.dashboardManager.init();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WayforgeAPI, EnhancedQuestionnaireManager, EnhancedDashboardManager };
}
