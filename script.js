// ============================
// INFINITY YouTube Player JS
// Enhanced Version with Admin-Controlled AdSense
// ============================

// --- Element References ---
const videoLinkInput = document.getElementById('video-link');
const playButton = document.getElementById('play-button');
const youtubeIframe = document.getElementById('youtube-iframe');
const loadingElement = document.getElementById('loading');
const apiLoadingElement = document.getElementById('api-loading');
const errorMessageElement = document.getElementById('error-message');
const successMessageElement = document.getElementById('success-message');
const fullscreenButton = document.getElementById('fullscreen-button');
const resetButton = document.getElementById('reset-button');
const copyLinkButton = document.getElementById('copy-link');
const videoTitle = document.getElementById('video-title');
const videoChannel = document.getElementById('video-channel');
const videoDuration = document.getElementById('video-duration');
const videoViews = document.getElementById('video-views');
const videoThumbnail = document.getElementById('video-thumbnail');
const shareButton = document.getElementById('share-button') || document.createElement('button');

// Menu Elements
const menuToggle = document.getElementById('menu-toggle');
const closeMenuButton = document.getElementById('close-menu');
const sidebar = document.getElementById('sidebar');
const menuOverlay = document.getElementById('menu-overlay');
const themeMenuToggle = document.getElementById('theme-menu-toggle');
const themeStatus = document.getElementById('theme-status');
const clearHistoryButton = document.getElementById('clear-history');
const shortcutsHelpButton = document.getElementById('shortcuts-help');
const aboutMenuButton = document.getElementById('about-menu');
const privacyMenuButton = document.getElementById('privacy-menu');
const termsMenuButton = document.getElementById('terms-menu');
const contactMenuButton = document.getElementById('contact-menu');
const menuHistory = document.getElementById('menu-history');

// AdSense Elements
const toggleAdsButton = document.getElementById('toggle-ads');
const adsStatus = document.getElementById('ads-status');
const inlineAdContainer = document.getElementById('inline-ad');
const sidebarAdContainer = document.getElementById('sidebar-ad');
const bottomAdContainer = document.getElementById('bottom-ad');

// Modal Elements
const infoModal = document.getElementById('info-modal');
const shortcutsModal = document.getElementById('shortcuts-modal');
const adminModal = document.getElementById('admin-modal') || createAdminModal();
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModalButtons = document.querySelectorAll('.close-modal');

// --- State Variables ---
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let currentVideoId = null;
let currentVideoData = null;
let wakeLock = null;
let isMenuOpen = false;
let adSlots = {};
let adInterval = null;

// --- ADMIN CONTROL VARIABLES ---
let adsEnabled = true; // Default to enabled
let adminPassword = "infinity123"; // CHANGE THIS TO YOUR PASSWORD
let whitelistedUsers = []; // Array of user identifiers
let adminLoggedIn = false;
let globalAdsEnabled = true; // Master switch controlled by admin

// --- YouTube API Integration ---
let ytAPILoaded = false;

// Check if YouTube API is already loaded
if (window.YT && window.YT.loaded) {
    ytAPILoaded = true;
    console.log("✅ YouTube API already loaded");
} else {
    window.onYouTubeIframeAPIReady = function() {
        ytAPILoaded = true;
        console.log("✅ YouTube API Ready");
    };
}

// --- Admin Modal Creation ---
function createAdminModal() {
    const modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content admin-modal-content">
            <span class="close-admin-modal close-modal">&times;</span>
            <h3><i class="fas fa-user-shield"></i> Admin Control Panel</h3>
            <div class="admin-panel">
                <div class="admin-section">
                    <h4><i class="fas fa-toggle-on"></i> Global Ad Settings</h4>
                    <div class="admin-control">
                        <label class="admin-switch">
                            <input type="checkbox" id="global-ads-toggle" checked>
                            <span class="admin-slider"></span>
                        </label>
                        <span>Global Ads Status: <strong id="global-ads-status">Enabled</strong></span>
                    </div>
                    <p class="admin-note">When disabled, ads won't show for ANY user</p>
                </div>
                
                <div class="admin-section">
                    <h4><i class="fas fa-user-check"></i> User Whitelist</h4>
                    <div class="whitelist-control">
                        <input type="text" id="whitelist-input" placeholder="Enter user identifier (IP/ID)">
                        <button id="add-whitelist" class="admin-btn"><i class="fas fa-plus"></i> Add</button>
                    </div>
                    <div class="whitelist-container">
                        <h5>Whitelisted Users:</h5>
                        <div id="whitelist-display" class="whitelist-display">
                            <p class="empty-whitelist">No users whitelisted yet</p>
                        </div>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h4><i class="fas fa-cog"></i> Admin Settings</h4>
                    <div class="admin-control">
                        <label>Change Admin Password:</label>
                        <div class="password-control">
                            <input type="password" id="new-password" placeholder="New password">
                            <button id="save-password" class="admin-btn"><i class="fas fa-save"></i> Save</button>
                        </div>
                    </div>
                    
                    <div class="admin-control">
                        <label>Current User Status:</label>
                        <div id="user-status" class="user-status">
                            <i class="fas fa-user"></i> 
                            <span id="current-user-id">Loading user ID...</span>
                            <span id="user-ads-status" class="status-badge">Checking...</span>
                        </div>
                    </div>
                </div>
                
                <div class="admin-stats">
                    <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value" id="total-users">0</div>
                            <div class="stat-label">Total Users</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="ads-shown">0</div>
                            <div class="stat-label">Ads Shown</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="whitelist-count">0</div>
                            <div class="stat-label">Whitelisted</div>
                        </div>
                    </div>
                </div>
                
                <div class="admin-actions">
                    <button id="export-data" class="admin-btn secondary"><i class="fas fa-download"></i> Export Data</button>
                    <button id="reset-all" class="admin-btn danger"><i class="fas fa-trash"></i> Reset All</button>
                    <button id="logout-admin" class="admin-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// --- Admin Functions ---
function initAdminSystem() {
    // Load saved admin settings
    const savedSettings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
    globalAdsEnabled = savedSettings.globalAdsEnabled !== false; // Default to true
    whitelistedUsers = savedSettings.whitelistedUsers || [];
    adminPassword = savedSettings.adminPassword || "infinity123";
    
    // Get or create user ID
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem('userId', userId);
    }
    
    // Check if user should see ads
    adsEnabled = shouldShowAds(userId);
    
    // Update UI
    updateAdminUI();
    updateUserStatus(userId);
    updateStats();
}

