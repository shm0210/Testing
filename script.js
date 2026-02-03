// Infinity Multiverse - Enhanced JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initMobileMenu();
    initThemeToggle();
    initToolFilter();
    initAchievementSystem();
    initEasterEggs();
    initSoundSystem();
    initVisitorCounter();
    init3DUniverse();
    initToolLauncher();
    initProfileTimeline();
    initArticleSystem();
    initContactForm();
    initBackToTop();
    initPolicyPopup();
    initPWAPrompt();
    initGravityEffects();
    initParticleSystem();
    initKonamiCode();
    initLiveDemo();
    initToolPreview();
    initNewsletter();
    initInteractiveTimeline();
    initKnowledgeFilter();
    
    // Start animations
    startCosmicAnimations();
    
    // Check for first visit achievement
    setTimeout(() => {
        unlockAchievement('cosmic_explorer');
    }, 2000);
});

// ===== Mobile Menu =====
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuButton.querySelector('i');
    
    mobileMenuButton.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        menuIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        
        // Play sound
        playSound('click');
    });
    
    // Close menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuIcon.className = 'fas fa-bars';
            document.body.style.overflow = 'auto';
        });
    });
}

// ===== Theme Toggle System =====
function initThemeToggle() {
    const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeOptions = document.querySelectorAll('.theme-option, .theme-option-mobile');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('infinity-theme') || 'dark';
    setTheme(savedTheme);
    
    // Desktop toggle
    themeToggleDesktop.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const themes = ['light', 'dark', 'dark-matter'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
        
        // Achievement for dark matter theme
        if (themes[nextIndex] === 'dark-matter') {
            unlockAchievement('dark_matter_dweller');
        }
    });
    
    // Mobile toggle
    themeToggleMobile.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const themes = ['light', 'dark', 'dark-matter'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    });
    
    // Theme options
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            setTheme(theme);
            
            if (theme === 'dark-matter') {
                unlockAchievement('dark_matter_dweller');
            }
        });
    });
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme !== 'light');
    localStorage.setItem('infinity-theme', theme);
    
    // Update theme icons
    const themeIcons = document.querySelectorAll('#theme-toggle-desktop i, #theme-toggle-mobile i');
    themeIcons.forEach(icon => {
        icon.className = theme === 'dark' ? 'fas fa-moon text-star-yellow' :
                        theme === 'dark-matter' ? 'fas fa-moon text-quantum-blue' :
                        'fas fa-sun text-yellow-500';
    });
    
    // Update meta theme color
    const color = theme === 'dark' ? '#0f172a' :
                 theme === 'dark-matter' ? '#000000' :
                 '#f8fafc';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', color);
}

// ===== Tool Filter System =====
function initToolFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    
    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Animate button
            button.classList.add('animate-gravity-pull');
            setTimeout(() => {
                button.classList.remove('animate-gravity-pull');
            }, 500);
            
            // Filter tools
            filterTools(filter);
            
            // Play sound
            playSound('click');
            
            // Update count
            updateToolCount(filter);
        });
    });
    
    // System filter for 3D universe
    const systemButtons = document.querySelectorAll('.system-btn');
    systemButtons.forEach(button => {
        button.addEventListener('click', () => {
            const system = button.dataset.system;
            
            // Update active button
            systemButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter planets in 3D universe
            if (window.universePlanets) {
                window.universePlanets.forEach(planet => {
                    if (system === 'all' || planet.category === system) {
                        planet.mesh.material.emissiveIntensity = 0.5;
                    } else {
                        planet.mesh.material.emissiveIntensity = 0.1;
                    }
                });
            }
        });
    });
}

function filterTools(filter) {
    const toolCards = document.querySelectorAll('.tool-card');
    let visibleCount = 0;
    
    toolCards.forEach((card, index) => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => {
                card.classList.add('animate-dimension-flip');
                setTimeout(() => {
                    card.classList.remove('animate-dimension-flip');
                }, 800);
            }, index * 100);
            visibleCount++;
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    return visibleCount;
}

function updateToolCount(filter) {
    const countElement = document.querySelector('.category-count[data-filter="all"]');
    if (!countElement) return;
    
    if (filter === 'all') {
        countElement.textContent = document.querySelectorAll('.tool-card').length;
    } else {
        const visibleCount = document.querySelectorAll(`.tool-card[data-category="${filter}"]`).length;
        document.querySelector(`.category-count[data-filter="${filter}"]`).textContent = visibleCount;
    }
}

// ===== Tool Launcher =====
function initToolLauncher() {
    const launchButtons = document.querySelectorAll('.tool-launch-btn');
    
    launchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tool = button.dataset.tool;
            launchTool(tool);
        });
    });
}

function launchTool(tool) {
    // Show loading effect
    const warpEffect = document.getElementById('warp-effect');
    warpEffect.classList.add('active');
    
    // Play sound
    playSound('discovery');
    
    // Tool URLs mapping
    const toolUrls = {
        'youtube': '/tools/youtube',
        'pdf': '/tools/pdf-viewer',
        'notes': '/tools/notes',
        'ai': '/tools/chatbot',
        'games': '/tools/games',
        'editor': '/tools/code-editor',
        'image': '/tools/image-editor',
        'converter': '/tools/file-converter'
    };
    
    // Simulate tool launch (in real implementation, redirect to tool page)
    setTimeout(() => {
        warpEffect.classList.remove('active');
        
        // Show tool preview modal
        showToolPreview(tool);
        
        // Unlock achievement
        unlockAchievement('tool_explorer');
    }, 1500);
}

