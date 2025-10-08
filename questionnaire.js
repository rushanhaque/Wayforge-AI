// Questionnaire functionality
class QuestionnaireManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 10;
        this.formData = {};
        this.init();
    }

    init() {
        this.handleURLParameters();
        this.bindEvents();
        this.updateProgress();
        this.initializeSkillSliders();
        this.loadSavedData();
    }

    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const stepParam = urlParams.get('step');
        const freshParam = urlParams.get('fresh');
        const continueParam = urlParams.get('continue');
        
        if (freshParam === 'true') {
            // Fresh start - clear all data and start from step 1
            this.clearSavedData();
            this.currentStep = 1;
        } else if (stepParam && continueParam === 'true') {
            // Continue from saved step
            this.currentStep = parseInt(stepParam) || 1;
        } else if (stepParam) {
            // Direct step navigation
            this.currentStep = parseInt(stepParam) || 1;
        } else {
            // Default behavior - load from saved progress
            this.loadProgress();
        }
        
        // Ensure step is within valid range
        this.currentStep = Math.max(1, Math.min(this.currentStep, this.totalSteps));
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('generateBtn').addEventListener('click', () => this.generateLearningPaths());

        // Form inputs
        this.bindFormInputs();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }

    bindFormInputs() {
        // Text inputs
        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], select, textarea');
        textInputs.forEach(input => {
            input.addEventListener('change', () => this.saveFormData());
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Checkboxes for interests
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveFormData();
                this.animateInterestSelection(checkbox);
            });
        });

        // Radio buttons for preferences
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                this.saveFormData();
                this.animatePreferenceSelection(radio);
            });
        });
    }

    initializeSkillSliders() {
        const sliders = document.querySelectorAll('.slider');
        const skillLevels = ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
        
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                const skillItem = e.target.closest('.skill-item');
                const levelText = skillItem.querySelector('.skill-level-text');
                
                levelText.textContent = skillLevels[value];
                levelText.style.color = this.getSkillLevelColor(value);
                
                // Add animation
                levelText.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    levelText.style.transform = 'scale(1)';
                }, 200);
                
                this.saveFormData();
            });
        });
    }

    getSkillLevelColor(level) {
        const colors = [
            '#6b7280', // None - gray
            '#f59e0b', // Beginner - yellow
            '#3b82f6', // Intermediate - blue
            '#10b981', // Advanced - green
            '#8b5cf6'  // Expert - purple
        ];
        return colors[level] || colors[0];
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.updateProgress();
                this.saveProgress();
                this.animateStepTransition();
            }
        } else {
            this.showValidationError();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgress();
            this.saveProgress();
            this.animateStepTransition();
        }
    }

    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.question-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        document.getElementById(`step${this.currentStep}`).classList.add('active');

        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const generateBtn = document.getElementById('generateBtn');

        // Show/hide previous button
        prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';

        // Show/hide next vs generate button
        if (this.currentStep === this.totalSteps) {
            nextBtn.style.display = 'none';
            generateBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            generateBtn.style.display = 'none';
        }
    }

    updateProgress() {
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        const progressFill = document.getElementById('progressBarFill');
        progressFill.style.width = `${progressPercentage}%`;
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        // Only consider fields visible within the current step
        const requiredFields = Array.from(currentStepElement.querySelectorAll('[required]')).filter(el => this.isElementVisible(el));
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for step 3 (interests)
        if (this.currentStep === 3) {
            const checkedInterests = currentStepElement.querySelectorAll('input[type="checkbox"]:checked');
            if (checkedInterests.length === 0) {
                this.showError('Please select at least one area of interest.');
                isValid = false;
            }
        }

        // Special validation for step 6 (preferences)
        if (this.currentStep === 6) {
            const requiredRadioGroups = ['learningStyle', 'timeCommitment', 'difficulty', 'budget'];
            requiredRadioGroups.forEach(groupName => {
                const checkedRadio = currentStepElement.querySelector(`input[name="${groupName}"]:checked`);
                if (!checkedRadio) {
                    this.showError(`Please select your ${groupName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                    isValid = false;
                }
            });
        }

        return isValid;
    }

    validateField(field) {
        // Skip validation for hidden/disabled fields
        if (!this.isElementVisible(field) || field.disabled) {
            return true;
        }

        const value = (field.value || '').toString().trim();
        let isValid = true;

        // Remove previous error styling
        field.classList.remove('error');

        if (field.hasAttribute('required')) {
            if (field.type === 'radio') {
                // Validate radio group: at least one checked in this step
                const groupName = field.name;
                const container = field.closest('.question-step') || document;
                const checked = container.querySelector(`input[type="radio"][name="${groupName}"]:checked`);
                isValid = !!checked;
            } else if (field.tagName.toLowerCase() === 'select') {
                isValid = value !== '';
            } else {
                isValid = value.length > 0;
            }
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        // Add error styling if invalid
        if (!isValid) {
            field.classList.add('error');
            this.addShakeAnimation(field);
        }

        return isValid;
    }

    isElementVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        const notDisplayed = style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
        // Also ensure all ancestors are visible
        let parent = el;
        while (parent) {
            const parentStyle = window.getComputedStyle(parent);
            if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden' || parentStyle.opacity === '0') {
                return false;
            }
            parent = parent.parentElement;
        }
        // Element considered visible if it has dimensions and is in the document flow
        const rect = el.getBoundingClientRect();
        return !(notDisplayed) && rect.width >= 0 && rect.height >= 0;
    }

    showValidationError() {
        this.showError('Please fill in all required fields before proceeding.');
    }

    showError(message) {
        // Create or update error message
        let errorElement = document.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                position: fixed;
                top: 120px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                font-weight: 500;
                z-index: 1000;
                box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
                backdrop-filter: blur(10px);
                opacity: 0;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.opacity = '1';
        errorElement.style.transform = 'translateX(-50%) translateY(0)';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorElement) {
                errorElement.style.opacity = '0';
                errorElement.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => {
                    if (errorElement.parentNode) {
                        errorElement.parentNode.removeChild(errorElement);
                    }
                }, 300);
            }
        }, 5000);
    }

    addShakeAnimation(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    animateStepTransition() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        currentStepElement.style.opacity = '0';
        currentStepElement.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            currentStepElement.style.transition = 'all 0.5s ease';
            currentStepElement.style.opacity = '1';
            currentStepElement.style.transform = 'translateX(0)';
        }, 50);
    }

    animateInterestSelection(checkbox) {
        const option = checkbox.closest('.interest-option');
        if (checkbox.checked) {
            option.style.transform = 'scale(1.05)';
            option.style.background = 'rgba(99, 102, 241, 0.1)';
            option.style.borderColor = 'var(--primary-color)';
        } else {
            option.style.transform = 'scale(1)';
            option.style.background = 'rgba(255, 255, 255, 0.02)';
            option.style.borderColor = 'transparent';
        }
        
        setTimeout(() => {
            option.style.transform = 'scale(1)';
        }, 200);
    }

    animatePreferenceSelection(radio) {
        const allOptions = document.querySelectorAll(`input[name="${radio.name}"]`);
        allOptions.forEach(option => {
            const content = option.nextElementSibling;
            content.style.transform = 'scale(1)';
            content.style.boxShadow = 'none';
        });

        const selectedContent = radio.nextElementSibling;
        selectedContent.style.transform = 'scale(1.02)';
        selectedContent.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.2)';
        
        setTimeout(() => {
            selectedContent.style.transform = 'scale(1)';
        }, 300);
    }

    saveFormData() {
        const formData = {};
        
        // Text inputs, selects, and textareas (only from current step to avoid pulling hidden/irrelevant values)
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        currentStepElement.querySelectorAll('input[type="text"], input[type="email"], select, textarea').forEach(input => {
            if (input.id) {
                formData[input.id] = input.value;
            }
        });

        // Checkboxes (interests)
        const interests = [];
        currentStepElement.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            interests.push(checkbox.value);
        });
        formData.interests = interests;

        // Others input fields for interests
        const othersFields = {
            techOthers: document.getElementById('techOthers')?.value || '',
            businessOthers: document.getElementById('businessOthers')?.value || '',
            creativeOthers: document.getElementById('creativeOthers')?.value || '',
            scienceOthers: document.getElementById('scienceOthers')?.value || '',
            educationOthers: document.getElementById('educationOthers')?.value || '',
            socialOthers: document.getElementById('socialOthers')?.value || ''
        };
        formData.othersInterests = othersFields;

        // Radio buttons (preferences)
        currentStepElement.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            formData[radio.name] = radio.value;
        });

        // Skill sliders
        const skills = {};
        document.querySelectorAll('.slider').forEach(slider => {
            const skillName = slider.getAttribute('data-skill');
            if (skillName) {
                skills[skillName] = parseInt(slider.value);
            }
        });
        formData.skills = skills;

        // Others input fields for skills
        const othersSkills = {
            technicalSkillsOthers: document.getElementById('technicalSkillsOthers')?.value || '',
            creativeSkillsOthers: document.getElementById('creativeSkillsOthers')?.value || '',
            businessSkillsOthers: document.getElementById('businessSkillsOthers')?.value || '',
            softSkillsOthers: document.getElementById('softSkillsOthers')?.value || ''
        };
        formData.othersSkills = othersSkills;

        // AI/ML Profiling Data
        formData.aiProfile = {
            timestamp: new Date().toISOString(),
            completionPercentage: (this.currentStep / this.totalSteps) * 100,
            detailedResponses: this.currentStep >= 3,
            comprehensiveSkillsAssessed: this.currentStep >= 4
        };

        this.formData = formData;
        localStorage.setItem('wayforge_questionnaire_data', JSON.stringify(formData));
        
        // Also save to a separate AI analysis storage for advanced processing
        localStorage.setItem('wayforge_ai_profile_data', JSON.stringify({
            ...formData,
            analysisMetadata: {
                nsqfAlignment: formData.nsqfLevel || 'not-specified',
                multilingualSupport: formData.nativeLanguage || 'not-specified',
                accessibilityNeeds: 'to-be-assessed',
                socioEconomicContext: 'to-be-assessed'
            }
        }));
    }

    loadSavedData() {
        const savedData = localStorage.getItem('wayforge_questionnaire_data');
        if (savedData) {
            try {
                this.formData = JSON.parse(savedData);
                this.populateForm();
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    populateForm() {
        // Populate text inputs, selects, and textareas
        Object.keys(this.formData).forEach(key => {
            const element = document.getElementById(key);
            if (element && typeof this.formData[key] === 'string') {
                element.value = this.formData[key];
            }
        });

        // Populate interests
        if (this.formData.interests) {
            this.formData.interests.forEach(interest => {
                const checkbox = document.querySelector(`input[type="checkbox"][value="${interest}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    this.animateInterestSelection(checkbox);
                }
            });
        }

        // Populate preferences
        Object.keys(this.formData).forEach(key => {
            if (typeof this.formData[key] === 'string') {
                const radio = document.querySelector(`input[type="radio"][name="${key}"][value="${this.formData[key]}"]`);
                if (radio) {
                    radio.checked = true;
                    this.animatePreferenceSelection(radio);
                }
            }
        });

        // Populate skills
        if (this.formData.skills) {
            Object.keys(this.formData.skills).forEach(skill => {
                const slider = document.querySelector(`[data-skill="${skill}"]`);
                if (slider) {
                    slider.value = this.formData.skills[skill];
                    slider.dispatchEvent(new Event('input'));
                }
            });
        }
    }

    saveProgress() {
        localStorage.setItem('wayforge_questionnaire_step', this.currentStep.toString());
    }

    loadProgress() {
        const savedStep = localStorage.getItem('wayforge_questionnaire_step');
        if (savedStep) {
            this.currentStep = parseInt(savedStep);
            this.updateStepDisplay();
            this.updateProgress();
        }
    }

    handleKeyNavigation(e) {
        // Allow Enter to proceed to next step
        if (e.key === 'Enter' && !e.shiftKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (this.currentStep < this.totalSteps) {
                    this.nextStep();
                } else {
                    this.generateLearningPaths();
                }
            }
        }

        // Allow Escape to go back
        if (e.key === 'Escape') {
            this.prevStep();
        }
    }

    async generateLearningPaths() {
        if (!this.validateCurrentStep()) {
            this.showValidationError();
            return;
        }

        const generateBtn = document.getElementById('generateBtn');
        const originalContent = generateBtn.innerHTML;
        
        // Show loading state
        generateBtn.classList.add('loading');
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Your Paths...';

        try {
            // Save final form data
            this.saveFormData();
            
            // Simulate API call for generating learning paths
            await this.simulatePathGeneration();
            
            // Navigate to results page
            this.navigateToResults();
            
        } catch (error) {
            console.error('Error generating learning paths:', error);
            this.showError('An error occurred while generating your learning paths. Please try again.');
            
            // Reset button state
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalContent;
        }
    }

    async simulatePathGeneration() {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock learning paths based on form data
        const paths = this.generateMockPaths();
        localStorage.setItem('wayforge_generated_paths', JSON.stringify(paths));
    }

    generateMockPaths() {
        const { interests, skills, careerGoal, timeframe, learningStyle } = this.formData;
        
        const paths = [
            {
                id: 1,
                title: "Full-Stack Developer Path",
                description: "Comprehensive journey to become a full-stack web developer",
                duration: "6-12 months",
                difficulty: "Intermediate",
                skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "Database Design"],
                resources: 45,
                projects: 8,
                certificates: 3,
                matchScore: 92
            },
            {
                id: 2,
                title: "Data Science Specialist",
                description: "Master data analysis, machine learning, and statistical modeling",
                duration: "8-14 months",
                difficulty: "Advanced",
                skills: ["Python", "Statistics", "Machine Learning", "Data Visualization", "SQL"],
                resources: 38,
                projects: 6,
                certificates: 4,
                matchScore: 87
            },
            {
                id: 3,
                title: "UX/UI Designer Track",
                description: "Create exceptional user experiences through design thinking",
                duration: "4-8 months",
                difficulty: "Beginner-Friendly",
                skills: ["Design Principles", "Figma", "User Research", "Prototyping", "Usability Testing"],
                resources: 32,
                projects: 10,
                certificates: 2,
                matchScore: 84
            }
        ];

        return paths;
    }

    navigateToResults() {
        // Add page transition effect
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <i class="fas fa-magic" style="font-size: 4rem; margin-bottom: 2rem; animation: pulse 2s infinite;"></i>
                <h2 style="font-size: 2rem; margin-bottom: 1rem;">Crafting Your Perfect Learning Paths</h2>
                <p style="font-size: 1.2rem; opacity: 0.9;">Analyzing your preferences and generating personalized recommendations...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            window.location.href = 'learning-paths.html';
        }, 3000);
    }

    // Utility method to clear all saved data
    clearSavedData() {
        localStorage.removeItem('wayforge_questionnaire_data');
        localStorage.removeItem('wayforge_questionnaire_step');
        localStorage.removeItem('wayforge_generated_paths');
    }
}

// Initialize questionnaire when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const questionnaire = new QuestionnaireManager();
    
    // Load saved progress if available
    questionnaire.loadProgress();
    
    // Add some entrance animations
    setTimeout(() => {
        document.querySelectorAll('.question-card, .interest-category, .skill-item, .preference-card').forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});

// Add CSS for error styling
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        background: rgba(239, 68, 68, 0.05) !important;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(errorStyles);