function generateUserId() {
    // Generate a unique user ID
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function shouldShowAds(userId) {
    // Check if global ads are enabled
    if (!globalAdsEnabled) return false;
    
    // Check if user is whitelisted
    return whitelistedUsers.includes(userId);
}

function updateAdminUI() {
    const globalAdsToggle = document.getElementById('global-ads-toggle');
    const globalAdsStatus = document.getElementById('global-ads-status');
    
    if (globalAdsToggle) {
        globalAdsToggle.checked = globalAdsEnabled;
        globalAdsStatus.textContent = globalAdsEnabled ? "Enabled" : "Disabled";
        globalAdsStatus.className = globalAdsEnabled ? "status-enabled" : "status-disabled";
    }
    
    // Update whitelist display
    updateWhitelistDisplay();
    
    // Update user status
    const userId = localStorage.getItem('userId');
    updateUserStatus(userId);
}

function updateUserStatus(userId) {
    const userStatusElement = document.getElementById('user-status');
    const currentUserIdElement = document.getElementById('current-user-id');
    const userAdsStatusElement = document.getElementById('user-ads-status');
    
    if (userStatusElement && currentUserIdElement && userAdsStatusElement) {
        currentUserIdElement.textContent = userId.substring(0, 12) + '...';
        
        const showAds = shouldShowAds(userId);
        userAdsStatusElement.textContent = showAds ? "Will see ads" : "No ads";
        userAdsStatusElement.className = showAds ? "status-badge status-ads" : "status-badge status-no-ads";
    }
}

function updateWhitelistDisplay() {
    const whitelistDisplay = document.getElementById('whitelist-display');
    if (!whitelistDisplay) return;
    
    if (whitelistedUsers.length === 0) {
        whitelistDisplay.innerHTML = '<p class="empty-whitelist">No users whitelisted yet</p>';
        return;
    }
    
    whitelistDisplay.innerHTML = whitelistedUsers.map((userId, index) => `
        <div class="whitelist-item">
            <span class="user-id">${userId.substring(0, 10)}...</span>
            <button class="remove-user" data-index="${index}" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-user').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromWhitelist(index);
        });
    });
}

function updateStats() {
    const totalUsersElement = document.getElementById('total-users');
    const adsShownElement = document.getElementById('ads-shown');
    const whitelistCountElement = document.getElementById('whitelist-count');
    
    if (totalUsersElement) {
        // Count unique users from localStorage
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        totalUsersElement.textContent = allUsers.length;
    }
    
    if (adsShownElement) {
        const adsShown = parseInt(localStorage.getItem('adsShown') || '0');
        adsShownElement.textContent = adsShown;
    }
    
    if (whitelistCountElement) {
        whitelistCountElement.textContent = whitelistedUsers.length;
    }
}

function saveAdminSettings() {
    const settings = {
        globalAdsEnabled,
        whitelistedUsers,
        adminPassword,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('adminSettings', JSON.stringify(settings));
}

function addToWhitelist(userId) {
    if (!userId || userId.trim() === '') {
        showError("Please enter a valid user ID");
        return;
    }
    
    if (!whitelistedUsers.includes(userId)) {
        whitelistedUsers.push(userId);
        saveAdminSettings();
        updateWhitelistDisplay();
        updateStats();
        showSuccess(`User ${userId.substring(0, 10)}... added to whitelist`);
        
        // Track user in all users list
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        if (!allUsers.includes(userId)) {
            allUsers.push(userId);
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
    } else {
        showError("User already in whitelist");
    }
}

function removeFromWhitelist(index) {
    if (index >= 0 && index < whitelistedUsers.length) {
        const removedUser = whitelistedUsers[index];
        whitelistedUsers.splice(index, 1);
        saveAdminSettings();
        updateWhitelistDisplay();
        updateStats();
        showSuccess(`User ${removedUser.substring(0, 10)}... removed from whitelist`);
    }
}

function toggleGlobalAds() {
    globalAdsEnabled = !globalAdsEnabled;
    saveAdminSettings();
    updateAdminUI();
    
    const userId = localStorage.getItem('userId');
    adsEnabled = shouldShowAds(userId);
    
    if (adsEnabled) {
        loadAdSenseAds();
        startAdRefreshInterval();
    } else {
        hideAllAds();
        stopAdRefreshInterval();
    }
    
    showSuccess(`Global ads ${globalAdsEnabled ? 'enabled' : 'disabled'}`);
}

function showAdminLogin() {
    const password = prompt("Enter admin password:");
    if (password === adminPassword) {
        adminLoggedIn = true;
        showAdminPanel();
        showSuccess("Admin login successful");
    } else if (password !== null) {
        showError("Incorrect password");
    }
}

function showAdminPanel() {
    if (!adminLoggedIn) {
        showAdminLogin();
        return;
    }
    
    const adminModal = document.getElementById('admin-modal');
    if (adminModal) {
        adminModal.classList.add('show');
        updateAdminUI();
        updateStats();
    }
}

function logoutAdmin() {
    adminLoggedIn = false;
    const adminModal = document.getElementById('admin-modal');
    if (adminModal) {
        adminModal.classList.remove('show');
    }
    showSuccess("Logged out from admin panel");
}

// --- Theme Management ---
function initTheme() {
    document.body.classList.toggle('dark-mode', isDarkMode);
    themeStatus.textContent = isDarkMode ? "Dark" : "Light";
    
    const icon = themeMenuToggle.querySelector('i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    initTheme();
    showSuccess(isDarkMode ? "Dark theme enabled" : "Light theme enabled");
}

// --- AdSense Management ---
function initAds() {
    const userId = localStorage.getItem('userId');
    adsEnabled = shouldShowAds(userId);
    adsStatus.textContent = adsEnabled ? "On" : "Off";
    
    if (adsEnabled) {
        loadAdSenseAds();
        startAdRefreshInterval();
    } else {
        hideAllAds();
    }
}

function toggleAds() {
    // For regular users, show message that only admin can change
    if (!adminLoggedIn) {
        showError("Only admin can change ad settings");
        showAdminLogin();
        return;
    }
    
    // For admin, toggle global setting
    toggleGlobalAds();
}

function loadAdSenseAds() {
    // Clear existing ads
    hideAllAds();
    
    // Check if ads should be shown for this user
    const userId = localStorage.getItem('userId');
    if (!shouldShowAds(userId)) {
        showAdPlaceholders("Ads disabled for your account");
        return;
    }
    
    // Show containers
    if (inlineAdContainer) inlineAdContainer.style.display = 'flex';
    if (bottomAdContainer) bottomAdContainer.style.display = 'flex';
    if (sidebarAdContainer && window.innerWidth > 768) sidebarAdContainer.style.display = 'flex';
    
    // Load ads after a short delay
    setTimeout(() => {
        if (adsEnabled && typeof (adsbygoogle = window.adsbygoogle || []).push === 'function') {
            
            // Inline Ad (Option B - In-Content)
            if (inlineAdContainer) {
                try {
                    inlineAdContainer.innerHTML = `
                        <ins class="adsbygoogle"
                             style="display:block; text-align:center;"
                             data-ad-layout="in-article"
                             data-ad-format="fluid"
                             data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                             data-ad-slot="YOUR_INLINE_AD_SLOT">
                        </ins>
                    `;
                    
                    // Push the ad
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    
                    // Track ad shown
                    trackAdShown();
                    
                    console.log("✅ Inline ad loaded");
                } catch (error) {
                    console.error("❌ Error loading inline ad:", error);
                    showAdPlaceholder(inlineAdContainer, "Inline Ad");
                }
            }
            
            // Bottom Banner Ad
            if (bottomAdContainer) {
                try {
                    bottomAdContainer.innerHTML = `
                        <ins class="adsbygoogle"
                             style="display:block"
                             data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                             data-ad-slot="YOUR_BANNER_AD_SLOT"
                             data-ad-format="auto"
                             data-full-width-responsive="true">
                        </ins>
                    `;
                    
                    // Push the ad
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    
                    console.log("✅ Bottom banner ad loaded");
                } catch (error) {
                    console.error("❌ Error loading bottom ad:", error);
                    showAdPlaceholder(bottomAdContainer, "Banner Ad");
                }
            }
            
            // Sidebar Ad (only on desktop)
            if (sidebarAdContainer && window.innerWidth > 768) {
                try {
                    sidebarAdContainer.innerHTML = `
                        <ins class="adsbygoogle"
                             style="display:block"
                             data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                             data-ad-slot="YOUR_SIDEBAR_AD_SLOT"
                             data-ad-format="rectangle">
                        </ins>
                    `;
                    
                    // Push the ad
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    
                    console.log("✅ Sidebar ad loaded");
                } catch (error) {
                    console.error("❌ Error loading sidebar ad:", error);
                    showAdPlaceholder(sidebarAdContainer, "Sidebar Ad");
                }
            }
            
        } else {
            console.log("⚠️ AdSense not available or ads disabled");
            showAdPlaceholders();
        }
    }, 1500);
}

function trackAdShown() {
    let adsShown = parseInt(localStorage.getItem('adsShown') || '0');
    adsShown++;
    localStorage.setItem('adsShown', adsShown.toString());
    updateStats();
}

function hideAllAds() {
    [inlineAdContainer, sidebarAdContainer, bottomAdContainer].forEach(container => {
        if (container) {
            container.style.display = 'none';
            container.innerHTML = `
                <div class="ad-placeholder">
                    <i class="fas fa-ad"></i>
                    <p>Ads are disabled</p>
                    <small>Contact admin for access</small>
                </div>
            `;
        }
    });
}

function showAdPlaceholders(message = "Advertisement") {
    [inlineAdContainer, sidebarAdContainer, bottomAdContainer].forEach(container => {
        if (container) {
            showAdPlaceholder(container, message);
        }
    });
}

function showAdPlaceholder(container, type = "Ad") {
    if (container) {
        container.style.display = 'flex';
        container.innerHTML = `
            <div class="ad-placeholder">
                <i class="fas fa-ad"></i>
                <p>${type}</p>
                <small>Advertisement</small>
            </div>
        `;
    }
}

function startAdRefreshInterval() {
    // Refresh ads every 30 seconds if enabled
    stopAdRefreshInterval(); // Clear any existing interval
    
    if (adsEnabled) {
        adInterval = setInterval(() => {
            if (adsEnabled && document.visibilityState === 'visible') {
                console.log("🔄 Refreshing ads...");
                loadAdSenseAds();
            }
        }, 30000); // 30 seconds
    }
}

function stopAdRefreshInterval() {
    if (adInterval) {
        clearInterval(adInterval);
        adInterval = null;
    }
}

// Handle window resize for responsive ads
function handleWindowResize() {
    if (adsEnabled) {
        // Reload ads on resize to ensure proper formatting
        setTimeout(loadAdSenseAds, 300);
    }
}

// --- Menu System ---
function toggleMenu() {
    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    isMenuOpen = true;
    
    // First set display to block for overlay
    menuOverlay.style.display = 'block';
    sidebar.style.display = 'flex';
    
    // Force reflow to ensure CSS transition works
    void sidebar.offsetWidth;
    
    // Add show classes to trigger animations
    setTimeout(() => {
        sidebar.classList.add('show');
        menuOverlay.classList.add('show');
        menuToggle.classList.add('open');
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        menuToggle.setAttribute('aria-label', 'Close Menu');
    }, 10);
    
    updateMenuHistory();
    document.body.style.overflow = 'hidden';
    
    checkNewVideosInHistory();
}

function closeMenu() {
    if (!isMenuOpen) return;
    
    isMenuOpen = false;
    
    // Remove show classes to trigger closing animations
    sidebar.classList.remove('show');
    menuOverlay.classList.remove('show');
    menuToggle.classList.remove('open');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        sidebar.style.display = 'none';
        menuOverlay.style.display = 'none';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', 'Open Menu');
        document.body.style.overflow = '';
    }, 300);
}

function checkNewVideosInHistory() {
    const lastOpenTime = localStorage.getItem('lastMenuOpen');
    const history = JSON.parse(localStorage.getItem('videoHistory') || '[]');
    
    if (!lastOpenTime) {
        localStorage.setItem('lastMenuOpen', new Date().toISOString());
        return;
    }
    
    const newVideos = history.filter(video => 
        new Date(video.timestamp) > new Date(lastOpenTime)
    ).length;
    
    if (newVideos > 0) {
        showSuccess(`${newVideos} new video${newVideos > 1 ? 's' : ''} in history`);
    }
    
    localStorage.setItem('lastMenuOpen', new Date().toISOString());
}

// --- Video Metadata Fetching ---
async function fetchVideoMetadata(videoId) {
    if (!videoId) return;
    
    try {
        apiLoadingElement.style.display = 'flex';
        
        const cachedData = getCachedVideoData(videoId);
        if (cachedData) {
            updateVideoInfoUI(cachedData);
            apiLoadingElement.style.display = 'none';
            return;
        }
        
        const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );
        
        if (!response.ok) throw new Error('Failed to fetch video info');
        
        const data = await response.json();
        const videoData = {
            id: videoId,
            title: data.title,
            author: data.author_name,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            thumbnail_small: `https://img.youtube.com/vi/${videoId}/default.jpg`,
            duration: null,
            views: null
        };
        
        cacheVideoData(videoId, videoData);
        updateVideoInfoUI(videoData);
        await fetchVideoDuration(videoId);
        
    } catch (error) {
        console.error("Error fetching video metadata:", error);
        updateVideoInfoUI({
            title: "Video loaded",
            author: "YouTube",
            thumbnail: "",
            duration: "N/A",
            views: "N/A"
        });
    } finally {
        apiLoadingElement.style.display = 'none';
    }
}