function showToolPreview(tool) {
    const modal = document.getElementById('tool-preview-modal');
    const body = modal.querySelector('.tool-preview-body');
    
    // Tool data
    const toolData = {
        'youtube': {
            title: 'Infinity YouTube',
            icon: 'fab fa-youtube',
            description: 'Ad-free YouTube experience with premium features',
            features: ['No ads', 'Background play', 'Download support', 'Custom player'],
            color: 'red'
        },
        'pdf': {
            title: 'Cosmic PDF Viewer',
            icon: 'fas fa-file-pdf',
            description: 'Advanced PDF viewer with annotation and extraction',
            features: ['Annotation tools', 'Text extraction', 'Cloud sync', 'Multi-format'],
            color: 'blue'
        }
    };
    
    const data = toolData[tool] || {
        title: 'Infinity Tool',
        icon: 'fas fa-cube',
        description: 'An amazing web tool from Infinity Multiverse',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        color: 'purple'
    };
    
    // Set modal content
    body.innerHTML = `
        <div class="text-center mb-6">
            <div class="tool-preview-icon ${data.color}">
                <i class="${data.icon}"></i>
            </div>
            <h3 class="text-2xl font-orbitron mt-4">${data.title}</h3>
            <p class="text-gray-400 mt-2">${data.description}</p>
        </div>
        
        <div class="features-list">
            <h4 class="font-semibold mb-3">Key Features:</h4>
            <ul class="space-y-2">
                ${data.features.map(feature => `<li><i class="fas fa-check text-green-400 mr-2"></i>${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="mt-6 flex gap-3">
            <button class="flex-1 bg-gradient-to-r from-${data.color}-500 to-${data.color}-600 py-2 rounded-lg font-semibold">
                <i class="fas fa-play mr-2"></i> Launch Now
            </button>
            <button class="flex-1 border border-gray-700 py-2 rounded-lg">
                <i class="fas fa-info-circle mr-2"></i> Learn More
            </button>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close modal
    const closeBtn = modal.querySelector('#close-tool-preview');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== Profile Timeline =====
function initProfileTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            timelineItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show year details
            const year = item.dataset.year;
            showYearDetails(year);
        });
    });
}

function showYearDetails(year) {
    const details = {
        '2022': {
            title: 'The Beginning',
            description: 'Started learning web development and building small projects',
            achievements: ['Learned HTML/CSS', 'Built first portfolio', 'Started JavaScript']
        },
        '2023': {
            title: 'Tool Creation',
            description: 'Started creating web tools and launched first versions',
            achievements: ['Created YouTube Ad-free', 'Built PDF Viewer', 'Gained 1K+ users']
        },
        '2024': {
            title: 'Multiverse Launch',
            description: 'Launched Infinity Multiverse platform with multiple tools',
            achievements: ['Platform launch', 'Added 8+ tools', 'Community building']
        },
        '2025': {
            title: 'AI Integration',
            description: 'Integrated AI features and expanded tool capabilities',
            achievements: ['AI Chatbot', 'Smart features', 'Advanced analytics']
        }
    };
    
    const data = details[year];
    if (!data) return;
    
    // Show in a modal or update a section
    console.log(`${year}: ${data.title} - ${data.description}`);
}

// ===== Article System =====
function initArticleSystem() {
    const articleButtons = document.querySelectorAll('.article-read-btn, .article-card-btn');
    
    articleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showArticle('featured'); // In real implementation, pass article ID
        });
    });
    
    // Load more articles
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreArticles);
    }
}

function showArticle(articleId) {
    const modal = document.getElementById('article-modal');
    const body = modal.querySelector('.article-modal-body');
    
    // Article content (in real implementation, fetch from server)
    const articles = {
        'featured': {
            title: 'Building Infinite Web Tools: A Cosmic Approach',
            category: 'Web Development',
            date: 'March 15, 2024',
            readTime: '8 min read',
            author: 'SHUBHAM',
            content: `
                <h2>Introduction</h2>
                <p>The Infinity Multiverse platform was born from a simple idea: creating infinite web tools to solve real-world problems. In this article, I'll share the cosmic approach behind building this platform.</p>
                
                <h2>The Architecture</h2>
                <p>Using modern web technologies like React, Node.js, and Three.js, I built a scalable architecture that can support infinite tools. The key was creating reusable components and a flexible backend.</p>
                
                <h2>3D Universe Integration</h2>
                <p>The 3D interactive universe was implemented using Three.js, providing an immersive experience for users to navigate through different tools and features.</p>
                
                <h2>Future Vision</h2>
                <p>The platform continues to evolve with AI integration, more tools, and enhanced user experiences. The goal is to create a complete digital universe of web tools.</p>
            `
        }
    };
    
    const article = articles[articleId] || articles['featured'];
    
    body.innerHTML = `
        <article>
            <header class="mb-8">
                <span class="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    ${article.category}
                </span>
                <h1 class="text-3xl font-orbitron mt-4">${article.title}</h1>
                <div class="flex items-center gap-4 mt-4 text-gray-400">
                    <span><i class="far fa-calendar mr-2"></i>${article.date}</span>
                    <span><i class="far fa-clock mr-2"></i>${article.readTime}</span>
                    <span><i class="fas fa-user-astronaut mr-2"></i>${article.author}</span>
                </div>
            </header>
            
            <div class="prose prose-invert max-w-none">
                ${article.content}
            </div>
            
            <footer class="mt-8 pt-8 border-t border-gray-800">
                <div class="flex items-center justify-between">
                    <button class="like-btn">
                        <i class="far fa-heart"></i> Like Article
                    </button>
                    <div class="flex gap-2">
                        <button class="social-share">
                            <i class="fab fa-twitter"></i>
                        </button>
                        <button class="social-share">
                            <i class="fab fa-linkedin"></i>
                        </button>
                        <button class="social-share">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            </footer>
        </article>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close modal
    const closeBtn = modal.querySelector('#close-article');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

function loadMoreArticles() {
    // Simulate loading more articles
    const btn = document.querySelector('.load-more-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
        // In real implementation, fetch articles from server
        btn.innerHTML = '<i class="fas fa-check"></i> No more articles';
        btn.disabled = true;
    }, 2000);
}

// ===== Knowledge Filter =====
function initKnowledgeFilter() {
    const categoryButtons = document.querySelectorAll('.knowledge-category');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter articles
            filterArticles(category);
        });
    });
}

function filterArticles(category) {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const shouldShow = category === 'all' || cardCategory === category;
        
        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ===== Interactive Contact Form =====
function initContactForm() {
    const form = document.querySelector('.message-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill all fields', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate sending (in real implementation, send to server)
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Message sent successfully! I\'ll reply soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
            }, 3000);
        }, 2000);
    });
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===== Live Demo =====
function initLiveDemo() {
    const demoBtn = document.getElementById('live-demo');
    if (!demoBtn) return;
    
    demoBtn.addEventListener('click', () => {
        // Show demo modal
        const modal = document.createElement('div');
        modal.className = 'easter-egg-modal show';
        modal.innerHTML = `
            <div class="easter-egg-content glass-card">
                <button class="close-modal-btn">&times;</button>
                <div class="text-center">
                    <div class="easter-egg-icon">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <h3 class="easter-egg-title">Live Tool Demo</h3>
                    <p class="easter-egg-text">Choose a tool to see it in action</p>
                    <div class="grid grid-cols-2 gap-4 mt-6">
                        <button class="demo-tool-btn" data-tool="youtube">
                            <i class="fab fa-youtube"></i>
                            <span>YouTube Player</span>
                        </button>
                        <button class="demo-tool-btn" data-tool="pdf">
                            <i class="fas fa-file-pdf"></i>
                            <span>PDF Viewer</span>
                        </button>
                        <button class="demo-tool-btn" data-tool="notes">
                            <i class="fas fa-sticky-note"></i>
                            <span>Notes Maker</span>
                        </button>
                        <button class="demo-tool-btn" data-tool="ai">
                            <i class="fas fa-robot"></i>
                            <span>AI Chatbot</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal
        const closeBtn = modal.querySelector('.close-modal-btn');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
        
        // Demo tool buttons
        modal.querySelectorAll('.demo-tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                modal.remove();
                launchTool(tool);
            });
        });
    });
}

