// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const startPlanningBtn = document.getElementById('startPlanningBtn');
const continuePathwayBtn = document.getElementById('continuePathwayBtn');
const langBtn = document.querySelector('.lang-btn');
const featureCards = document.querySelectorAll('.feature-card');
const progressCards = document.querySelectorAll('.progress-card');

// Language switching functionality
const languages = {
    en: {
        tagline: "Forge Your Learning Journey",
        startPlanning: "Start Planning",
        continuePathway: "Continue Pathway",
        login: "Login",
        signup: "Sign Up",
        welcomeBack: "Welcome Back",
        joinWayforge: "Join Wayforge",
        learningProgress: "Learning Progress",
        timeSpent: "Time Spent",
        achievements: "Achievements",
        goalsMet: "Goals Met",
        resourceHub: "Resource Hub",
        resourceHubDesc: "Access curated learning materials and resources",
        interactiveQuizzes: "Interactive Quizzes",
        interactiveQuizzesDesc: "Test your knowledge with engaging quizzes",
        explorationMode: "Exploration Mode",
        explorationModeDesc: "Discover new learning opportunities",
        resumeBuilder: "Resume Builder",
        resumeBuilderDesc: "Create professional resumes with AI assistance",
        careerTrends: "Career Trends",
        careerTrendsDesc: "Stay updated with industry trends and insights",
        guidanceDashboard: "Guidance Dashboard",
        guidanceDashboardDesc: "Get personalized career guidance and mentorship",
        careerCompass: "Career Compass",
        careerCompassDesc: "Navigate your career path with precision",
        marketConditions: "Market Conditions",
        marketConditionsDesc: "Real-time job market analysis and opportunities",
        whatIfSimulator: "What-If Simulator",
        whatIfSimulatorDesc: "Simulate different career scenarios and outcomes",
        gamifiedExperience: "Gamified Experience",
        gamifiedExperienceDesc: "Learn through engaging games and challenges"
    },
    es: {
        tagline: "Forja Tu Camino de Aprendizaje",
        startPlanning: "Comenzar Planificación",
        continuePathway: "Continuar Ruta",
        login: "Iniciar Sesión",
        signup: "Registrarse",
        welcomeBack: "Bienvenido de Vuelta",
        joinWayforge: "Únete a Wayforge",
        learningProgress: "Progreso de Aprendizaje",
        timeSpent: "Tiempo Invertido",
        achievements: "Logros",
        goalsMet: "Metas Cumplidas"
    },
    fr: {
        tagline: "Forgez Votre Parcours d'Apprentissage",
        startPlanning: "Commencer la Planification",
        continuePathway: "Continuer le Parcours",
        login: "Se Connecter",
        signup: "S'inscrire",
        welcomeBack: "Bon Retour",
        joinWayforge: "Rejoindre Wayforge",
        learningProgress: "Progrès d'Apprentissage",
        timeSpent: "Temps Passé",
        achievements: "Réalisations",
        goalsMet: "Objectifs Atteints"
    },
    de: {
        tagline: "Schmieden Sie Ihren Lernweg",
        startPlanning: "Planung Beginnen",
        continuePathway: "Pfad Fortsetzen",
        login: "Anmelden",
        signup: "Registrieren",
        welcomeBack: "Willkommen Zurück",
        joinWayforge: "Wayforge Beitreten",
        learningProgress: "Lernfortschritt",
        timeSpent: "Verbrachte Zeit",
        achievements: "Errungenschaften",
        goalsMet: "Erreichte Ziele"
    }
};

let currentLanguage = 'en';

// Premium Interactive Effects
class PremiumEffects {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        this.createCustomCursor();
        this.initScrollReveal();
        this.initMagneticEffect();
    }

    createCustomCursor() {
        // Create colorful cursor trail effects
        this.trailElements = [];
        this.maxTrailLength = 8;

        // Track mouse movement for trail effect
        document.addEventListener('mousemove', (e) => {
            this.createTrailElement(e.clientX, e.clientY);
        });

        // Clean up old trail elements
        setInterval(() => {
            this.cleanupTrail();
        }, 100);
    }

    createTrailElement(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        
        document.body.appendChild(trail);
        this.trailElements.push({
            element: trail,
            timestamp: Date.now()
        });

        // Animate trail element
        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(0.5)';
        }, 50);

        // Remove after animation
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 300);
    }

    cleanupTrail() {
        const now = Date.now();
        this.trailElements = this.trailElements.filter(item => {
            if (now - item.timestamp > 300) {
                if (item.element.parentNode) {
                    item.element.parentNode.removeChild(item.element);
                }
                return false;
            }
            return true;
        });

        // Limit trail length
        if (this.trailElements.length > this.maxTrailLength) {
            const excess = this.trailElements.splice(0, this.trailElements.length - this.maxTrailLength);
            excess.forEach(item => {
                if (item.element.parentNode) {
                    item.element.parentNode.removeChild(item.element);
                }
            });
        }
    }

    initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card, .progress-card').forEach(el => {
            el.classList.add('scroll-reveal');
            observer.observe(el);
        });
    }

    initMagneticEffect() {
        document.querySelectorAll('.btn, .feature-card, .logo-3d').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transition = 'transform 0.3s ease';
            });

            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) * 0.1;
                const deltaY = (e.clientY - centerY) * 0.1;
                
                element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeProgressBars();
    initializeEventListeners();
    initializeIntersectionObserver();
    
    // Initialize premium effects
    new PremiumEffects();
    
    // Add staggered entrance animations
    setTimeout(() => {
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('bounce-in');
            }, index * 150);
        });
    }, 500);
});

