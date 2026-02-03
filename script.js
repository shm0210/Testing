// Infinity Multiverse - Cosmic JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initMobileMenu();
    initThemeToggle();
    initWebsiteFilter();
    initAchievementSystem();
    initEasterEggs();
    initSoundSystem();
    initVisitorCounter();
    init3DUniverse();
    initLiveCollaboration();
    initWallpaperDownload();
    initTimeline();
    initContactForm();
    initBackToTop();
    initPolicyPopup();
    initPWAPrompt();
    initGravityEffects();
    initARPreview();
    initParticleSystem();
    initKonamiCode();
    
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

// ===== Website Filter System =====
function initWebsiteFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const systemButtons = document.querySelectorAll('.system-btn');
    const websiteCards = document.querySelectorAll('.website-card');
    
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
            
            // Filter cards
            filterWebsites(filter);
            
            // Play sound
            playSound('click');
        });
    });
    
    // System filter for 3D universe
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
            
            // Update info panel
            const systemInfo = document.querySelector('.stat-value:nth-child(2)');
            if (systemInfo) {
                systemInfo.textContent = system === 'all' ? 'All Systems' : 
                                       system.charAt(0).toUpperCase() + system.slice(1);
            }
        });
    });
}

function filterWebsites(filter) {
    const websiteCards = document.querySelectorAll('.website-card');
    let visibleCount = 0;
    
    websiteCards.forEach((card, index) => {
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
    
    // Update count
    const countElement = document.querySelector('.category-count[data-filter="all"]');
    if (countElement) {
        countElement.textContent = visibleCount;
    }
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
    'galaxy_navigator': {
        title: 'Galaxy Navigator',
        message: 'Viewed all website categories',
        xp: 500,
        unlocked: false
    },
    'ar_pioneer': {
        title: 'AR Pioneer',
        message: 'Tried AR preview feature',
        xp: 400,
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
let viewedCategories = new Set();

function initAchievementSystem() {
    // Initialize from localStorage
    const savedAchievements = localStorage.getItem('infinity-achievements');
    if (savedAchievements) {
        Object.assign(achievements, JSON.parse(savedAchievements));
    }
    
    // Update achievement UI
    updateAchievementUI();
    updateXPProgress();
}

function unlockAchievement(achievementId) {
    if (!achievements[achievementId] || achievements[achievementId].unlocked) return;
    
    achievements[achievementId].unlocked = true;
    userXP += achievements[achievementId].xp;
    
    // Save to localStorage
    localStorage.setItem('infinity-achievements', JSON.stringify(achievements));
    
    // Show toast
    showAchievementToast(achievements[achievementId].title, achievements[achievementId].message);
    
    // Update UI
    updateAchievementUI();
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

function updateAchievementUI() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    achievementCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent;
        if (!title) return;
        
        Object.values(achievements).forEach(achievement => {
            if (achievement.title === title) {
                if (achievement.unlocked) {
                    card.classList.add('unlocked');
                    card.classList.remove('locked');
                } else {
                    card.classList.add('locked');
                    card.classList.remove('unlocked');
                }
            }
        });
    });
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
            }
        });
    });
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
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
    
    // Simulate live updates
    setInterval(() => {
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
    }, 10000);
}

