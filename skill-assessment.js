// Skill Assessment Manager
class SkillAssessmentManager {
    constructor() {
        this.currentCategory = null;
        this.currentQuestion = 0;
        this.assessmentData = {};
        this.questions = this.initializeQuestions();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedAssessments();
        this.updateOverallProgress();
    }

    initializeQuestions() {
        return {
            programming: [
                { skill: 'JavaScript', description: 'Client-side and server-side JavaScript development' },
                { skill: 'Python', description: 'General programming and data analysis' },
                { skill: 'HTML/CSS', description: 'Web markup and styling' },
                { skill: 'React', description: 'Frontend framework for building UIs' },
                { skill: 'Node.js', description: 'Server-side JavaScript runtime' },
                { skill: 'Git', description: 'Version control and collaboration' },
                { skill: 'SQL', description: 'Database querying and management' },
                { skill: 'API Development', description: 'RESTful services and integrations' },
                { skill: 'Testing', description: 'Unit testing and test-driven development' },
                { skill: 'DevOps', description: 'Deployment and infrastructure management' },
                { skill: 'Mobile Development', description: 'iOS/Android app development' },
                { skill: 'Machine Learning', description: 'AI and predictive modeling' },
                { skill: 'Cybersecurity', description: 'Security practices and protocols' },
                { skill: 'Cloud Computing', description: 'AWS, Azure, or Google Cloud' },
                { skill: 'Blockchain', description: 'Distributed ledger technologies' }
            ],
            design: [
                { skill: 'UI Design', description: 'User interface design principles' },
                { skill: 'UX Research', description: 'User experience research methods' },
                { skill: 'Figma', description: 'Design and prototyping tool' },
                { skill: 'Adobe Creative Suite', description: 'Photoshop, Illustrator, etc.' },
                { skill: 'Wireframing', description: 'Low-fidelity design planning' },
                { skill: 'Prototyping', description: 'Interactive design mockups' },
                { skill: 'Typography', description: 'Font selection and text design' },
                { skill: 'Color Theory', description: 'Color psychology and harmony' },
                { skill: 'Branding', description: 'Brand identity and visual systems' },
                { skill: 'Motion Graphics', description: 'Animation and video design' },
                { skill: 'Web Design', description: 'Responsive web interfaces' },
                { skill: 'Design Systems', description: 'Scalable design frameworks' }
            ],
            data: [
                { skill: 'Statistics', description: 'Statistical analysis and inference' },
                { skill: 'Python for Data', description: 'Pandas, NumPy, and data manipulation' },
                { skill: 'R Programming', description: 'Statistical computing and graphics' },
                { skill: 'SQL Analytics', description: 'Advanced database querying' },
                { skill: 'Data Visualization', description: 'Charts, graphs, and dashboards' },
                { skill: 'Machine Learning', description: 'Predictive modeling and AI' },
                { skill: 'Deep Learning', description: 'Neural networks and AI' },
                { skill: 'Big Data', description: 'Hadoop, Spark, and large datasets' },
                { skill: 'Business Intelligence', description: 'BI tools and reporting' },
                { skill: 'Data Mining', description: 'Pattern discovery in data' },
                { skill: 'A/B Testing', description: 'Experimental design and analysis' },
                { skill: 'Tableau', description: 'Data visualization platform' },
                { skill: 'Excel Advanced', description: 'Advanced spreadsheet analysis' },
                { skill: 'Cloud Analytics', description: 'AWS/Azure data services' },
                { skill: 'ETL Processes', description: 'Extract, Transform, Load pipelines' },
                { skill: 'Data Governance', description: 'Data quality and compliance' },
                { skill: 'Time Series Analysis', description: 'Temporal data analysis' },
                { skill: 'Natural Language Processing', description: 'Text analysis and NLP' }
            ],
            business: [
                { skill: 'Project Management', description: 'Planning and executing projects' },
                { skill: 'Digital Marketing', description: 'Online marketing strategies' },
                { skill: 'Financial Analysis', description: 'Financial modeling and analysis' },
                { skill: 'Strategic Planning', description: 'Long-term business strategy' },
                { skill: 'Leadership', description: 'Team management and motivation' },
                { skill: 'Sales', description: 'Sales processes and techniques' },
                { skill: 'Customer Service', description: 'Client relationship management' },
                { skill: 'Entrepreneurship', description: 'Starting and running businesses' },
                { skill: 'Negotiation', description: 'Deal-making and conflict resolution' },
                { skill: 'Public Speaking', description: 'Presentation and communication skills' }
            ]
        };
    }