// ===== Newsletter =====
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        
        if (!emailInput.value) {
            emailInput.focus();
            return;
        }
        
        // Show loading
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate subscription (in real implementation, send to server)
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i>';
            emailInput.value = '';
            
            showNotification('Subscribed to cosmic newsletter!', 'success');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalHtml;
            }, 2000);
        }, 1500);
    });
}

// ===== Interactive Timeline =====
function initInteractiveTimeline() {
    const timeline = document.querySelector('.interactive-timeline');
    if (!timeline) return;
    
    const items = timeline.querySelectorAll('.timeline-item');
    
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const year = item.dataset.year;
            highlightYear(year);
        });
        
        item.addEventListener('click', () => {
            const year = item.dataset.year;
            showYearDetails(year);
        });
    });
}

function highlightYear(year) {
    // Add visual effect for the selected year
    console.log(`Highlighting year: ${year}`);
    // You could add visual effects like glow or particle effects
}

// ===== Tool Preview System =====
function initToolPreview() {
    // Already initialized in initToolLauncher
}

// ===== Achievement System =====
const achievements = {
    'cosmic_explorer': {
        title: 'Cosmic Explorer',
        message: 'First visit to the universe',
        xp: 100,
        unlocked: false
    },
    'dark_matter_dweller': {
        title: 'Dark Matter Dweller',
        message: 'Enabled Dark Matter theme',
        xp: 250,
        unlocked: false
    },
    'tool_explorer': {
        title: 'Tool Explorer',
        message: 'Tried your first tool',
        xp: 300,
        unlocked: false
    },
    'article_reader': {
        title: 'Knowledge Seeker',
        message: 'Read your first article',
        xp: 200,
        unlocked: false
    },
    'multiverse_master': {
        title: 'Multiverse Master',
        message: 'Unlocked all achievements',
        xp: 1000,
        unlocked: false
    }
};

let userXP = 350;

function initAchievementSystem() {
    // Initialize from localStorage
    const savedAchievements = localStorage.getItem('infinity-achievements');
    if (savedAchievements) {
        Object.assign(achievements, JSON.parse(savedAchievements));
    }
    
    const savedXP = localStorage.getItem('infinity-xp');
    if (savedXP) {
        userXP = parseInt(savedXP);
    }
    
    updateXPProgress();
}

function unlockAchievement(achievementId) {
    if (!achievements[achievementId] || achievements[achievementId].unlocked) return;
    
    achievements[achievementId].unlocked = true;
    userXP += achievements[achievementId].xp;
    
    // Save to localStorage
    localStorage.setItem('infinity-achievements', JSON.stringify(achievements));
    localStorage.setItem('infinity-xp', userXP);
    
    // Show toast
    showAchievementToast(achievements[achievementId].title, achievements[achievementId].message);
    
    updateXPProgress();
    
    // Play sound
    playSound('achievement');
    
    // Check for multiverse master
    const allUnlocked = Object.values(achievements).every(a => a.unlocked);
    if (allUnlocked && !achievements.multiverse_master.unlocked) {
        unlockAchievement('multiverse_master');
    }
}

