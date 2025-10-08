// Dashboard functionality
class DashboardManager {
    constructor() {
        this.userData = this.loadUserData();
        this.progressData = this.loadProgressData();
        this.init();
    }

    init() {
        this.updateUserInfo();
        this.updateStats();
        this.updateLearningPaths();
        this.updateActivity();
        this.updateAchievements();
        this.updateRecommendations();
        this.bindEvents();
        this.startProgressTracking();
    }

    loadUserData() {
        const saved = localStorage.getItem('wayforge_user_data');
        return saved ? JSON.parse(saved) : {
            name: 'Learner',
            email: '',
            joinDate: new Date().toISOString(),
            totalTime: 0,
            streak: 0,
            achievements: [],
            level: 1,
            xp: 0
        };
    }

    loadProgressData() {
        const saved = localStorage.getItem('wayforge_progress_data');
        return saved ? JSON.parse(saved) : {
            currentPaths: [],
            completedModules: [],
            quizScores: [],
            dailyActivity: [],
            weeklyGoals: {
                target: 5,
                completed: 0
            }
        };
    }

    saveUserData() {
        localStorage.setItem('wayforge_user_data', JSON.stringify(this.userData));
    }

    saveProgressData() {
        localStorage.setItem('wayforge_progress_data', JSON.stringify(this.progressData));
    }

    updateUserInfo() {
        const nameElement = document.querySelector('.user-name');
        if (nameElement) {
            nameElement.textContent = this.userData.name;
        }
    }

    updateStats() {
        // Update streak
        const streakElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
        if (streakElement) {
            streakElement.textContent = this.calculateStreak();
        }

        // Update achievements count
        const achievementsElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (achievementsElement) {
            achievementsElement.textContent = this.userData.achievements.length;
        }

        // Update total time
        const timeElement = document.querySelector('.stat-card:nth-child(3) .stat-number');
        if (timeElement) {
            timeElement.textContent = this.formatTime(this.userData.totalTime);
        }
    }