// Initialize animations
function initializeAnimations() {
    // Add fade-in animation to elements
    const animatedElements = document.querySelectorAll('.progress-card, .feature-card, .main-btn');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize progress bars
function initializeProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    progressFills.forEach(fill => {
        const progress = fill.getAttribute('data-progress');
        setTimeout(() => {
            fill.style.width = progress + '%';
        }, 500);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Modal functionality
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    closeLoginModal.addEventListener('click', () => closeModal(loginModal));
    closeSignupModal.addEventListener('click', () => closeModal(signupModal));
    
    // Close modals when clicking outside
    [loginModal, signupModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Main action buttons
    startPlanningBtn.addEventListener('click', handleStartPlanning);
    continuePathwayBtn.addEventListener('click', handleContinuePathway);
    
    // Language switching
    const langDropdownButtons = document.querySelectorAll('.lang-dropdown button');
    langDropdownButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    // Feature cards
    featureCards.forEach(card => {
        card.addEventListener('click', handleFeatureClick);
        card.addEventListener('mouseenter', handleFeatureHover);
        card.addEventListener('mouseleave', handleFeatureLeave);
    });
    
    // Form submissions
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
}

// Initialize Intersection Observer for scroll animations
function initializeIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const observeElements = document.querySelectorAll('.progress-card, .feature-card');
    observeElements.forEach(el => observer.observe(el));
}

// Modal functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.9)';
    setTimeout(() => {
        modalContent.style.transform = 'scale(1)';
    }, 10);
}

function closeModal(modal) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }, 200);
}

// Language switching
function switchLanguage(lang) {
    if (!languages[lang]) return;
    
    currentLanguage = lang;
    const langData = languages[lang];
    
    // Update language button
    langBtn.querySelector('span').textContent = lang.toUpperCase();
    
    // Update text content
    updateTextContent(langData);
    
    // Add transition effect
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0.8';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 300);
}

function updateTextContent(langData) {
    // Update tagline
    const tagline = document.querySelector('.brand-tagline');
    if (tagline && langData.tagline) {
        tagline.textContent = langData.tagline;
    }
    
    // Update buttons
    const startBtn = document.querySelector('#startPlanningBtn span');
    const continueBtn = document.querySelector('#continuePathwayBtn span');
    const loginBtnText = document.querySelector('#loginBtn span');
    const signupBtnText = document.querySelector('#signupBtn span');
    
    if (startBtn && langData.startPlanning) startBtn.textContent = langData.startPlanning;
    if (continueBtn && langData.continuePathway) continueBtn.textContent = langData.continuePathway;
    if (loginBtnText && langData.login) loginBtnText.textContent = langData.login;
    if (signupBtnText && langData.signup) signupBtnText.textContent = langData.signup;
    
    // Update modal titles
    const loginModalTitle = document.querySelector('#loginModal .modal-header h2');
    const signupModalTitle = document.querySelector('#signupModal .modal-header h2');
    
    if (loginModalTitle && langData.welcomeBack) loginModalTitle.textContent = langData.welcomeBack;
    if (signupModalTitle && langData.joinWayforge) signupModalTitle.textContent = langData.joinWayforge;
}

// Main action handlers
function handleStartPlanning() {
    // Add click animation
    startPlanningBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        startPlanningBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Show loading state
    showLoadingState(startPlanningBtn);
    
    // Clear any existing progress and start fresh from step 1
    localStorage.removeItem('wayforge_questionnaire_step');
    localStorage.removeItem('wayforge_questionnaire_data');
    localStorage.removeItem('wayforge_generated_paths');
    
    // Navigate to questionnaire starting from step 1
    setTimeout(() => {
        window.location.href = 'questionnaire.html?step=1&fresh=true';
    }, 1000);
}