async function fetchVideoDuration(videoId) {
    try {
        const response = await fetch(
            `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
        );
        
        if (response.ok) {
            const data = await response.json();
            if (data.duration) {
                updateCachedVideoDuration(videoId, data.duration);
                videoDuration.textContent = formatDuration(data.duration);
            }
        }
    } catch (error) {
        console.log("Could not fetch duration:", error);
    }
}

function updateVideoInfoUI(videoData) {
    currentVideoData = videoData;
    
    videoTitle.textContent = videoData.title || "Video loaded";
    videoChannel.textContent = videoData.author || "YouTube";
    
    if (videoData.thumbnail) {
        videoThumbnail.innerHTML = `<img src="${videoData.thumbnail}" alt="${videoData.title}" loading="lazy">`;
    } else {
        videoThumbnail.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    videoDuration.textContent = videoData.duration ? formatDuration(videoData.duration) : "Loading...";
    videoViews.textContent = videoData.views ? formatViews(videoData.views) : "Loading views...";
}

function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatViews(views) {
    if (!views) return "0 views";
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M views';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K views';
    return views.toLocaleString() + ' views';
}

// --- Cache Management ---
function cacheVideoData(videoId, data) {
    try {
        const cache = JSON.parse(localStorage.getItem('videoCache') || '{}');
        cache[videoId] = { ...data, cachedAt: new Date().toISOString() };
        
        const keys = Object.keys(cache);
        if (keys.length > 50) delete cache[keys[0]];
        
        localStorage.setItem('videoCache', JSON.stringify(cache));
    } catch (error) {
        console.error("Error caching video data:", error);
    }
}

function getCachedVideoData(videoId) {
    try {
        const cache = JSON.parse(localStorage.getItem('videoCache') || '{}');
        const cached = cache[videoId];
        if (cached && new Date(cached.cachedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
            return cached;
        }
    } catch (error) {
        console.error("Error reading cache:", error);
    }
    return null;
}

function updateCachedVideoDuration(videoId, duration) {
    try {
        const cache = JSON.parse(localStorage.getItem('videoCache') || '{}');
        if (cache[videoId]) {
            cache[videoId].duration = duration;
            localStorage.setItem('videoCache', JSON.stringify(cache));
        }
    } catch (error) {
        console.error("Error updating cache:", error);
    }
}

// --- Menu History Management ---
function updateMenuHistory() {
    const history = JSON.parse(localStorage.getItem('videoHistory') || '[]');
    menuHistory.innerHTML = '';
    
    if (history.length === 0) {
        menuHistory.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>No recent videos yet</p>
            </div>
        `;
        return;
    }
    
    history.slice(0, 10).forEach((item) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item-menu';
        historyItem.innerHTML = `
            <div class="history-thumb">
                ${item.thumbnail ? 
                    `<img src="${item.thumbnail}" alt="${item.title}" loading="lazy">` :
                    `<div style="background: linear-gradient(45deg, #00e0ff, #00c4ff); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-play" style="color: #000;"></i>
                    </div>`
                }
            </div>
            <div class="history-details">
                <div class="history-title">${item.title || 'Unknown Video'}</div>
                <div class="history-time">${formatTimeAgo(item.timestamp)}</div>
            </div>
        `;
        
        historyItem.addEventListener('click', () => {
            videoLinkInput.value = item.url;
            loadVideo();
            closeMenu();
        });
        
        menuHistory.appendChild(historyItem);
    });
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
}