    bindEvents() {
        // Category selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-card')) {
                const card = e.target.closest('.category-card');
                const category = card.dataset.category;
                this.startAssessment(category);
            }

            if (e.target.matches('#closeAssessment')) {
                this.closeAssessment();
            }

            if (e.target.matches('#nextQuestion')) {
                this.nextQuestion();
            }

            if (e.target.matches('#prevQuestion')) {
                this.prevQuestion();
            }
        });

        // Radio button changes
        document.addEventListener('change', (e) => {
            if (e.target.name === 'skill-level') {
                this.saveCurrentAnswer(e.target.value);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAssessment();
            }
        });
    }

    startAssessment(category) {
        this.currentCategory = category;
        this.currentQuestion = 0;
        
        // Initialize assessment data for this category
        if (!this.assessmentData[category]) {
            this.assessmentData[category] = {};
        }

        // Show modal
        const modal = document.getElementById('assessmentModal');
        const title = document.getElementById('modalTitle');
        
        title.textContent = `${this.capitalizeFirst(category)} Assessment`;
        modal.classList.add('show');
        
        this.loadQuestion();
    }

    loadQuestion() {
        const questions = this.questions[this.currentCategory];
        const question = questions[this.currentQuestion];
        
        if (!question) {
            this.completeAssessment();
            return;
        }

        // Update progress
        document.querySelector('.current-question').textContent = this.currentQuestion + 1;
        document.querySelector('.total-questions').textContent = questions.length;

        // Update question content
        document.querySelector('.question-title').textContent = 
            `How would you rate your ${question.skill} skills?`;

        // Clear previous selection
        const radioButtons = document.querySelectorAll('input[name="skill-level"]');
        radioButtons.forEach(radio => radio.checked = false);

        // Load saved answer if exists
        const savedAnswer = this.assessmentData[this.currentCategory][question.skill];
        if (savedAnswer) {
            const radio = document.querySelector(`input[name="skill-level"][value="${savedAnswer}"]`);
            if (radio) radio.checked = true;
        }

        // Update navigation buttons
        document.getElementById('prevQuestion').disabled = this.currentQuestion === 0;
        document.getElementById('nextQuestion').textContent = 
            this.currentQuestion === questions.length - 1 ? 'Complete' : 'Next';
    }

    saveCurrentAnswer(value) {
        const questions = this.questions[this.currentCategory];
        const question = questions[this.currentQuestion];
        
        this.assessmentData[this.currentCategory][question.skill] = parseInt(value);
        this.saveAssessmentData();
    }

    nextQuestion() {
        const questions = this.questions[this.currentCategory];
        
        if (this.currentQuestion < questions.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
        } else {
            this.completeAssessment();
        }
    }

    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
        }
    }

    completeAssessment() {
        this.closeAssessment();
        this.updateCategoryProgress(this.currentCategory);
        this.updateOverallProgress();
        this.showCompletionMessage();
    }

    closeAssessment() {
        const modal = document.getElementById('assessmentModal');
        modal.classList.remove('show');
    }

    updateCategoryProgress(category) {
        const card = document.querySelector(`[data-category="${category}"]`);
        if (!card) return;

        const questions = this.questions[category];
        const answers = this.assessmentData[category] || {};
        const completed = Object.keys(answers).length;
        const total = questions.length;
        const percentage = Math.round((completed / total) * 100);

        // Update skill count
        const skillCount = card.querySelector('.skill-count');
        skillCount.textContent = `${completed}/${total} Skills`;

        // Update completion rate
        const completionRate = card.querySelector('.completion-rate');
        completionRate.textContent = `${percentage}%`;

        // Update button text
        const button = card.querySelector('.btn');
        if (completed === total) {
            button.textContent = 'View Results';
            button.classList.add('completed');
        } else if (completed > 0) {
            button.textContent = 'Continue Assessment';
        }
    }

    updateOverallProgress() {
        const totalQuestions = Object.values(this.questions).reduce((sum, q) => sum + q.length, 0);
        const completedQuestions = Object.values(this.assessmentData).reduce((sum, category) => {
            return sum + Object.keys(category).length;
        }, 0);

        const percentage = Math.round((completedQuestions / totalQuestions) * 100);
        
        // Update progress circle
        const progressFill = document.querySelector('.progress-ring-fill');
        const progressText = document.querySelector('.progress-percent');
        
        if (progressFill && progressText) {
            const circumference = 2 * Math.PI * 52; // radius = 52
            const offset = circumference - (percentage / 100) * circumference;
            
            progressFill.style.strokeDashoffset = offset;
            progressText.textContent = `${percentage}%`;
        }

        // Show results if all assessments complete
        if (percentage === 100) {
            this.showResults();
        }
    }

    showResults() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        
        this.generateSkillsChart();
        this.generateRecommendations();
    }

    generateSkillsChart() {
        // This would integrate with a charting library like Chart.js
        // For now, we'll create a simple visual representation
        const canvas = document.getElementById('skillsChart');
        const ctx = canvas.getContext('2d');
        
        // Simple radar chart representation
        const categories = Object.keys(this.assessmentData);
        const scores = categories.map(cat => {
            const answers = Object.values(this.assessmentData[cat]);
            return answers.length > 0 ? answers.reduce((a, b) => a + b, 0) / answers.length : 0;
        });

        // Draw a simple chart (this would be replaced with Chart.js)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#6366f1';
        ctx.font = '14px Arial';
        
        categories.forEach((cat, index) => {
            const score = scores[index];
            const barHeight = (score / 5) * 100;
            const x = 50 + index * 80;
            const y = 300 - barHeight;
            
            ctx.fillRect(x, y, 60, barHeight);
            ctx.fillStyle = '#374151';
            ctx.fillText(cat, x, 320);
            ctx.fillStyle = '#6366f1';
        });
    }

    generateRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        
        // Analyze skills and generate recommendations
        const recommendations = this.analyzeSkillsAndRecommend();
        
        recommendationsList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="rec-icon">
                    <i class="${rec.icon}"></i>
                </div>
                <div class="rec-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <div class="rec-meta">
                        <span class="difficulty">${rec.difficulty}</span>
                        <span class="duration">${rec.duration}</span>
                    </div>
                </div>
                <button class="btn btn-outline btn-sm">Explore Path</button>
            </div>
        `).join('');
    }

    analyzeSkillsAndRecommend() {
        // Simple recommendation logic based on assessment results
        const recommendations = [];
        
        Object.keys(this.assessmentData).forEach(category => {
            const answers = this.assessmentData[category];
            const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / Object.values(answers).length;
            
            if (avgScore < 3) {
                recommendations.push({
                    title: `${this.capitalizeFirst(category)} Fundamentals`,
                    description: `Build strong foundations in ${category}`,
                    icon: this.getCategoryIcon(category),
                    difficulty: 'Beginner',
                    duration: '2-3 months'
                });
            } else if (avgScore >= 3 && avgScore < 4) {
                recommendations.push({
                    title: `Advanced ${this.capitalizeFirst(category)}`,
                    description: `Take your ${category} skills to the next level`,
                    icon: this.getCategoryIcon(category),
                    difficulty: 'Intermediate',
                    duration: '3-4 months'
                });
            }
        });

        return recommendations;
    }

    getCategoryIcon(category) {
        const icons = {
            programming: 'fas fa-code',
            design: 'fas fa-palette',
            data: 'fas fa-chart-bar',
            business: 'fas fa-briefcase'
        };
        return icons[category] || 'fas fa-book';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    saveAssessmentData() {
        localStorage.setItem('wayforge_skill_assessment', JSON.stringify(this.assessmentData));
    }

    loadSavedAssessments() {
        const saved = localStorage.getItem('wayforge_skill_assessment');
        if (saved) {
            try {
                this.assessmentData = JSON.parse(saved);
                
                // Update all category progress
                Object.keys(this.assessmentData).forEach(category => {
                    this.updateCategoryProgress(category);
                });
            } catch (e) {
                console.error('Error loading saved assessments:', e);
            }
        }
    }

    showCompletionMessage() {
        // Create and show completion notification
        const notification = document.createElement('div');
        notification.className = 'completion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <h3>Assessment Complete!</h3>
                <p>Your ${this.currentCategory} skills have been evaluated.</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkillAssessmentManager();
});