function showAchievementToast(title, message) {
    const toast = document.getElementById('achievement-toast');
    const messageEl = document.getElementById('achievement-message');
    
    messageEl.textContent = `${title}: ${message}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

function updateXPProgress() {
    const xpElement = document.querySelector('.xp-current');
    const progressFill = document.querySelector('.xp-progress-fill');
    const totalXP = 5000;
    const percentage = (userXP / totalXP) * 100;
    
    if (xpElement) {
        xpElement.textContent = `${userXP}/${totalXP} XP`;
    }
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
}

// ===== Easter Eggs System =====
function initEasterEggs() {
    // Birthday detection (October 21)
    const today = new Date();
    if (today.getMonth() === 9 && today.getDate() === 21) {
        showEasterEgg('Happy Birthday! The universe celebrates with you! 🎉');
    }
    
    // Click on specific stars
    const stars = document.querySelectorAll('.stars, .stars2, .stars3');
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            if (e.offsetX < 50 && e.offsetY < 50) {
                showEasterEgg('You found a hidden constellation! 🌟');
                unlockAchievement('constellation_finder');
            }
        });
    });
    
    // Secret code in console
    console.log(
        `%c🚀 Welcome to Infinity Multiverse!`,
        'font-size: 20px; color: #00e0ff; font-weight: bold;'
    );
    console.log(
        `%c👨‍💻 Created by SHUBHAM (@I.SHUBHAM0210)`,
        'font-size: 16px; color: #3a0ca3;'
    );
    console.log(
        `%c💫 Secret Code: INFINITY2024`,
        'font-size: 14px; color: #ff6b6b; background: #1a1a2e; padding: 4px;'
    );
}

function showEasterEgg(message) {
    const modal = document.getElementById('easter-egg-modal');
    const messageEl = document.getElementById('easter-egg-message');
    
    messageEl.textContent = message;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Play sound
    playSound('discovery');
    
    // Close functionality
    const closeBtn = document.getElementById('close-easter');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== Sound System =====
let soundEnabled = true;

function initSoundSystem() {
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = soundToggle.querySelector('i');
    
    // Load saved preference
    soundEnabled = localStorage.getItem('infinity-sound') !== 'false';
    updateSoundIcon(soundIcon);
    
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('infinity-sound', soundEnabled);
        updateSoundIcon(soundIcon);
        playSound('click');
    });
}

function updateSoundIcon(icon) {
    icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    soundEnabled ? icon.classList.remove('muted') : icon.classList.add('muted');
}

function playSound(type) {
    if (!soundEnabled) return;
    
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        let frequency, duration;
        
        switch(type) {
            case 'click':
                frequency = 800;
                duration = 0.1;
                break;
            case 'achievement':
                frequency = 1200;
                duration = 0.3;
                break;
            case 'discovery':
                frequency = 1500;
                duration = 0.5;
                break;
            case 'hover':
                frequency = 600;
                duration = 0.2;
                break;
            default:
                frequency = 1000;
                duration = 0.1;
        }
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('Audio playback not supported:', e);
    }
}

// ===== Visitor Counter =====
function initVisitorCounter() {
    const counters = ['visitor-count', 'visitor-count-mobile', 'hero-visitors', 'visitor-total'];
    
    // Initial counts
    const baseCount = 42;
    const onlineCount = Math.max(baseCount, Math.floor(baseCount + Math.random() * 3 - 1));
    const totalCount = 1234 + Math.floor(Math.random() * 2);
    
    counters.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'visitor-total') {
                element.textContent = totalCount.toLocaleString();
            } else {
                element.textContent = onlineCount;
            }
        }
    });
    
    // Simulate live updates
    setInterval(() => {
        const onlineCount = Math.max(baseCount, Math.floor(baseCount + Math.random() * 3 - 1));
        const totalCount = 1234 + Math.floor(Math.random() * 10);
        
        counters.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'visitor-total') {
                    element.textContent = totalCount.toLocaleString();
                } else {
                    element.textContent = onlineCount;
                }
            }
        });
    }, 30000); // Update every 30 seconds
}

// ===== 3D Universe =====
function init3DUniverse() {
    const container = document.getElementById('three-container');
    if (!container || typeof THREE === 'undefined') {
        console.warn('Three.js not available');
        show3DFallback(container);
        return;
    }
    
    try {
        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        
        // Create controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        // Create stars background
        createStarfield(scene);
        
        // Create planets
        window.universePlanets = createPlanets(scene);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
        
        // Add nebula
        createNebula(scene);
        
        // Add click handlers to planets
        window.universePlanets.forEach((planet, index) => {
            // Add click event (simulated with raycaster in full implementation)
            planet.mesh.userData = { index, category: planet.category };
        });
        
        // Setup controls
        setupUniverseControls(controls, camera, scene, renderer);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate stars
            if (window.starField) {
                window.starField.rotation.y += 0.0005;
            }
            
            // Animate planets
            if (window.universePlanets) {
                window.universePlanets.forEach(planet => {
                    planet.mesh.rotation.y += 0.01;
                    const time = Date.now() * 0.001;
                    planet.mesh.position.y = planet.originalPosition.y + Math.sin(time + planet.originalPosition.x) * 0.1;
                });
            }
            
            // Update nebula
            if (window.nebula) {
                window.nebula.rotation.y += 0.0002;
                window.nebula.rotation.x += 0.0001;
            }
            
            controls.update();
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
    } catch (error) {
        console.error('3D initialization failed:', error);
        show3DFallback(container);
    }
}

function show3DFallback(container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="fallback-universe">
            <div class="fallback-stars"></div>
            <div class="fallback-planets">
                <div class="fallback-planet"></div>
                <div class="fallback-planet"></div>
                <div class="fallback-planet"></div>
            </div>
            <div class="fallback-text">
                <p>Experience the full 3D universe on devices with better graphics support</p>
                <button class="fallback-btn" onclick="location.reload()">
                    <i class="fas fa-sync"></i> Retry
                </button>
            </div>
        </div>
    `;
}

function createStarfield(scene) {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 200;
        starPositions[i + 1] = (Math.random() - 0.5) * 200;
        starPositions[i + 2] = (Math.random() - 0.5) * 200;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });
    
    window.starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(window.starField);
}

function createPlanets(scene) {
    const planets = [];
    const categories = ['media', 'productivity', 'ai', 'games'];
    const colors = {
        'media': 0x3b82f6,
        'productivity': 0x8b5cf6,
        'ai': 0x10b981,
        'games': 0xf59e0b
    };
    
    // Create 24 planets
    for (let i = 0; i < 24; i++) {
        const radius = 3 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const color = colors[category];
        
        const geometry = new THREE.SphereGeometry(0.2 + Math.random() * 0.1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            emissive: color,
            emissiveIntensity: 0.2
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.position.set(x, y, z);
        
        // Add ring for some planets
        if (Math.random() > 0.7) {
            const ringGeometry = new THREE.RingGeometry(0.3, 0.4, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planet.add(ring);
        }
        
        scene.add(planet);
        planets.push({
            mesh: planet,
            category: category,
            originalPosition: { x, y, z }
        });
    }
    
    return planets;
}

function createNebula(scene) {
    const nebulaGeometry = new THREE.SphereGeometry(8, 32, 32);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide
    });
    
    window.nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    scene.add(window.nebula);
}

function setupUniverseControls(controls, camera, scene, renderer) {
    const orbitControl = document.getElementById('orbit-control');
    const flyControl = document.getElementById('fly-control');
    const autoRotate = document.getElementById('auto-rotate');
    const explosionBtn = document.getElementById('explosion-effect');
    const warpJumpBtn = document.querySelector('.warp-jump-btn');
    
    if (orbitControl) {
        orbitControl.addEventListener('click', () => {
            controls.enableRotate = true;
            controls.enableZoom = true;
            controls.enablePan = true;
            controls.maxDistance = 10;
            orbitControl.classList.add('active');
            flyControl?.classList.remove('active');
        });
    }
    
    if (flyControl) {
        flyControl.addEventListener('click', () => {
            controls.enableRotate = true;
            controls.enableZoom = true;
            controls.enablePan = true;
            controls.maxDistance = 20;
            flyControl.classList.add('active');
            orbitControl?.classList.remove('active');
        });
    }
    
    if (autoRotate) {
        let rotating = false;
        autoRotate.addEventListener('click', () => {
            rotating = !rotating;
            controls.autoRotate = rotating;
            controls.autoRotateSpeed = 1.0;
            autoRotate.classList.toggle('active', rotating);
        });
    }
    
    if (explosionBtn) {
        explosionBtn.addEventListener('click', () => {
            createExplosionEffect(scene);
            playSound('discovery');
        });
    }
    
    if (warpJumpBtn) {
        warpJumpBtn.addEventListener('click', () => {
            // Random camera jump
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            const randomZ = (Math.random() - 0.5) * 10;
            
            // Animate camera
            anime({
                targets: camera.position,
                x: randomX,
                y: randomY,
                z: randomZ,
                duration: 2000,
                easing: 'easeInOutQuad'
            });
            
            // Show warp effect
            const warpEffect = document.getElementById('warp-effect');
            warpEffect.classList.add('active');
            setTimeout(() => {
                warpEffect.classList.remove('active');
            }, 2000);
        });
    }
}