// --- Status Handlers ---
function showError(message) {
    errorMessageElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorMessageElement.style.display = 'block';
    setTimeout(() => (errorMessageElement.style.display = 'none'), 5000);
}

function showSuccess(message) {
    successMessageElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    successMessageElement.style.display = 'block';
    setTimeout(() => (successMessageElement.style.display = 'none'), 3000);
}

// --- Video Handling ---
function getYouTubeVideoId(url) {
    const patterns = [
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([^&\n?#]+)/,
        /youtube\.com\/playlist\?list=([^&\n?#]+)/,
        /youtube\.com\/watch\?v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function isYouTubeLink(url) {
    return url.includes('youtube.com') || url.includes('youtu.be');
}

async function loadVideo() {
    const link = videoLinkInput.value.trim();
    if (!link) {
        showError("Please enter a YouTube link");
        return;
    }
    
    if (!isYouTubeLink(link)) {
        showError("Only YouTube links are supported");
        return;
    }

    const videoId = getYouTubeVideoId(link);
    if (!videoId) {
        showError("Invalid YouTube URL");
        return;
    }

    currentVideoId = videoId;
    loadingElement.style.display = 'flex';
    
    videoTitle.textContent = "Loading...";
    videoChannel.textContent = "YouTube";
    videoDuration.textContent = "0:00";
    videoViews.textContent = "0 views";
    videoThumbnail.innerHTML = '<div class="loading-spinner" style="width: 30px; height: 30px;"></div>';
    
    try {
        await saveToHistory(videoId, link);
        updateMenuHistory();
        await fetchVideoMetadata(videoId);
        
        const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`;
        youtubeIframe.src = embedUrl;
        
        showSuccess("Video loaded successfully");
        requestWakeLock();
        updatePageURL(link);
        
        menuToggle.classList.add('has-notification');
        setTimeout(() => menuToggle.classList.remove('has-notification'), 3000);
        
        // Refresh ads after video load (if enabled)
        if (adsEnabled) {
            setTimeout(loadAdSenseAds, 2000);
        }
        
    } catch (error) {
        showError("Failed to load video");
        console.error(error);
    } finally {
        loadingElement.style.display = 'none';
    }
}

// --- History Management ---
async function saveToHistory(videoId, url) {
    try {
        const history = JSON.parse(localStorage.getItem('videoHistory') || '[]');
        const existingIndex = history.findIndex(item => item.id === videoId);
        
        if (existingIndex > -1) {
            const existingItem = history.splice(existingIndex, 1)[0];
            existingItem.timestamp = new Date().toISOString();
            history.unshift(existingItem);
        } else {
            history.unshift({
                id: videoId,
                url: url,
                title: "Loading...",
                thumbnail: `https://img.youtube.com/vi/${videoId}/default.jpg`,
                timestamp: new Date().toISOString()
            });
        }
        
        if (history.length > 20) history.length = 20;
        localStorage.setItem('videoHistory', JSON.stringify(history));
        
        if (currentVideoData) {
            setTimeout(() => updateHistoryItemTitle(videoId, currentVideoData.title), 1000);
        }
        
    } catch (error) {
        console.error("Failed to save history:", error);
    }
}

function updateHistoryItemTitle(videoId, title) {
    try {
        const history = JSON.parse(localStorage.getItem('videoHistory') || '[]');
        const itemIndex = history.findIndex(item => item.id === videoId);
        
        if (itemIndex > -1) {
            history[itemIndex].title = title;
            localStorage.setItem('videoHistory', JSON.stringify(history));
            if (isMenuOpen) updateMenuHistory();
        }
    } catch (error) {
        console.error("Failed to update history title:", error);
    }
}

function clearHistory() {
    if (confirm("Are you sure you want to clear all video history?")) {
        localStorage.removeItem('videoHistory');
        updateMenuHistory();
        showSuccess("History cleared successfully");
    }
}

// --- Copy Link Function ---
async function copyVideoLink() {
    if (!currentVideoId) {
        showError("No video loaded");
        return;
    }
    
    try {
        const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;
        await navigator.clipboard.writeText(videoUrl);
        showSuccess("Video link copied to clipboard");
    } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = `https://www.youtube.com/watch?v=${currentVideoId}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccess("Link copied!");
    }
}

// --- Share Video Function ---
async function shareVideo() {
    if (!currentVideoId) {
        showError("No video loaded to share");
        return;
    }
    
    try {
        const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`;
        const shareUrl = `${window.location.origin}${window.location.pathname}?v=${encodeURIComponent(videoUrl)}`;
        const shareText = currentVideoData ? 
            `Watch "${currentVideoData.title}" on INFINITY Player` : 
            "Watch this video on INFINITY Player";
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'INFINITY YouTube Player',
                    text: shareText,
                    url: shareUrl,
                });
                showSuccess("Shared successfully");
                return;
            } catch (shareError) {
                console.log('Web Share API failed:', shareError);
            }
        }
        
        await copyToClipboard(shareUrl);
        
    } catch (error) {
        console.error("Error sharing video:", error);
        showError("Failed to share video");
    }
}