    calculateStreak() {
        const today = new Date();
        const dailyActivity = this.progressData.dailyActivity;
        let streak = 0;
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateString = checkDate.toDateString();
            
            if (dailyActivity.includes(dateString)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        
        return streak;
    }

    formatTime(minutes) {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h`;
    }

    updateLearningPaths() {
        // Simulate learning paths data
        const paths = [
            {
                id: 'js-fullstack',
                title: 'Full-Stack JavaScript',
                description: 'Frontend & Backend Development',
                icon: 'fab fa-js-square',
                progress: 68,
                isActive: true
            },
            {
                id: 'data-science',
                title: 'Data Science Fundamentals',
                description: 'Python, Statistics & ML',
                icon: 'fas fa-chart-bar',
                progress: 34,
                isActive: false
            }
        ];

        const pathsContainer = document.querySelector('.paths-grid');
        if (pathsContainer) {
            // Clear existing paths (except the "new path" card)
            const existingPaths = pathsContainer.querySelectorAll('.path-card:not(.new)');
            existingPaths.forEach(path => path.remove());

            // Add paths
            paths.forEach(path => {
                const pathElement = this.createPathCard(path);
                pathsContainer.insertBefore(pathElement, pathsContainer.querySelector('.path-card.new'));
            });
        }
    }

    createPathCard(path) {
        const card = document.createElement('div');
        card.className = `path-card ${path.isActive ? 'active' : ''}`;
        card.innerHTML = `
            <div class="path-header">
                <div class="path-icon">
                    <i class="${path.icon}"></i>
                </div>
                <div class="path-info">
                    <h3>${path.title}</h3>
                    <p>${path.description}</p>
                </div>
                <div class="path-progress">
                    <span>${path.progress}%</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${path.progress}%"></div>
            </div>
            <div class="path-actions">
                <button class="btn btn-primary btn-sm" onclick="continuePath('${path.id}')">Continue</button>
                <button class="btn btn-outline btn-sm" onclick="viewPathDetails('${path.id}')">View Details</button>
            </div>
        `;
        return card;
    }

    updateActivity() {
        const activities = [
            {
                icon: 'fas fa-check-circle',
                title: 'Completed: React Hooks Module',
                subtitle: 'Full-Stack JavaScript Path',
                time: '2 hours ago',
                type: 'completion'
            },
            {
                icon: 'fas fa-trophy',
                title: 'Achievement Unlocked: Quick Learner',
                subtitle: 'Completed 5 modules in one day',
                time: '1 day ago',
                type: 'achievement'
            },
            {
                icon: 'fas fa-star',
                title: 'Quiz Score: 95%',
                subtitle: 'JavaScript Fundamentals Quiz',
                time: '2 days ago',
                type: 'quiz'
            }
        ];

        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${activity.title}</h4>
                        <p>${activity.subtitle}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    updateAchievements() {
        const achievements = [
            { id: 'week-streak', icon: 'fas fa-fire', name: 'Week Streak', earned: true },
            { id: 'first-module', icon: 'fas fa-graduation-cap', name: 'First Module', earned: true },
            { id: 'quick-start', icon: 'fas fa-rocket', name: 'Quick Start', earned: true },
            { id: 'path-master', icon: 'fas fa-crown', name: 'Path Master', earned: false },
            { id: 'top-scorer', icon: 'fas fa-medal', name: 'Top Scorer', earned: false },
            { id: 'community-helper', icon: 'fas fa-users', name: 'Community Helper', earned: false }
        ];

        const achievementsGrid = document.querySelector('.achievements-grid');
        if (achievementsGrid) {
            achievementsGrid.innerHTML = achievements.map(achievement => `
                <div class="achievement-badge ${achievement.earned ? 'earned' : ''}">
                    <i class="${achievement.icon}"></i>
                    <span>${achievement.name}</span>
                </div>
            `).join('');
        }
    }

    updateRecommendations() {
        const recommendations = [
            {
                icon: 'fab fa-react',
                title: 'Advanced React Patterns',
                description: 'Take your React skills to the next level',
                duration: '8 hours',
                rating: '4.9'
            },
            {
                icon: 'fas fa-database',
                title: 'Database Design',
                description: 'Master SQL and database optimization',
                duration: '12 hours',
                rating: '4.8'
            },
            {
                icon: 'fas fa-mobile-alt',
                title: 'Mobile Development',
                description: 'Build cross-platform mobile apps',
                duration: '15 hours',
                rating: '4.7'
            }
        ];

        const recsGrid = document.querySelector('.recommendations-grid');
        if (recsGrid) {
            recsGrid.innerHTML = recommendations.map(rec => `
                <div class="recommendation-card">
                    <div class="rec-icon">
                        <i class="${rec.icon}"></i>
                    </div>
                    <h3>${rec.title}</h3>
                    <p>${rec.description}</p>
                    <div class="rec-meta">
                        <span><i class="fas fa-clock"></i> ${rec.duration}</span>
                        <span><i class="fas fa-star"></i> ${rec.rating}</span>
                    </div>
                    <button class="btn btn-outline btn-sm">Explore</button>
                </div>
            `).join('');
        }
    }

    bindEvents() {
        // Add event listeners for interactive elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn')) {
                this.handleButtonClick(e);
            }
        });

        // Track user activity
        this.trackActivity();
    }

    handleButtonClick(e) {
        const button = e.target;
        const action = button.textContent.toLowerCase();
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Handle specific actions
        if (action.includes('continue')) {
            this.addXP(10);
            this.trackDailyActivity();
        }
    }

    trackActivity() {
        // Track page views and time spent
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 60000); // minutes
            this.userData.totalTime += timeSpent;
            this.saveUserData();
        });
    }

    trackDailyActivity() {
        const today = new Date().toDateString();
        if (!this.progressData.dailyActivity.includes(today)) {
            this.progressData.dailyActivity.push(today);
            this.saveProgressData();
            this.updateStats();
        }
    }

    addXP(amount) {
        this.userData.xp += amount;
        
        // Check for level up
        const newLevel = Math.floor(this.userData.xp / 100) + 1;
        if (newLevel > this.userData.level) {
            this.userData.level = newLevel;
            this.showLevelUpNotification(newLevel);
        }
        
        this.saveUserData();
    }

    showLevelUpNotification(level) {
        // Create and show level up notification
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-star"></i>
                <h3>Level Up!</h3>
                <p>You've reached level ${level}!</p>
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

    startProgressTracking() {
        // Update progress every minute
        setInterval(() => {
            this.trackDailyActivity();
        }, 60000);
    }
}

// Global functions for button actions
function continuePath(pathId) {
    // Navigate to learning path
    window.location.href = `learning-paths.html?path=${pathId}`;
}

function viewPathDetails(pathId) {
    // Show path details modal or navigate to details page
    alert(`Viewing details for path: ${pathId}`);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});