function createExplosionEffect(scene) {
    // Create explosion particles
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x00e0ff : 0xff6b6b
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position around center
        particle.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        
        // Random velocity
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            ),
            life: 1.0
        };
        
        scene.add(particle);
        particles.push(particle);
    }
    
    // Animate particles
    function animateParticles() {
        let aliveParticles = 0;
        
        particles.forEach(particle => {
            if (particle.userData.life > 0) {
                // Update position
                particle.position.add(particle.userData.velocity);
                
                // Reduce life
                particle.userData.life -= 0.02;
                particle.material.opacity = particle.userData.life;
                
                // Scale down
                particle.scale.setScalar(particle.userData.life);
                
                aliveParticles++;
            }
        });
        
        if (aliveParticles > 0) {
            requestAnimationFrame(animateParticles);
        } else {
            // Remove particles from scene
            particles.forEach(particle => {
                scene.remove(particle);
            });
        }
    }
    
    animateParticles();
}

// ===== Back to Top =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        // Show warp effect
        const warpEffect = document.getElementById('warp-effect');
        const warpTunnel = document.getElementById('warp-tunnel');
        
        warpEffect.classList.add('active');
        warpTunnel.classList.add('active');
        
        // Scroll to top
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 500);
        
        // Hide warp effect
        setTimeout(() => {
            warpEffect.classList.remove('active');
            warpTunnel.classList.remove('active');
        }, 1500);
        
        // Play sound
        playSound('discovery');
    });
}

// ===== Policy Popup =====
function initPolicyPopup() {
    const policyBtns = document.querySelectorAll('.policy-btn');
    const policyPopup = document.getElementById('policy-popup');
    const closePolicyBtn = document.getElementById('close-policy');
    
    const policies = {
        privacy: {
            title: 'Privacy Policy',
            content: `
                <p>Your privacy is important in this vast digital universe. This policy explains how we handle your data across the Infinity Multiverse platform.</p>
                <h4>Data Collection</h4>
                <p>We collect minimal data necessary to provide our services, including website analytics and contact information when you reach out.</p>
                <h4>Cookies & Tracking</h4>
                <p>We use cookies to improve your browsing experience and analyze website traffic. You can control cookie settings through your browser.</p>
                <h4>Third-Party Services</h4>
                <p>We may use third-party services for analytics, hosting, and communication. These services have their own privacy policies.</p>
                <h4>Your Rights</h4>
                <p>You have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p>
            `
        },
        terms: {
            title: 'Terms of Service',
            content: `
                <p>By accessing and using Infinity Multiverse, you agree to these terms of service governing our digital universe.</p>
                <h4>Usage Guidelines</h4>
                <p>You may browse and interact with our websites for personal or commercial purposes, subject to these terms.</p>
                <h4>Intellectual Property</h4>
                <p>All website designs, code, and content are protected by copyright and other intellectual property laws.</p>
                <h4>Limitations</h4>
                <p>We are not liable for any indirect damages resulting from the use of our websites or services.</p>
                <h4>Changes to Terms</h4>
                <p>We may update these terms periodically. Continued use after changes constitutes acceptance.</p>
            `
        },
        cookies: {
            title: 'Cookie Policy',
            content: `
                <p>This Cookie Policy explains how Infinity Multiverse uses cookies and similar technologies.</p>
                <h4>What Are Cookies</h4>
                <p>Cookies are small text files stored on your device when you visit our website.</p>
                <h4>How We Use Cookies</h4>
                <p>We use cookies for authentication, preferences, analytics, and improving user experience.</p>
                <h4>Managing Cookies</h4>
                <p>You can control cookies through your browser settings. Note that disabling cookies may affect functionality.</p>
                <h4>Third-Party Cookies</h4>
                <p>Some third-party services we use may set their own cookies.</p>
            `
        }
    };
    
    policyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const policyType = btn.dataset.policy;
            const policy = policies[policyType];
            
            if (policy) {
                const title = document.getElementById('policy-title');
                const body = document.getElementById('policy-body');
                
                title.textContent = policy.title;
                body.innerHTML = policy.content;
                
                policyPopup.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close policy popup
    closePolicyBtn.addEventListener('click', () => {
        policyPopup.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    policyPopup.addEventListener('click', (e) => {
        if (e.target === policyPopup) {
            policyPopup.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== PWA Prompt =====
function initPWAPrompt() {
    const pwaPrompt = document.getElementById('pwa-prompt');
    const installBtn = document.getElementById('install-pwa');
    const laterBtn = document.getElementById('later-pwa');
    const closePwaBtn = document.getElementById('close-pwa');
    
    let deferredPrompt;
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return;
    }
    
    // Show prompt after delay
    setTimeout(() => {
        const lastPrompt = localStorage.getItem('pwa-prompt-last');
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        
        if (!lastPrompt || Date.now() - parseInt(lastPrompt) > oneWeek) {
            pwaPrompt.classList.add('show');
        }
    }, 5000);
    
    // Before install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });
    
    // Install button
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('PWA installed');
            unlockAchievement('pwa_installer');
        }
        
        deferredPrompt = null;
        pwaPrompt.classList.remove('show');
    });
    
    // Later button
    laterBtn.addEventListener('click', () => {
        localStorage.setItem('pwa-prompt-last', Date.now());
        pwaPrompt.classList.remove('show');
    });
    
    // Close button
    closePwaBtn.addEventListener('click', () => {
        localStorage.setItem('pwa-prompt-last', Date.now());
        pwaPrompt.classList.remove('show');
    });
}

// ===== Gravity Hover Effects =====
function initGravityEffects() {
    const cards = document.querySelectorAll('.tool-card, .article-card, .contact-method');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const tiltX = ((y / rect.height) - 0.5) * 10;
            const tiltY = ((x / rect.width) - 0.5) * -10;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
            
            playSound('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ===== Particle System =====
function initParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Create particles
    function createParticles() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: Math.random() > 0.5 ? 'rgba(0, 224, 255, 0.5)' : 'rgba(139, 92, 246, 0.5)'
            });
        }
    }
    
    // Animate particles
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Draw connections
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 224, 255, ${0.2 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    // Initialize
    resizeCanvas();
    createParticles();
    animateParticles();
    
    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}

// ===== Konami Code Easter Egg =====
function initKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                // Konami code completed
                showEasterEgg('Secret Konami code activated! Welcome to the hidden dimension!');
                unlockAchievement('konami_master');
                konamiIndex = 0;
                
                // Special effect
                document.body.classList.add('animate-cosmic-rift');
                setTimeout(() => {
                    document.body.classList.remove('animate-cosmic-rift');
                }, 3000);
                
                // Play sound
                playSound('achievement');
            }
        } else {
            konamiIndex = 0;
        }
    });
}