// --- Helper for Clipboard ---
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showSuccess("Share link copied to clipboard");
        return true;
    } catch (error) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const result = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (result) {
                showSuccess("Share link copied!");
                return true;
            } else {
                showError("Failed to copy link");
                return false;
            }
        } catch (fallbackError) {
            showError("Failed to copy link");
            return false;
        }
    }
}

// --- Auto-load from URL ---
function autoLoadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const videoParam = params.get('v') || params.get('video') || params.get('url') || params.get('link');
    
    if (videoParam) {
        try {
            const decodedUrl = decodeURIComponent(videoParam);
            if (isYouTubeLink(decodedUrl)) {
                videoLinkInput.value = decodedUrl;
                loadingElement.style.display = 'flex';
                
                setTimeout(() => {
                    loadVideo();
                    showSuccess("Video auto-loaded from URL");
                }, 800);
                
                return true;
            }
        } catch (error) {
            console.error("Error parsing URL parameter:", error);
        }
    }
    
    const videoIdParam = params.get('id') || params.get('vid');
    if (videoIdParam) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoIdParam}`;
        videoLinkInput.value = youtubeUrl;
        loadingElement.style.display = 'flex';
        
        setTimeout(() => {
            loadVideo();
            showSuccess("Video auto-loaded from ID");
        }, 800);
        
        return true;
    }
    
    return false;
}

// --- Update Page URL for Sharing ---
function updatePageURL(url) {
    try {
        const videoId = getYouTubeVideoId(url);
        if (videoId) {
            const newUrl = new URL(window.location.href);
            const paramsToRemove = ['v', 'video', 'url', 'link', 'id', 'vid'];
            paramsToRemove.forEach(param => newUrl.searchParams.delete(param));
            newUrl.searchParams.set('v', url);
            window.history.replaceState({}, document.title, newUrl.toString());
            
            if (currentVideoData && currentVideoData.title) {
                document.title = `${currentVideoData.title} | INFINITY Player`;
            }
        }
    } catch (error) {
        console.error("Error updating URL:", error);
    }
}

// --- Wake Lock ---
async function requestWakeLock() {
    if ('wakeLock' in navigator && !wakeLock) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log("Wake Lock activated");
            
            wakeLock.addEventListener('release', () => {
                console.log("Wake Lock released");
                wakeLock = null;
            });
            
        } catch (err) {
            console.warn(`Wake Lock failed: ${err.message}`);
        }
    }
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
    }
}

// --- Keyboard Shortcuts ---
function handleKeyboardShortcuts(event) {
    if (event.target.tagName === 'INPUT' || event.target.isContentEditable) return;
    
    switch (event.key.toLowerCase()) {
        case 'm':
            event.preventDefault();
            toggleMenu();
            break;
        case 'f':
            event.preventDefault();
            toggleFullscreen();
            break;
        case 'r':
            event.preventDefault();
            resetPlayer();
            break;
        case 't':
            event.preventDefault();
            toggleTheme();
            break;
        case 'c':
            event.preventDefault();
            copyVideoLink();
            break;
        case 's':
            event.preventDefault();
            if (shareButton) shareVideo();
            break;
        case 'a':
            event.preventDefault();
            toggleAds();
            break;
        case 'enter':
            if (document.activeElement !== videoLinkInput) {
                event.preventDefault();
                loadVideo();
            }
            break;
        case '/':
            event.preventDefault();
            if (!isMenuOpen) {
                videoLinkInput.focus();
                videoLinkInput.select();
            }
            break;
        case 'h':
            event.preventDefault();
            if (!isMenuOpen) toggleMenu();
            break;
        case '0': // Admin panel shortcut (Ctrl+0 or just 0)
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                showAdminLogin();
            }
            break;
        case 'escape':
            event.preventDefault();
            if (isMenuOpen) {
                closeMenu();
            } else if (infoModal.classList.contains('show') || shortcutsModal.classList.contains('show')) {
                closeModals();
            } else if (document.getElementById('admin-modal') && document.getElementById('admin-modal').classList.contains('show')) {
                logoutAdmin();
            } else if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
}

// --- Fullscreen ---
function toggleFullscreen() {
    if (!currentVideoId) {
        showError("Load a video first");
        return;
    }
    
    if (!document.fullscreenElement) {
        const elem = youtubeIframe;
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    }
}

// --- Reset Player ---
function resetPlayer() {
    youtubeIframe.src = '';
    videoLinkInput.value = '';
    currentVideoId = null;
    currentVideoData = null;
    
    videoTitle.textContent = "No video loaded";
    videoChannel.textContent = "YouTube";
    videoDuration.textContent = "0:00";
    videoViews.textContent = "0 views";
    videoThumbnail.innerHTML = '<i class="fas fa-play"></i>';
    
    document.title = "INFINITY YouTube Player";
    
    const newUrl = new URL(window.location.href);
    const paramsToRemove = ['v', 'video', 'url', 'link', 'id', 'vid'];
    paramsToRemove.forEach(param => newUrl.searchParams.delete(param));
    window.history.replaceState({}, document.title, newUrl.toString());
    
    releaseWakeLock();
    showSuccess("Player reset");
}

// --- Modal System ---
function showModal(title, content) {
    modalTitle.textContent = title;
    modalContent.innerHTML = content;
    infoModal.classList.add('show');
}

function closeModals() {
    infoModal.classList.remove('show');
    shortcutsModal.classList.remove('show');
    const adminModal = document.getElementById('admin-modal');
    if (adminModal) adminModal.classList.remove('show');
}

// --- Modal Content ---
const modalContents = {
    about: `
        <div class="modal-section">
            <h4><i class="fas fa-infinity"></i> About INFINITY Player</h4>
            <p>A privacy-focused YouTube player designed for distraction-free viewing experience.</p>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-star"></i> Features</h4>
            <ul>
                <li><strong>Privacy First:</strong> Uses YouTube's nocookie domain</li>
                <li><strong>Clean Interface:</strong> Minimal design, no distractions</li>
                <li><strong>Video History:</strong> Track your recent videos</li>
                <li><strong>Smart Menu:</strong> Quick access to all features</li>
                <li><strong>Keyboard Shortcuts:</strong> Faster navigation</li>
                <li><strong>Themes:</strong> Dark/Light mode support</li>
                <li><strong>Video Info:</strong> Real-time metadata display</li>
                <li><strong>Wake Lock:</strong> Screen stays on during playback</li>
                <li><strong>Auto-load:</strong> Load videos directly from URL parameters</li>
                <li><strong>Share:</strong> Generate shareable links</li>
                <li><strong>Admin Controls:</strong> Whitelist system for ad management</li>
            </ul>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-code"></i> Technology</h4>
            <p>Built with modern web technologies:</p>
            <div class="tech-tags">
                <span>HTML5</span>
                <span>CSS3</span>
                <span>JavaScript</span>
                <span>YouTube API</span>
                <span>LocalStorage</span>
                <span>Wake Lock API</span>
                <span>Web Share API</span>
                <span>Google AdSense</span>
                <span>Admin System</span>
            </div>
        </div>
        
        <div class="modal-signature">
            <p>Crafted with <i class="fas fa-heart"></i> by Shubham</p>
            <p class="version">v2.3 • Enhanced with Admin Controls</p>
        </div>
    `,
    
    privacy: `
        <div class="modal-section">
            <h4><i class="fas fa-shield-alt"></i> Privacy Information</h4>
            <p>Your privacy is our priority. Here's how we handle your data:</p>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-ban"></i> What We DON'T Collect</h4>
            <ul>
                <li><strong>No Personal Data:</strong> We don't collect names, emails, or personal info</li>
                <li><strong>No Tracking:</strong> No cookies, analytics, or tracking scripts</li>
                <li><strong>No History Sharing:</strong> Your watch history stays on your device</li>
                <li><strong>No IP Logging:</strong> We don't store IP addresses or location data</li>
            </ul>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-database"></i> What We Store Locally</h4>
            <ul>
                <li><strong>Video History:</strong> Last 20 videos (browser storage only)</li>
                <li><strong>Theme Preference:</strong> Your dark/light mode choice</li>
                <li><strong>Video Cache:</strong> Temporary video metadata (24 hours)</li>
                <li><strong>User ID:</strong> Anonymous identifier for ad control</li>
            </ul>
            <p class="note">All data is stored locally in your browser and never sent to any server.</p>
        </div>
        
        <div class="modal-section">
            <h4><i class="fab fa-youtube"></i> YouTube Integration</h4>
            <p>Videos load from <code>youtube-nocookie.com</code> which:</p>
            <ul>
                <li>Doesn't set tracking cookies until you interact</li>
                <li>Respects YouTube's privacy settings</li>
                <li>Follows Google's privacy guidelines</li>
            </ul>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-ad"></i> Advertising System</h4>
            <p>We use a whitelist-based ad system:</p>
            <ul>
                <li>Ads are shown only to whitelisted users</li>
                <li>Admin controls who sees ads</li>
                <li>Regular users cannot change ad settings</li>
                <li>Ads help support free development</li>
            </ul>
        </div>
    `,
    
    terms: `
        <div class="modal-section">
            <h4><i class="fas fa-file-contract"></i> Terms of Use</h4>
            <p>By using INFINITY YouTube Player, you agree to these terms:</p>
        </div>
        
        <div class="modal-section">
            <h4><i class="fab fa-youtube"></i> YouTube Compliance</h4>
            <ul>
                <li>This is a third-party YouTube viewer using official embeds</li>
                <li>All videos are served directly from YouTube's servers</li>
                <li>You must comply with <a href="https://www.youtube.com/t/terms" target="_blank">YouTube's Terms of Service</a></li>
                <li>Some videos may be restricted by uploaders from embedding</li>
            </ul>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-user-shield"></i> Admin System</h4>
            <ul>
                <li>Only admin can control ad settings</li>
                <li>Users are assigned anonymous IDs</li>
                <li>Admin can whitelist specific users for ads</li>
                <li>Attempting to bypass admin controls is prohibited</li>
            </ul>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-balance-scale"></i> Legal Disclaimer</h4>
            <p>INFINITY Player is an independent project and is not affiliated with YouTube, Google, or Alphabet Inc.</p>
            <p>The service is provided "as is" without warranties. We are not responsible for:</p>
            <ul>
                <li>Content availability or restrictions</li>
                <li>YouTube policy changes</li>
                <li>Video takedowns or copyright issues</li>
                <li>Browser compatibility issues</li>
                <li>Ad content served by Google AdSense</li>
            </ul>
        </div>
    `,
    
    contact: `
        <div class="modal-section">
            <h4><i class="fas fa-address-card"></i> Contact Information</h4>
        </div>
        
        <div class="contact-cards">
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-user"></i>
                </div>
                <h5>Developer</h5>
                <p>Shubham</p>
            </div>
            
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fab fa-instagram"></i>
                </div>
                <h5>Instagram</h5>
                <a href="https://www.instagram.com/i.shubham0210/" target="_blank">
                    @i.shubham0210
                </a>
            </div>
            
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-user-shield"></i>
                </div>
                <h5>Admin Access</h5>
                <p>Contact for ad whitelisting</p>
            </div>
            
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-ad"></i>
                </div>
                <h5>Ad Support</h5>
                <p>Whitelist system for ads</p>
            </div>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-life-ring"></i> Support & Feedback</h4>
            <ul>
                <li><strong>Bug Reports:</strong> DM on Instagram with details</li>
                <li><strong>Feature Requests:</strong> We welcome suggestions</li>
                <li><strong>Admin Access:</strong> Contact for whitelisting</li>
                <li><strong>Ad Issues:</strong> Report inappropriate ads via AdSense</li>
            </ul>
        </div>
        
        <div class="modal-section">
            <p class="thank-you">Thank you for using INFINITY Player!</p>
        </div>
    `
};

// --- Event Listeners ---
function initializeEventListeners() {
    // Initialize theme, admin system, and ads
    initTheme();
    initAdminSystem();
    initAds();
    
    // Theme toggle
    themeMenuToggle.addEventListener('click', toggleTheme);
    
    // Ads toggle - shows admin login for regular users
    toggleAdsButton.addEventListener('click', toggleAds);
    
    // Video loading
    playButton.addEventListener('click', loadVideo);
    videoLinkInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') loadVideo();
    });
    
    // Menu system
    menuToggle.addEventListener('click', toggleMenu);
    closeMenuButton.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    
    // Menu buttons
    clearHistoryButton.addEventListener('click', clearHistory);
    shortcutsHelpButton.addEventListener('click', () => {
        shortcutsModal.classList.add('show');
        closeMenu();
    });
    
    // Info menu buttons
    aboutMenuButton.addEventListener('click', () => {
        showModal('About INFINITY Player', modalContents.about);
        closeMenu();
    });
    
    privacyMenuButton.addEventListener('click', () => {
        showModal('Privacy Information', modalContents.privacy);
        closeMenu();
    });
    
    termsMenuButton.addEventListener('click', () => {
        showModal('Terms of Use', modalContents.terms);
        closeMenu();
    });
    
    contactMenuButton.addEventListener('click', () => {
        showModal('Contact & Support', modalContents.contact);
        closeMenu();
    });
    
    // Main controls
    fullscreenButton.addEventListener('click', toggleFullscreen);
    resetButton.addEventListener('click', resetPlayer);
    copyLinkButton.addEventListener('click', copyVideoLink);
    
    // Share button (if exists)
    if (shareButton && shareButton.id === 'share-button') {
        shareButton.addEventListener('click', shareVideo);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Modal controls
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    [infoModal, shortcutsModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModals();
        });
    });
    
    // Admin panel event listeners
    setupAdminEventListeners();
    
    // Wake lock release
    window.addEventListener('beforeunload', releaseWakeLock);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            releaseWakeLock();
            stopAdRefreshInterval();
        } else if (document.visibilityState === 'visible' && adsEnabled) {
            startAdRefreshInterval();
        }
    });
    
    // Auto-focus input on page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!videoLinkInput.value) videoLinkInput.focus();
        }, 500);
    });
    
    // Window resize for responsive ads
    window.addEventListener('resize', handleWindowResize);
    
    // Check AdSense script loading
    checkAdSenseLoaded();
}

function setupAdminEventListeners() {
    const adminModal = document.getElementById('admin-modal');
    if (!adminModal) return;
    
    // Global ads toggle
    const globalAdsToggle = document.getElementById('global-ads-toggle');
    if (globalAdsToggle) {
        globalAdsToggle.addEventListener('change', toggleGlobalAds);
    }
    
    // Add to whitelist
    const addWhitelistBtn = document.getElementById('add-whitelist');
    const whitelistInput = document.getElementById('whitelist-input');
    if (addWhitelistBtn && whitelistInput) {
        addWhitelistBtn.addEventListener('click', () => {
            addToWhitelist(whitelistInput.value.trim());
            whitelistInput.value = '';
        });
        
        whitelistInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addToWhitelist(whitelistInput.value.trim());
                whitelistInput.value = '';
            }
        });
    }
    
    // Save password
    const savePasswordBtn = document.getElementById('save-password');
    const newPasswordInput = document.getElementById('new-password');
    if (savePasswordBtn && newPasswordInput) {
        savePasswordBtn.addEventListener('click', () => {
            if (newPasswordInput.value.trim().length >= 6) {
                adminPassword = newPasswordInput.value.trim();
                saveAdminSettings();
                newPasswordInput.value = '';
                showSuccess("Password updated successfully");
            } else {
                showError("Password must be at least 6 characters");
            }
        });
    }
    
    // Export data
    const exportDataBtn = document.getElementById('export-data');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportAdminData);
    }
    
    // Reset all
    const resetAllBtn = document.getElementById('reset-all');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset ALL admin data? This cannot be undone.")) {
                resetAllAdminData();
            }
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logout-admin');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }
    
    // Close admin modal
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) logoutAdmin();
    });
}

function exportAdminData() {
    const data = {
        adminSettings: JSON.parse(localStorage.getItem('adminSettings') || '{}'),
        allUsers: JSON.parse(localStorage.getItem('allUsers') || '[]'),
        adsShown: localStorage.getItem('adsShown') || '0',
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `infinity-admin-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess("Admin data exported successfully");
}