// ===== 3D Universe =====
function init3DUniverse() {
    const container = document.getElementById('three-container');
    if (!container || typeof THREE === 'undefined') {
        console.warn('Three.js not available');
        return;
    }
    
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
    
    // Setup controls
    setupUniverseControls(controls);
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
    const categories = ['ecommerce', 'portfolio', 'webapp', 'landing'];
    const colors = {
        'ecommerce': 0x3b82f6,
        'portfolio': 0x8b5cf6,
        'webapp': 0x10b981,
        'landing': 0xf59e0b
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

function setupUniverseControls(controls) {
    const orbitControl = document.getElementById('orbit-control');
    const flyControl = document.getElementById('fly-control');
    const autoRotate = document.getElementById('auto-rotate');
    
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
}

// ===== Live Collaboration =====
function initLiveCollaboration() {
    const collabBtn = document.getElementById('live-collab');
    
    if (!collabBtn) return;
    
    collabBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'easter-egg-modal show';
        modal.innerHTML = `
            <div class="easter-egg-content glass-card">
                <button class="close-modal-btn">&times;</button>
                <div class="text-center">
                    <div class="easter-egg-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <h3 class="easter-egg-title">Live Code Review</h3>
                    <p class="easter-egg-text">Start a live coding session with me. Share your screen and get real-time feedback.</p>
                    <div class="space-y-4 mt-6">
                        <button class="easter-egg-claim-btn w-full">
                            <i class="fas fa-video mr-2"></i> Start Video Call
                        </button>
                        <button class="easter-egg-claim-btn w-full bg-gradient-to-r from-blue-500 to-cyan-600">
                            <i class="fas fa-code mr-2"></i> Share Code Editor
                        </button>
                        <button class="easter-egg-claim-btn w-full border border-gray-700 text-gray-300">
                            <i class="fas fa-clock mr-2"></i> Schedule Session
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
        
        // Achievement check
        unlockAchievement('ar_pioneer');
    });
}

// ===== Wallpaper Download =====
function initWallpaperDownload() {
    const downloadBtn = document.getElementById('download-wallpapers');
    
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', () => {
        // Create download simulation
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'Infinity_Multiverse_Wallpapers.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        const modal = document.createElement('div');
        modal.className = 'easter-egg-modal show';
        modal.innerHTML = `
            <div class="easter-egg-content glass-card">
                <button class="close-modal-btn">&times;</button>
                <div class="text-center">
                    <div class="easter-egg-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3 class="easter-egg-title">Download Started!</h3>
                    <p class="easter-egg-text">Your cosmic wallpaper pack is downloading. Check your downloads folder.</p>
                    <div class="grid grid-cols-3 gap-4 mt-6">
                        ${Array(6).fill().map((_, i) => `
                            <div class="aspect-square rounded-xl overflow-hidden border border-gray-700">
                                <div class="w-full h-full bg-gradient-to-br from-cyan-${500 + i*100} to-purple-${500 + i*100}"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
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
    });
}

// ===== Timeline Interactions =====
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const year = item.querySelector('.timeline-year');
            year.style.transform = 'scale(1.2)';
        });
        
        item.addEventListener('mouseleave', () => {
            const year = item.querySelector('.timeline-year');
            year.style.transform = 'scale(1)';
        });
        
        item.addEventListener('click', () => {
            const year = item.querySelector('.timeline-year').textContent;
            const title = item.querySelector('h3').textContent;
            showEasterEgg(`Year ${year}: ${title}`);
        });
    });
}

// ===== Contact Form =====
function initContactForm() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href.startsWith('mailto:')) {
                // Track email clicks
                console.log('Email contact initiated');
            } else if (link.href.includes('instagram.com')) {
                // Track Instagram clicks
                console.log('Instagram profile opened');
            } else if (link.href.includes('t.me')) {
                // Track Telegram clicks
                console.log('Telegram profile opened');
            }
        });
    });
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
        }
    };
    
    policyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const policyType = btn.dataset.policy;
            const policy = policies[policyType];
            
            if (policy) {
                const title = policyPopup.querySelector('h3');
                const body = policyPopup.querySelector('.policy-body');
                
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
    const cards = document.querySelectorAll('.website-card, .feature-card, .contact-card');
    
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

// ===== AR Preview =====
function initARPreview() {
    const arBadges = document.querySelectorAll('.ar-mini-badge, .ar-badge');
    
    arBadges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Check for WebXR support
            if ('xr' in navigator) {
                navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                    if (supported) {
                        showARModal();
                        unlockAchievement('ar_pioneer');
                    } else {
                        alert('AR is not supported on your device. Try on a mobile device with AR capabilities.');
                    }
                });
            } else {
                alert('WebXR not supported. Try on a modern mobile browser.');
            }
        });
    });
}

function showARModal() {
    const modal = document.createElement('div');
    modal.className = 'easter-egg-modal show';
    modal.innerHTML = `
        <div class="easter-egg-content glass-card">
            <button class="close-modal-btn">&times;</button>
            <div class="text-center">
                <div class="easter-egg-icon">
                    <i class="fas fa-vr-cardboard"></i>
                </div>
                <h3 class="easter-egg-title">AR Preview</h3>
                <p class="easter-egg-text">Point your camera at a flat surface to place the website in AR.</p>
                <div class="space-y-4 mt-6">
                    <button class="easter-egg-claim-btn w-full">
                        <i class="fas fa-cube mr-2"></i> Launch AR View
                    </button>
                    <button class="easter-egg-claim-btn w-full border border-gray-700 text-gray-300">
                        <i class="fas fa-question-circle mr-2"></i> View Instructions
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
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
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search if implemented
        console.log('Search shortcut activated');
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.easter-egg-modal.show, .policy-popup.show');
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
    
    // T for theme cycling
    if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const currentTheme = document.body.getAttribute('data-theme');
        const themes = ['light', 'dark', 'dark-matter'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    }
});

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registered:', registration);
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
    
    // Disable 3D universe
    const threeContainer = document.getElementById('three-container');
    if (threeContainer) {
        threeContainer.innerHTML = `
            <div class="loading-screen">
                <p>3D view optimized for performance</p>
                <p class="text-sm text-gray-400 mt-2">Try on a device with better graphics capabilities</p>
            </div>
        `;
    }
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
        text: 'Check out this amazing cosmic portfolio!',
        url: window.location.href
    };
    
    document.querySelectorAll('.social-link').forEach(link => {
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