// ===== Cosmic Animations =====
function startCosmicAnimations() {
    // Add animation to hero badges
    const heroBadges = document.querySelectorAll('.hero-badge');
    heroBadges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add animation to stats
    const stats = document.querySelectorAll('.hero-stat');
    stats.forEach((stat, index) => {
        stat.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach((btn, index) => {
        btn.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add animation to tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeAllModals();
    }
    
    // T for theme cycling
    if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        cycleTheme();
    }
    
    // ? for help
    if (e.key === '?') {
        e.preventDefault();
        showHelp();
    }
});

function focusSearch() {
    // Create search modal
    const modal = document.createElement('div');
    modal.className = 'search-modal show';
    modal.innerHTML = `
        <div class="search-content glass-card">
            <div class="search-header">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search tools, articles, or commands..." autofocus>
                <button class="close-search">&times;</button>
            </div>
            <div class="search-results">
                <div class="search-result">
                    <i class="fab fa-youtube"></i>
                    <span>YouTube Ad-free Player</span>
                    <span class="search-category">Tool</span>
                </div>
                <div class="search-result">
                    <i class="fas fa-file-pdf"></i>
                    <span>PDF Viewer Tutorial</span>
                    <span class="search-category">Article</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close search
    modal.querySelector('.close-search').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function closeAllModals() {
    const modals = document.querySelectorAll('.show');
    modals.forEach(modal => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    // Close mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        const menuIcon = document.querySelector('#mobile-menu-button i');
        if (menuIcon) menuIcon.className = 'fas fa-bars';
        document.body.style.overflow = 'auto';
    }
}

function cycleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const themes = ['light', 'dark', 'dark-matter'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
}

function showHelp() {
    const modal = document.createElement('div');
    modal.className = 'help-modal show';
    modal.innerHTML = `
        <div class="help-content glass-card">
            <button class="close-modal-btn">&times;</button>
            <h3>Keyboard Shortcuts</h3>
            <div class="shortcuts">
                <div class="shortcut">
                    <kbd>Ctrl/Cmd + K</kbd>
                    <span>Search</span>
                </div>
                <div class="shortcut">
                    <kbd>Ctrl/Cmd + T</kbd>
                    <span>Cycle Theme</span>
                </div>
                <div class="shortcut">
                    <kbd>Esc</kbd>
                    <span>Close Modals</span>
                </div>
                <div class="shortcut">
                    <kbd>?</kbd>
                    <span>Show Help</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registered:', registration);
            unlockAchievement('pwa_ready');
        }).catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

// ===== Performance Optimization =====
if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) {
    // Reduce animations on low-end devices
    document.documentElement.style.setProperty('--animation-speed', '0.5s');
    
    // Reduce blur effects
    document.querySelectorAll('.glass-card, .glass-nav').forEach(el => {
        el.style.backdropFilter = 'blur(8px)';
    });
}

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.error('Infinity Multiverse error:', e.error);
    // You could send this to an error tracking service
});

// ===== Share Functionality =====
function initShare() {
    const shareData = {
        title: 'Infinity Multiverse',
        text: 'Check out this amazing cosmic web tools platform!',
        url: window.location.href
    };
    
    document.querySelectorAll('.social-share').forEach(link => {
        link.addEventListener('click', (e) => {
            if (navigator.share) {
                e.preventDefault();
                navigator.share(shareData).then(() => {
                    console.log('Shared successfully');
                });
            }
        });
    });
}

// Initialize share functionality
setTimeout(initShare, 2000);

// ===== Initialize remaining features =====
function initToolPreview() {
    // Already implemented
}