function handleContinuePathway() {
    // Add click animation
    continuePathwayBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        continuePathwayBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Show loading state
    showLoadingState(continuePathwayBtn);
    
    // Check if user has saved progress
    const savedStep = localStorage.getItem('wayforge_questionnaire_step');
    const savedData = localStorage.getItem('wayforge_questionnaire_data');
    const generatedPaths = localStorage.getItem('wayforge_generated_paths');
    
    setTimeout(() => {
        if (generatedPaths) {
            // User has completed questionnaire, go to learning paths
            window.location.href = 'learning-paths.html';
        } else if (savedStep && savedData) {
            // User has progress, resume from saved step
            window.location.href = `questionnaire.html?step=${savedStep}&continue=true`;
        } else {
            // No progress found, start from beginning
            window.location.href = 'questionnaire.html?step=1&fresh=true';
        }
    }, 1000);
}

// Feature card handlers
function handleFeatureClick(e) {
    const card = e.currentTarget;
    const feature = card.getAttribute('data-feature');
    
    // Add click animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 150);
    
    // Handle feature navigation
    navigateToFeature(feature);
}

function handleFeatureHover(e) {
    const card = e.currentTarget;
    const icon = card.querySelector('.card-icon');
    
    // Add hover sound effect (if audio is enabled)
    playHoverSound();
    
    // Add particle effect
    createParticleEffect(card);
}

function handleFeatureLeave(e) {
    const card = e.currentTarget;
    // Remove any temporary effects
}

// Navigation functions
function navigateToFeature(feature) {
    const featurePages = {
        'resource-hub': 'resource-hub.html',
        'interactive-quizzes': 'quizzes.html',
        'exploration-mode': 'exploration.html',
        'resume-builder': 'resume-builder.html',
        'career-trends': 'career-trends.html',
        'guidance-dashboard': 'guidance.html',
        'career-compass': 'career-compass.html',
        'market-conditions': 'market-conditions.html',
        'what-if-simulator': 'simulator.html',
        'gamified-experience': 'gamification.html',
        'skill-assessment': 'skill-assessment.html',
        'dashboard': 'dashboard.html'
    };
    
    const targetPage = featurePages[feature];
    if (targetPage) {
        // Show loading animation
        showPageTransition();
        setTimeout(() => {
            window.location.href = targetPage;
        }, 1000);
    }
}

// Form handling
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const isLogin = form.closest('#loginModal');
    
    // Add loading state to form
    const submitBtn = form.querySelector('.btn-primary');
    showLoadingState(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        hideLoadingState(submitBtn);
        
        if (isLogin) {
            alert('Login successful! (Demo)');
            closeModal(loginModal);
        } else {
            alert('Registration successful! (Demo)');
            closeModal(signupModal);
        }
    }, 1500);
}

// Keyboard navigation
function handleKeyDown(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        if (loginModal.classList.contains('active')) {
            closeModal(loginModal);
        }
        if (signupModal.classList.contains('active')) {
            closeModal(signupModal);
        }
    }
    
    // Navigate with arrow keys (for accessibility)
    if (e.key === 'Tab') {
        // Enhanced tab navigation could be implemented here
    }
}

// Utility functions
function showLoadingState(element) {
    const originalContent = element.innerHTML;
    element.setAttribute('data-original-content', originalContent);
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    element.disabled = true;
    element.classList.add('loading');
}

function hideLoadingState(element) {
    const originalContent = element.getAttribute('data-original-content');
    if (originalContent) {
        element.innerHTML = originalContent;
    }
    element.disabled = false;
    element.classList.remove('loading');
    element.removeAttribute('data-original-content');
}

function showPageTransition() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; color: white;">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <p style="font-size: 1.2rem;">Loading...</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Store reference for cleanup
    window.pageTransitionOverlay = overlay;
}

function hidePageTransition() {
    const overlay = window.pageTransitionOverlay;
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const particles = [];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            opacity: 1;
            transition: all 0.6s ease-out;
        `;
        
        document.body.appendChild(particle);
        particles.push(particle);
        
        // Animate particle
        setTimeout(() => {
            const angle = (i / 5) * Math.PI * 2;
            const distance = 50;
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
        }, 10);
    }
    
    // Cleanup particles
    setTimeout(() => {
        particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
    }, 600);
}

function playHoverSound() {
    // Placeholder for hover sound effect
    // Could implement Web Audio API sound here
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for internal links
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Theme switching (for future implementation)
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could implement error reporting here
});

// Service Worker registration (for future PWA implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        switchLanguage,
        openModal,
        closeModal,
        handleStartPlanning,
        handleContinuePathway
    };
}
