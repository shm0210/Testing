// ===== DOM Elements =====
const videoLinkInput = document.getElementById('video-link');
const playButton = document.getElementById('play-button');
const videoPlayer = document.getElementById('video-player');
const loadingElement = document.getElementById('loading');
const errorMessageElement = document.getElementById('error-message');
const successMessageElement = document.getElementById('success-message');
const fullscreenButton = document.getElementById('fullscreen-button');
const resetButton = document.getElementById('reset-button');
const themeToggle = document.getElementById('theme-toggle');
const progressBar = document.getElementById('progress-bar');
const backwardBtn = document.getElementById('backward-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const forwardBtn = document.getElementById('forward-btn');
const muteBtn = document.getElementById('mute-btn');
const speedBtn = document.getElementById('speed-btn');
const shareBtn = document.getElementById('share-btn');
const statsBtn = document.getElementById('stats-btn');
const shortcutsBtn = document.getElementById('shortcuts-button');
const timeDisplay = document.getElementById('time-display');
const aboutToggle = document.getElementById('about-toggle');
const aboutContent = document.getElementById('about-content');
const qualitySelector = document.getElementById('quality-selector');
const qualitySelect = document.getElementById('quality-select');

let isDarkMode = localStorage.getItem('darkMode') === 'true';
let hls = null;
let wakeLock = null;
const playbackSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
let currentSpeedIndex = 2;

// ===== Theme Handling =====
function initTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark';
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    initTheme();
}

document.addEventListener('DOMContentLoaded', initTheme);
themeToggle.addEventListener('click', toggleTheme);

// ===== Messages =====
function showError(msg) {
    errorMessageElement.textContent = msg;
    errorMessageElement.style.display = 'block';
    setTimeout(() => errorMessageElement.style.display = 'none', 4000);
}

function showSuccess(msg) {
    successMessageElement.textContent = msg;
    successMessageElement.style.display = 'block';
    setTimeout(() => successMessageElement.style.display = 'none', 2500);
}

// ===== Format Time =====
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
        ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        : `${m}:${s.toString().padStart(2, '0')}`;
}

// ===== URL Validation =====
function isValidVideoUrl(url) {
    const videoExtensions = /\.(mp4|webm|mkv|mov|avi|m3u8|mpd)(\?.*)?$/i;
    const urlPattern = /^(https?:\/\/)/i;
    
    return urlPattern.test(url) && (
        videoExtensions.test(url) || 
        url.includes('m3u8') || 
        url.includes('mpd')
    );
}

// ===== Quality Selector =====
function setupQualitySelector(levels) {
    if (!levels || levels.length <= 1) return;
    
    qualitySelector.style.display = 'block';
    qualitySelect.innerHTML = '<option value="auto">Auto Quality</option>';
    
    levels.forEach((level, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${level.height}p ${Math.round(level.bitrate / 1000)}kbps`;
        qualitySelect.appendChild(option);
    });
    
    qualitySelect.value = hls.currentLevel;
}

// ===== Load Video =====
function loadVideo(url) {
    const link = url || videoLinkInput.value.trim();
    
    if (!link) {
        showError("Please enter a video URL");
        return;
    }
    
    if (!isValidVideoUrl(link)) {
        showError("Invalid URL. Please enter a valid video URL (MP4, WebM, MKV, MOV, or HLS .m3u8)");
        return;
    }
    
    loadingElement.style.display = 'block';
    qualitySelector.style.display = 'none';
    videoPlayer.pause();
    videoPlayer.removeAttribute('src');
    
    if (hls) {
        hls.destroy();
        hls = null;
    }
    
    // Save to recent URLs
    saveRecentUrl(link);
    
    setTimeout(() => {
        if (link.includes('.m3u8') && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            
            hls.loadSource(link);
            hls.attachMedia(videoPlayer);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoPlayer.play().catch(e => console.log('Autoplay prevented:', e));
                loadingElement.style.display = 'none';
                showSuccess("HLS stream loaded successfully");
                
                if (hls.levels && hls.levels.length > 1) {
                    setupQualitySelector(hls.levels);
                }
            });
            
            hls.on(Hls.Events.ERROR, (event, data) => {
                loadingElement.style.display = 'none';
                
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            showError("Network error. Please check your connection and URL");
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            showError("Media format not supported. Trying to recover...");
                            hls.recoverMediaError();
                            break;
                        default:
                            showError("Failed to load HLS stream");
                            break;
                    }
                }
                console.error('HLS Error:', data);
            });
            
            // Quality change handler
            qualitySelect.addEventListener('change', () => {
                if (qualitySelect.value === 'auto') {
                    hls.currentLevel = -1;
                } else {
                    hls.currentLevel = parseInt(qualitySelect.value);
                }
            });
            
        } else {
            // Direct video file
            videoPlayer.src = link;
            videoPlayer.load();
            
            videoPlayer.addEventListener('loadeddata', () => {
                loadingElement.style.display = 'none';
                showSuccess("Video loaded successfully");
                
                videoPlayer.play().catch(e => {
                    showError("Autoplay prevented. Click play button");
                    console.log('Autoplay prevented:', e);
                });
            });
            
            videoPlayer.addEventListener('error', () => {
                loadingElement.style.display = 'none';
                showError("Cannot play this video. Check URL or format");
            });
        }
    }, 300);
}

playButton.addEventListener('click', () => loadVideo());
videoLinkInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') loadVideo();
});

// ===== Fullscreen =====
fullscreenButton.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        videoPlayer.requestFullscreen().catch(() => {
            showError("Fullscreen not supported by your browser");
        });
    }
});

videoPlayer.addEventListener('fullscreenchange', () => {
    fullscreenButton.innerHTML = document.fullscreenElement 
        ? '<i class="fas fa-compress"></i> Exit Fullscreen'
        : '<i class="fas fa-expand"></i> Fullscreen';
});

// ===== Reset =====
resetButton.addEventListener('click', () => {
    videoPlayer.pause();
    videoPlayer.removeAttribute('src');
    videoLinkInput.value = '';
    qualitySelector.style.display = 'none';
    progressBar.value = 0;
    timeDisplay.textContent = '00:00 / 00:00';
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    if (hls) {
        hls.destroy();
        hls = null;
    }
    
    showSuccess("Player reset");
});

// ===== Seek Function =====
function seek(seconds) {
    if (videoPlayer.duration && !isNaN(videoPlayer.duration)) {
        const newTime = Math.max(0, Math.min(videoPlayer.currentTime + seconds, videoPlayer.duration));
        videoPlayer.currentTime = newTime;
    }
}

// ===== Toggle Mute =====
function toggleMute() {
    videoPlayer.muted = !videoPlayer.muted;
    updateMuteButton();
    showSuccess(videoPlayer.muted ? "Muted" : "Unmuted");
}

function updateMuteButton() {
    muteBtn.innerHTML = videoPlayer.muted 
        ? '<i class="fas fa-volume-mute"></i>'
        : `<i class="fas fa-volume-up"></i> ${Math.round(videoPlayer.volume * 100)}%`;
}

videoPlayer.addEventListener('volumechange', updateMuteButton);

// ===== Play/Pause =====
function togglePlayPause() {
    if (videoPlayer.paused || videoPlayer.ended) {
        videoPlayer.play();
    } else {
        video
