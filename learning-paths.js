// Learning Paths Page Manager
class LearningPathsManager {
    constructor() {
        this.paths = [];
        this.selectedPath = null;
        this.init();
    }

    init() {
        this.loadGeneratedPaths();
        this.renderPaths();
        this.bindEvents();
        this.animateEntrance();
    }

    loadGeneratedPaths() {
        // Load paths from localStorage (generated in questionnaire)
        const savedPaths = localStorage.getItem('wayforge_generated_paths');
        if (savedPaths) {
            try {
                this.paths = JSON.parse(savedPaths);
            } catch (e) {
                console.error('Error loading saved paths:', e);
                this.generateDefaultPaths();
            }
        } else {
            this.generateDefaultPaths();
        }
    }

    generateDefaultPaths() {
        // Fallback paths if none are saved
        this.paths = [
            {
                id: 1,
                title: "Full-Stack Developer Path",
                description: "Comprehensive journey to become a full-stack web developer with modern technologies",
                duration: "6-12 months",
                difficulty: "Intermediate",
                skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "Database Design", "API Development"],
                resources: 45,
                projects: 8,
                certificates: 3,
                matchScore: 92,
                curriculum: [
                    {
                        title: "Frontend Fundamentals",
                        description: "Master HTML, CSS, and responsive design principles",
                        duration: "4 weeks",
                        resources: 12
                    },
                    {
                        title: "JavaScript Mastery",
                        description: "Deep dive into modern JavaScript and ES6+ features",
                        duration: "6 weeks",
                        resources: 15
                    },
                    {
                        title: "React Development",
                        description: "Build dynamic user interfaces with React and its ecosystem",
                        duration: "8 weeks",
                        resources: 18
                    }
                ],
                projects: [
                    { title: "Portfolio Website", icon: "fas fa-globe", description: "Responsive personal portfolio" },
                    { title: "E-commerce App", icon: "fas fa-shopping-cart", description: "Full-stack shopping platform" },
                    { title: "Social Media Dashboard", icon: "fas fa-chart-bar", description: "Analytics dashboard with React" }
                ]
            },
            {
                id: 2,
                title: "Data Science Specialist",
                description: "Master data analysis, machine learning, and statistical modeling for data-driven insights",
                duration: "8-14 months",
                difficulty: "Advanced",
                skills: ["Python", "Statistics", "Machine Learning", "Data Visualization", "SQL", "Deep Learning"],
                resources: 38,
                projects: 6,
                certificates: 4,
                matchScore: 87,
                curriculum: [
                    {
                        title: "Python for Data Science",
                        description: "Learn Python programming with focus on data manipulation",
                        duration: "5 weeks",
                        resources: 10
                    },
                    {
                        title: "Statistics & Probability",
                        description: "Statistical foundations for data analysis",
                        duration: "6 weeks",
                        resources: 12
                    },
                    {
                        title: "Machine Learning",
                        description: "Supervised and unsupervised learning algorithms",
                        duration: "10 weeks",
                        resources: 16
                    }
                ],
                projects: [
                    { title: "Sales Prediction Model", icon: "fas fa-chart-line", description: "ML model for sales forecasting" },
                    { title: "Customer Segmentation", icon: "fas fa-users", description: "Clustering analysis project" },
                    { title: "Sentiment Analysis Tool", icon: "fas fa-comments", description: "NLP-based sentiment classifier" }
                ]
            },
            {
                id: 3,
                title: "UX/UI Designer Track",
                description: "Create exceptional user experiences through design thinking and modern design tools",
                duration: "4-8 months",
                difficulty: "Beginner-Friendly",
                skills: ["Design Principles", "Figma", "User Research", "Prototyping", "Usability Testing", "Design Systems"],
                resources: 32,
                projects: 10,
                certificates: 2,
                matchScore: 84,
                curriculum: [
                    {
                        title: "Design Fundamentals",
                        description: "Core principles of visual and interaction design",
                        duration: "3 weeks",
                        resources: 8
                    },
                    {
                        title: "User Research Methods",
                        description: "Learn to understand user needs and behaviors",
                        duration: "4 weeks",
                        resources: 10
                    },
                    {
                        title: "Prototyping & Testing",
                        description: "Create and validate design solutions",
                        duration: "5 weeks",
                        resources: 14
                    }
                ],
                projects: [
                    { title: "Mobile App Redesign", icon: "fas fa-mobile-alt", description: "Complete app UX overhaul" },
                    { title: "Design System", icon: "fas fa-layer-group", description: "Comprehensive design system" },
                    { title: "User Research Study", icon: "fas fa-search", description: "End-to-end research project" }
                ]
            }
        ];
    }

    renderPaths() {
        const container = document.getElementById('pathsContainer');
        if (!container) return;

        container.innerHTML = '';

        this.paths.forEach((path, index) => {
            const pathCard = this.createPathCard(path, index);
            container.appendChild(pathCard);
        });
    }

    createPathCard(path, index) {
        const card = document.createElement('div');
        card.className = 'path-card';
        card.setAttribute('data-path-id', path.id);
        
        const rankBadge = index === 0 ? 'Best Match' : index === 1 ? 'Great Fit' : 'Good Option';
        const rankIcon = index === 0 ? 'fas fa-crown' : index === 1 ? 'fas fa-star' : 'fas fa-thumbs-up';

        card.innerHTML = `
            <div class="path-header">
                <div class="path-rank">
                    <i class="${rankIcon}"></i>
                    <span>${rankBadge}</span>
                </div>
                <h3 class="path-title">${path.title}</h3>
                <p class="path-description">${path.description}</p>
                <div class="path-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${path.duration}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-signal"></i>
                        <span>${path.difficulty}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-percentage"></i>
                        <span>${path.matchScore}% Match</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-certificate"></i>
                        <span>${path.certificates} Certificates</span>
                    </div>
                </div>
            </div>
            
            <div class="path-skills">
                <div class="skills-header">
                    <i class="fas fa-tools"></i>
                    <span>Skills You'll Learn</span>
                </div>
                <div class="skills-list">
                    ${path.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            
            <div class="path-stats">
                <div class="stat">
                    <div class="stat-value">${path.resources}</div>
                    <div class="stat-label">Resources</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${path.projects}</div>
                    <div class="stat-label">Projects</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${path.certificates}</div>
                    <div class="stat-label">Certificates</div>
                </div>
            </div>
            
            <div class="path-actions">
                <button class="btn-path-primary" data-action="start" data-path-id="${path.id}">
                    <i class="fas fa-play"></i>
                    <span>Start Learning</span>
                </button>
                <button class="btn-path-secondary" data-action="details" data-path-id="${path.id}">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
        `;

        return card;
    }

    bindEvents() {
        // Path card clicks
        document.addEventListener('click', (e) => {
            const pathCard = e.target.closest('.path-card');
            const actionBtn = e.target.closest('[data-action]');
            
            if (actionBtn) {
                e.stopPropagation();
                const action = actionBtn.getAttribute('data-action');
                const pathId = parseInt(actionBtn.getAttribute('data-path-id'));
                
                if (action === 'start') {
                    this.startPath(pathId);
                } else if (action === 'details') {
                    this.showPathDetails(pathId);
                }
            } else if (pathCard) {
                const pathId = parseInt(pathCard.getAttribute('data-path-id'));
                this.showPathDetails(pathId);
            }
        });

        // Resource card clicks
        document.addEventListener('click', (e) => {
            const resourceCard = e.target.closest('.resource-card');
            if (resourceCard) {
                const resource = resourceCard.getAttribute('data-resource');
                this.openResource(resource);
            }
        });

        // Modal events
        this.bindModalEvents();
    }

    bindModalEvents() {
        const pathModal = document.getElementById('pathDetailModal');
        const confirmModal = document.getElementById('confirmationModal');
        
        // Close buttons
        document.getElementById('closePathModal').addEventListener('click', () => {
            this.closeModal(pathModal);
        });
        
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.closeModal(pathModal);
        });
        
        document.getElementById('closeConfirmModal').addEventListener('click', () => {
            this.closeModal(confirmModal);
        });
        
        document.getElementById('cancelStartBtn').addEventListener('click', () => {
            this.closeModal(confirmModal);
        });

        // Action buttons
        document.getElementById('startPathBtn').addEventListener('click', () => {
            this.closeModal(pathModal);
            this.showConfirmation();
        });
        
        document.getElementById('confirmStartBtn').addEventListener('click', () => {
            this.confirmStartPath();
        });

        // Close on outside click
        [pathModal, confirmModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    showPathDetails(pathId) {
        const path = this.paths.find(p => p.id === pathId);
        if (!path) return;

        this.selectedPath = path;
        
        const modal = document.getElementById('pathDetailModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        
        title.textContent = path.title;
        body.innerHTML = this.generatePathDetailContent(path);
        
        this.openModal(modal);
    }

    generatePathDetailContent(path) {
        return `
            <div class="path-detail-content">
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> Overview</h3>
                    <p>${path.description}</p>
                    <div class="path-meta" style="margin-top: 1rem;">
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>Duration: ${path.duration}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-signal"></i>
                            <span>Difficulty: ${path.difficulty}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-percentage"></i>
                            <span>Match Score: ${path.matchScore}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-list"></i> Curriculum</h3>
                    <div class="curriculum-list">
                        ${path.curriculum.map(item => `
                            <div class="curriculum-item">
                                <h4>${item.title}</h4>
                                <p>${item.description}</p>
                                <div class="curriculum-meta">
                                    <span><i class="fas fa-clock"></i> ${item.duration}</span>
                                    <span><i class="fas fa-book"></i> ${item.resources} resources</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-project-diagram"></i> Projects</h3>
                    <div class="projects-grid">
                        ${path.projects.map(project => `
                            <div class="project-item">
                                <i class="${project.icon}"></i>
                                <h4>${project.title}</h4>
                                <p>${project.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-tools"></i> Skills & Technologies</h3>
                    <div class="skills-list">
                        ${path.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    startPath(pathId) {
        const path = this.paths.find(p => p.id === pathId);
        if (!path) return;

        this.selectedPath = path;
        this.showConfirmation();
    }

    showConfirmation() {
        if (!this.selectedPath) return;

        const modal = document.getElementById('confirmationModal');
        const summary = document.getElementById('selectedPathSummary');
        
        summary.innerHTML = `
            <h4>${this.selectedPath.title}</h4>
            <p>${this.selectedPath.description}</p>
            <div class="path-summary-stats">
                <div class="summary-stat">
                    <i class="fas fa-clock"></i>
                    <span>${this.selectedPath.duration}</span>
                </div>
                <div class="summary-stat">
                    <i class="fas fa-signal"></i>
                    <span>${this.selectedPath.difficulty}</span>
                </div>
                <div class="summary-stat">
                    <i class="fas fa-book"></i>
                    <span>${this.selectedPath.resources} Resources</span>
                </div>
                <div class="summary-stat">
                    <i class="fas fa-project-diagram"></i>
                    <span>${this.selectedPath.projects} Projects</span>
                </div>
            </div>
        `;
        
        this.openModal(modal);
    }

    confirmStartPath() {
        if (!this.selectedPath) return;

        // Save selected path to localStorage
        localStorage.setItem('wayforge_active_path', JSON.stringify(this.selectedPath));
        
        // Show loading and redirect
        this.showStartingAnimation();
    }

    showStartingAnimation() {
        const modal = document.getElementById('confirmationModal');
        this.closeModal(modal);
        
        // Create loading overlay
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
                <div style="width: 100px; height: 100px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 2rem;"></div>
                <h2 style="font-size: 2rem; margin-bottom: 1rem;">Setting Up Your Learning Path</h2>
                <p style="font-size: 1.2rem; opacity: 0.9;">Creating your personalized dashboard and progress tracking...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);
        
        // Simulate setup time
        setTimeout(() => {
            alert('🎉 Welcome to your learning journey! Your dashboard is ready. (This would redirect to the dashboard in a real implementation)');
            document.body.removeChild(overlay);
        }, 3000);
    }

    openResource(resourceType) {
        // Handle resource card clicks
        const resourceActions = {
            'scholarship-tracker': () => alert('Scholarship Tracker will help you find and track relevant scholarships!'),
            'exam-tracker': () => alert('Exam Tracker will keep you updated on certification deadlines!'),
            'skill-gap-analysis': () => alert('Skill Gap Analysis will identify areas for improvement!'),
            'mentor-matching': () => alert('Mentor Matching will connect you with industry experts!'),
            'study-groups': () => alert('Study Groups will help you learn with peers!'),
            'progress-analytics': () => alert('Progress Analytics will provide detailed learning insights!')
        };

        const action = resourceActions[resourceType];
        if (action) {
            action();
        }
    }

    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }

    closeModal(modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }, 200);
    }

    animateEntrance() {
        // Animate stats
        setTimeout(() => {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                this.animateNumber(stat, 0, target, 2000);
            });
        }, 500);

        // Animate path cards
        setTimeout(() => {
            const pathCards = document.querySelectorAll('.path-card');
            pathCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 800);

        // Animate resource cards
        setTimeout(() => {
            const resourceCards = document.querySelectorAll('.resource-card');
            resourceCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 1200);
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const pathsManager = new LearningPathsManager();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                pathsManager.closeModal(activeModal);
            }
        }
    });
});

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(animationStyles);