// Add CSS for new elements
const newStyles = `
    /* New Tool Cards */
    .tools-section {
        padding: 5rem 1rem;
        background: linear-gradient(180deg, transparent, rgba(0, 224, 255, 0.05));
    }
    
    .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin: 3rem 0;
    }
    
    .tool-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .tool-card:hover {
        transform: translateY(-10px);
        border-color: rgba(0, 224, 255, 0.5);
        box-shadow: 0 20px 40px rgba(0, 224, 255, 0.2);
    }
    
    .tool-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .tool-badge.premium {
        background: linear-gradient(135deg, #f59e0b, #d97706);
    }
    
    .tool-badge.new {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    
    .tool-badge.popular {
        background: linear-gradient(135deg, #ef4444, #dc2626);
    }
    
    .tool-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
    }
    
    .tool-card:nth-child(1) .tool-icon {
        background: linear-gradient(135deg, #ef4444, #dc2626);
    }
    
    .tool-card:nth-child(2) .tool-icon {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    
    .tool-card:nth-child(3) .tool-icon {
        background: linear-gradient(135deg, #10b981, #059669);
    }
    
    .tool-card:nth-child(4) .tool-icon {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }
    
    .tool-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }
    
    .tool-description {
        color: #94a3b8;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
        line-height: 1.6;
    }
    
    .tool-stats {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 1.5rem;
    }
    
    .tool-stats .stat {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #cbd5e1;
        font-size: 0.875rem;
    }
    
    .tool-launch-btn {
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(135deg, var(--quantum-blue), var(--nebula-purple));
        border: none;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .tool-launch-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 224, 255, 0.3);
    }
    
    /* Profile Section */
    .profile-section {
        padding: 5rem 1rem;
    }
    
    .profile-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    @media (min-width: 1024px) {
        .profile-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    
    .profile-card, .timeline-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 2rem;
    }
    
    .profile-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .profile-avatar {
        position: relative;
    }
    
    .profile-avatar img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 3px solid var(--quantum-blue);
    }
    
    .online-status {
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 20px;
        height: 20px;
        background: #10b981;
        border-radius: 50%;
        border: 3px solid var(--dark-matter);
    }
    
    .profile-name {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
    }
    
    .profile-handle {
        color: var(--quantum-blue);
        margin-bottom: 1rem;
    }
    
    .profile-tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .profile-tag {
        padding: 0.25rem 0.75rem;
        background: rgba(0, 224, 255, 0.1);
        border: 1px solid rgba(0, 224, 255, 0.3);
        border-radius: 20px;
        font-size: 0.75rem;
    }
    
    .profile-bio {
        margin-bottom: 2rem;
        color: #cbd5e1;
        line-height: 1.6;
    }
    
    .profile-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .profile-stat {
        text-align: center;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
    }
    
    .profile-stat .stat-number {
        display: block;
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--quantum-blue);
        font-family: 'Orbitron', monospace;
    }
    
    .profile-stat .stat-label {
        font-size: 0.875rem;
        color: #94a3b8;
    }
    
    .profile-skills h4 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        color: var(--quantum-blue);
    }
    
    .skills-grid {
        display: grid;
        gap: 1rem;
    }
    
    .skill {
        display: grid;
        gap: 0.5rem;
    }
    
    .skill-bar {
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .skill-level {
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, var(--quantum-blue), var(--nebula-purple));
        transition: width 1s ease;
    }
    
    /* Timeline Card */
    .timeline-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        color: var(--quantum-blue);
    }
    
    .interactive-timeline {
        position: relative;
        padding-left: 2rem;
    }
    
    .interactive-timeline::before {
        content: '';
        position: absolute;
        left: 7px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(to bottom, var(--quantum-blue), transparent);
    }
    
    .timeline-item {
        position: relative;
        margin-bottom: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .timeline-item.active {
        transform: translateX(10px);
    }
    
    .timeline-dot {
        position: absolute;
        left: -1.6rem;
        top: 0;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--quantum-blue);
        border: 3px solid var(--dark-matter);
    }
    
    .timeline-item.active .timeline-dot {
        background: var(--star-yellow);
        box-shadow: 0 0 10px var(--star-yellow);
    }
    
    .timeline-content h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: white;
    }
    
    .timeline-content p {
        color: #94a3b8;
        font-size: 0.875rem;
    }
    
    .daily-quote {
        margin-top: 3rem;
        padding: 1.5rem;
        background: rgba(0, 224, 255, 0.05);
        border: 1px solid rgba(0, 224, 255, 0.1);
        border-radius: 12px;
        text-align: center;
    }
    
    .daily-quote i:first-child {
        font-size: 2rem;
        color: var(--quantum-blue);
        margin-bottom: 1rem;
    }
    
    .quote-text {
        font-style: italic;
        color: #cbd5e1;
        margin-bottom: 0.5rem;
    }
    
    .quote-author {
        color: var(--quantum-blue);
        font-weight: 600;
    }
    
    .achievements-showcase {
        margin-top: 4rem;
    }
    
    .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .achievement {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        transition: all 0.3s ease;
    }
    
    .achievement:hover {
        transform: translateY(-5px);
        border-color: var(--quantum-blue);
        box-shadow: 0 10px 20px rgba(0, 224, 255, 0.1);
    }
    
    .achievement i {
        font-size: 2.5rem;
        color: var(--quantum-blue);
    }
    
    .achievement span {
        font-weight: 600;
    }
    
    /* Knowledge Section */
    .knowledge-section {
        padding: 5rem 1rem;
        background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.05));
    }
    
    .knowledge-categories {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        margin: 3rem 0;
    }
    
    .knowledge-category {
        padding: 0.75rem 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 9999px;
        color: #94a3b8;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .knowledge-category:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .knowledge-category.active {
        background: linear-gradient(135deg, var(--nebula-purple), var(--quantum-purple));
        color: white;
        border-color: transparent;
    }
    
    .featured-article {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        margin-bottom: 4rem;
    }
    
    @media (min-width: 768px) {
        .featured-article {
            grid-template-columns: 1fr 1fr;
        }
    }
    
    .article-image {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        min-height: 300px;
    }
    
    .article-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .article-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, var(--star-yellow), #f59e0b);
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.875rem;
    }
    
    .article-content {
        display: flex;
        flex-direction: column;
    }
    
    .article-category {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
        border-radius: 20px;
        font-size: 0.875rem;
        margin-bottom: 1rem;
    }
    
    .article-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 1rem;
        line-height: 1.3;
    }
    
    .article-excerpt {
        color: #94a3b8;
        margin-bottom: 1.5rem;
        line-height: 1.6;
        flex-grow: 1;
    }
    
    .article-meta {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        color: #64748b;
        font-size: 0.875rem;
    }
    
    .article-read-btn {
        align-self: flex-start;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, var(--nebula-purple), var(--quantum-purple));
        border: none;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .article-read-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
    }
    
    .articles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .article-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 1.5rem;
        transition: all 0.3s ease;
    }
    
    .article-card:hover {
        transform: translateY(-5px);
        border-color: var(--quantum-blue);
        box-shadow: 0 10px 20px rgba(0, 224, 255, 0.1);
    }
    
    .article-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .article-card-category {
        padding: 0.25rem 0.75rem;
        background: rgba(0, 224, 255, 0.1);
        color: var(--quantum-blue);
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .article-card-date {
        color: #64748b;
        font-size: 0.875rem;
    }
    
    .article-card-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        line-height: 1.4;
    }
    
    .article-card-excerpt {
        color: #94a3b8;
        font-size: 0.875rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }
    
    .article-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .article-card-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0, 224, 255, 0.1);
        border: 1px solid rgba(0, 224, 255, 0.3);
        color: var(--quantum-blue);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .article-card-btn:hover {
        background: rgba(0, 224, 255, 0.2);
        transform: rotate(45deg);
    }
    
    .article-card-stats {
        color: #64748b;
        font-size: 0.875rem;
    }
    
    .load-more-btn {
        padding: 0.75rem 2rem;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 9999px;
        color: #94a3b8;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .load-more-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: white;
        border-color: var(--quantum-blue);
    }
    
    /* Contact Section Updates */
    .contact-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
        max-width: 1000px;
        margin: 3rem auto;
    }
    
    @media (min-width: 1024px) {
        .contact-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    
    .direct-message-card, .quick-contact-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 2rem;
    }
    
    .contact-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--quantum-blue);
    }
    
    .contact-subtitle {
        color: #94a3b8;
        margin-bottom: 2rem;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #cbd5e1;
        font-weight: 500;
    }
    
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: white;
        font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--quantum-blue);
    }
    
    .send-message-btn {
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(135deg, var(--quantum-blue), var(--nebula-purple));
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .send-message-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 224, 255, 0.3);
    }
    
    .contact-methods {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .contact-method {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        text-decoration: none;
        color: inherit;
        transition: all 0.3s ease;
    }
    
    .contact-method:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateX(10px);
    }
    
    .contact-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }
    
    .contact-method:nth-child(1) .contact-icon {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    
    .contact-method:nth-child(2) .contact-icon {
        background: linear-gradient(135deg, #ec4899, #db2777);
    }
    
    .contact-method:nth-child(3) .contact-icon {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
    
    .contact-method:nth-child(4) .contact-icon {
        background: linear-gradient(135deg, #10b981, #059669);
    }
    
    .contact-method h4 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }
    
    .contact-method p {
        color: #94a3b8;
        font-size: 0.875rem;
    }
    
    .contact-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 2rem;
        padding: 1rem;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.2);
        border-radius: 12px;
    }
    
    .status-indicator {
        width: 10px;
        height: 10px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
    
    .social-links-showcase {
        margin-top: 4rem;
    }
    
    .social-links-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .social-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border-radius: 12px;
        text-decoration: none;
        color: white;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .social-link.instagram {
        background: linear-gradient(135deg, #ec4899, #db2777);
    }
    
    .social-link.github {
        background: linear-gradient(135deg, #6b7280, #4b5563);
    }
    
    .social-link.twitter {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    
    .social-link.linkedin {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
    
    .social-link.youtube {
        background: linear-gradient(135deg, #ef4444, #dc2626);
    }
    
    .social-link.discord {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }
    
    .social-link:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    
    /* Coming Soon Tools */
    .coming-soon-section {
        margin-top: 4rem;
        padding-top: 3rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .coming-soon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        max-width: 800px;
        margin: 2rem auto;
    }
    
    .coming-soon-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px dashed rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        opacity: 0.7;
    }
    
    .coming-soon-card i {
        font-size: 2.5rem;
        color: #94a3b8;
    }
    
    .coming-soon-card span {
        color: #94a3b8;
        font-weight: 600;
    }
    
    /* Updated Footer */
    .footer-content {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
        margin-bottom: 3rem;
    }
    
    @media (min-width: 768px) {
        .footer-content {
            grid-template-columns: repeat(4, 1fr);
        }
    }
    
    .footer-heading {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--quantum-blue);
    }
    
    .newsletter {
        display: flex;
        flex-direction: column;
    }
    
    .newsletter-text {
        color: #94a3b8;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }
    
    .newsletter-form {
        display: flex;
        gap: 0.5rem;
    }
    
    .newsletter-form input {
        flex: 1;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: white;
    }
    
    .newsletter-form button {
        width: 40px;
        background: linear-gradient(135deg, var(--quantum-blue), var(--nebula-purple));
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
    }
    
    .footer-bottom {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
    }
    
    @media (min-width: 768px) {
        .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
    }
    
    .footer-policies {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    /* Tool Preview Modal */
    .tool-preview-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .tool-preview-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .tool-preview-content {
        max-width: 500px;
        width: 90%;
        padding: 2rem;
    }
    
    .tool-preview-icon {
        width: 100px;
        height: 100px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        margin: 0 auto;
    }
    
    .tool-preview-icon.red {
        background: linear-gradient(135deg, #ef4444, #dc2626);
    }
    
    .tool-preview-icon.blue {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    
    .tool-preview-icon.purple {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }
    
    .features-list {
        margin: 2rem 0;
    }
    
    .features-list h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--quantum-blue);
    }
    
    .features-list ul {
        list-style: none;
        padding: 0;
    }
    
    .features-list li {
        padding: 0.5rem 0;
        color: #cbd5e1;
        display: flex;
        align-items: center;
    }
    
    /* Article Modal */
    .article-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .article-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .article-modal-content {
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 2rem;
    }
    
    .prose {
        color: #cbd5e1;
        line-height: 1.8;
    }
    
    .prose h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 2rem 0 1rem;
        color: var(--quantum-blue);
    }
    
    .prose p {
        margin-bottom: 1.5rem;
    }
    
    .like-btn {
        padding: 0.5rem 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        color: #cbd5e1;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .like-btn:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.3);
    }
    
    .social-share {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .social-share:hover {
        background: rgba(0, 224, 255, 0.1);
        color: var(--quantum-blue);
        transform: translateY(-2px);
    }
    
    /* Notification */
    .notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1rem;
        backdrop-filter: blur(10px);
        transform: translateY(100%);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        border-left: 4px solid #10b981;
    }
    
    .notification.error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification i {
        font-size: 1.25rem;
    }
    
    .notification.success i {
        color: #10b981;
    }
    
    .notification.error i {
        color: #ef4444;
    }
    
    /* Active Tools in Hero */
    .active-tools {
        margin-bottom: 2rem;
    }
    
    .tool-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }
    
    .live-dot {
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        margin-left: auto;
        animation: pulse 2s infinite;
    }
    
    /* Fallback 3D Universe */
    .fallback-universe {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    
    .fallback-stars {
        position: absolute;
        inset: 0;
        background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.5), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.5), transparent);
        background-repeat: repeat;
        background-size: 100px 100px;
        animation: twinkle 3s infinite;
    }
    
    .fallback-planets {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4rem;
    }
    
    .fallback-planet {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
    }
    
    .fallback-planet:nth-child(1) {
        background: linear-gradient(135deg, var(--quantum-blue), #0891b2);
        animation-delay: 0s;
    }
    
    .fallback-planet:nth-child(2) {
        background: linear-gradient(135deg, var(--nebula-purple), #7c3aed);
        animation-delay: 1s;
    }
    
    .fallback-planet:nth-child(3) {
        background: linear-gradient(135deg, var(--supernova), #dc2626);
        animation-delay: 2s;
    }
    
    .fallback-text {
        position: absolute;
        bottom: 2rem;
        left: 0;
        right: 0;
        text-align: center;
        color: #94a3b8;
    }
    
    .fallback-btn {
        margin-top: 1rem;
        padding: 0.5rem 1.5rem;
        background: rgba(0, 224, 255, 0.1);
        border: 1px solid rgba(0, 224, 255, 0.3);
        border-radius: 20px;
        color: var(--quantum-blue);
        cursor: pointer;
    }
`;

// Add the new styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = newStyles;
document.head.appendChild(styleSheet);