function resetAllAdminData() {
    localStorage.removeItem('adminSettings');
    localStorage.removeItem('allUsers');
    localStorage.removeItem('adsShown');
    
    // Reset variables
    globalAdsEnabled = true;
    whitelistedUsers = [];
    adminPassword = "infinity123";
    
    initAdminSystem();
    showSuccess("All admin data has been reset");
}

function checkAdSenseLoaded() {
    let checkCount = 0;
    const maxChecks = 10;
    
    const checkInterval = setInterval(() => {
        checkCount++;
        
        if (typeof (adsbygoogle = window.adsbygoogle || []).push === 'function') {
            console.log("✅ AdSense script loaded");
            clearInterval(checkInterval);
            
            if (adsEnabled) {
                setTimeout(loadAdSenseAds, 2000);
            }
        } else if (checkCount >= maxChecks) {
            console.log("⚠️ AdSense script not loaded after multiple attempts");
            clearInterval(checkInterval);
            
            if (adsEnabled) {
                showAdPlaceholders();
            }
        }
    }, 1000);
}

// --- Particles Background ---
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { 
                    value: window.innerWidth < 768 ? 25 : 40,
                    density: { enable: true, value_area: 800 }
                },
                color: { value: '#00e0ff' },
                opacity: { value: 0.2, random: true },
                size: { value: 2, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00e0ff',
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: 'none',
                    random: true
                }
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// --- Initialization ---
function init() {
    initializeEventListeners();
    initParticles();
    updateMenuHistory();
    
    // Make sure menu starts closed
    sidebar.style.display = 'none';
    menuOverlay.style.display = 'none';
    
    // Auto-load from URL
    setTimeout(() => {
        const loaded = autoLoadFromURL();
        if (!loaded) {
            console.log("No auto-load parameter found");
        }
    }, 500);
    
    console.log("INFINITY Player v2.3 initialized");
    console.log("Features: YouTube API, Admin Controls, Whitelist System, AdSense Integration");
    console.log("AdSense: " + (adsEnabled ? "Enabled for this user" : "Disabled for this user"));
    console.log("Theme: " + (isDarkMode ? "Dark" : "Light"));
    console.log("History Items: " + (JSON.parse(localStorage.getItem('videoHistory') || '[]').length));
    console.log("Menu: Closed by default");
    console.log("Admin Password: " + adminPassword); // Remove this in production!
    
    // Initialize ads after a delay
    if (adsEnabled) {
        setTimeout(() => {
            if (typeof (adsbygoogle = window.adsbygoogle || []).push === 'function') {
                loadAdSenseAds();
                startAdRefreshInterval();
            }
        }, 3000);
    }
}

// Start the application
init();
