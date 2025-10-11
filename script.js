// ===== DOM elements =====
const videoLinkInput = document.getElementById('video-link');
const playButton = document.getElementById('play-button');
const youtubeWrapper = document.getElementById('youtube-wrapper');
const youtubeIframe = document.getElementById('youtube-iframe');
const directWrapper = document.getElementById('direct-wrapper');
const videoElement = document.getElementById('video');

const pipButton = document.getElementById('pip-button');
const fullscreenButton = document.getElementById('fullscreen-button');
const downloadButton = document.getElementById('download-button');
const resetButton = document.getElementById('reset-button');
const themeToggle = document.getElementById('theme-toggle');

const directControls = document.getElementById('direct-controls') || document.getElementById('direct-controls');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const playPauseBtn = document.getElementById('play-pause-btn');
const rewindBtn = document.getElementById('rewind-btn');
const forwardBtn = document.getElementById('forward-btn');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');
const qualitySelector = document.getElementById('quality-selector');
const qualitySelect = document.getElementById('quality-select');

const loadingElement = document.getElementById('loading');
const errorMessageElement = document.getElementById('error-message');
const successMessageElement = document.getElementById('success-message');

let wakeLock = null;
let currentVideoUrl = '';
let lastVolume = 1;
let isDark = false;

// ===== Theme init =====
(function initTheme() {
  isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) document.documentElement.style.setProperty('--bg-1','#061014');
  else document.documentElement.style.setProperty('--bg-1','#071014');
  // update theme icon
  updateThemeIcon();
})();

function updateThemeIcon(){
  themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// ===== theme toggle =====
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('darkMode', isDark);
  document.documentElement.style.setProperty('--bg-1', isDark ? '#041014' : '#071014');
  updateThemeIcon();
});

// ===== Wake Lock (keep screen awake) =====
async function requestWakeLock(){
  try {
    if ('wakeLock' in navigator && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => console.log('WakeLock released'));
      console.log('WakeLock acquired');
    }
  } catch(e){ console.warn('WakeLock error', e); }
}
function releaseWakeLock(){
  if (wakeLock) {
    wakeLock.release().catch(()=>{});
    wakeLock = null;
  }
}

// ===== helpers =====
function showError(msg){ errorMessageElement.textContent = msg; errorMessageElement.style.display='block'; setTimeout(()=> errorMessageElement.style.display='none',5000) }
function showSuccess(msg){ successMessageElement.textContent = msg; successMessageElement.style.display='block'; setTimeout(()=> successMessageElement.style.display='none',3000) }

function isYouTubeLink(url){
  return /youtube\.com|youtu\.be/.test(url);
}
function isValidVideoLink(url){
  const direct = /\.(mp4|webm|ogg|m3u8|mov|mpg|mpeg)(\?.*)?$/i;
  const yt = /youtube\.com|youtu\.be/;
  return (yt.test(url) || direct.test(url));
}
function getYouTubeVideoId(url){
  const reg = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&\n?#]+)/;
  const m = url.match(reg);
  return m ? m[1] : null;
}

// ===== Load video =====
playButton.addEventListener('click', loadVideo);
videoLinkInput.addEventListener('keypress', e => { if (e.key === 'Enter') loadVideo(); });

function loadVideo(){
  const link = (videoLinkInput.value || '').trim();
  if (!link) return showError('Please enter a video link');
  if (!isValidVideoLink(link)) return showError('Invalid video link (YouTube or direct file required)');
  loadingElement.style.display = 'block';
  errorMessageElement.style.display = 'none';
  successMessageElement.style.display = 'none';
  downloadButton.style.display = 'none';
  currentVideoUrl = link;

  setTimeout(() => {
    loadingElement.style.display = 'none';
    if (isYouTubeLink(link)) {
      const id = getYouTubeVideoId(link);
      if (!id) return showError('Could not parse YouTube video id');
      youtubeIframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      youtubeWrapper.style.display = 'block';
      directWrapper.style.display = 'none';
      directControls.style.display = 'none';
      showSuccess('YouTube video loaded');
    } else {
      // direct file
      videoElement.src = link;
      youtubeWrapper.style.display = 'none';
      directWrapper.style.display = 'block';
      directControls.style.display = 'block';
      downloadButton.style.display = 'inline-block';

      videoElement.controls = false;
      // attempt autoplay
      videoElement.play().then(()=> {
        requestWakeLock();
      }).catch(err => {
        console.warn('autoplay blocked', err);
      });

      // simulated quality options
      simulateQualityOptions();
    }
  }, 420);
}

// ===== Quality simulation =====
function simulateQualityOptions(){
  qualitySelect && (qualitySelect.innerHTML = '<option value="auto">Auto</option>');
  const qualities = ['1080p','720p','480p','360p'];
  qualities.forEach(q => {
    const opt = document.createElement('option');
    opt.value = q.toLowerCase(); opt.textContent = q;
    qualitySelect && qualitySelect.appendChild(opt);
  });
  qualitySelector && (qualitySelector.style.display = 'inline-block');
}

// ===== Direct video controls =====
videoElement.addEventListener('timeupdate', () => {
  if (!isNaN(videoElement.duration) && videoElement.duration > 0) {
    const pct = (videoElement.currentTime / videoElement.duration) * 100;
    progressBar.style.width = `${pct}%`;
    document.getElementById('current-time').textContent = formatTime(videoElement.currentTime);
    document.getElementById('duration').textContent = formatTime(videoElement.duration);
  }
});
videoElement.addEventListener('play', () => { requestWakeLock(); playPauseBtn.textContent = '⏸'; });
videoElement.addEventListener('pause', () => { releaseWakeLock(); playPauseBtn.textContent = '▶'; });
videoElement.addEventListener('ended', () => { releaseWakeLock(); playPauseBtn.textContent='▶'; showSuccess('Playback finished'); });
videoElement.addEventListener('error', ()=> showError('Failed to load video. Check URL or CORS.'));

function formatTime(sec){ if (!sec || isNaN(sec)) return '00:00'; const m = Math.floor(sec/60); const s = Math.floor(sec % 60); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }

playPauseBtn && playPauseBtn.addEventListener('click', () => {
  if (videoElement.paused) videoElement.play().catch(()=> showError('Play blocked - click on player'));
  else videoElement.pause();
});
rewindBtn && rewindBtn.addEventListener('click', ()=> { videoElement.currentTime = Math.max(0, videoElement.currentTime - 10); });
forwardBtn && forwardBtn.addEventListener('click', ()=> { videoElement.currentTime = Math.min(videoElement.duration || 0, videoElement.currentTime + 10); });

muteBtn && muteBtn.addEventListener('click', () => {
  if (videoElement.muted) { videoElement.muted = false; muteBtn.textContent = '🔊'; volumeSlider.value = lastVolume; }
  else { lastVolume = videoElement.volume || lastVolume; videoElement.muted = true; muteBtn.textContent = '🔇'; }
});
volumeSlider && volumeSlider.addEventListener('input', () => {
  videoElement.volume = volumeSlider.value;
  if (videoElement.volume > 0) { videoElement.muted = false; muteBtn.textContent = '🔊'; }
  else muteBtn.textContent = '🔇';
});

if (progressContainer) progressContainer.addEventListener('click', function(e){
  const rect = this.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  if (!isNaN(videoElement.duration)) videoElement.currentTime = pct * videoElement.duration;
});

// ===== PiP, Fullscreen, Download, Reset =====
async function togglePiP(){
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture().catch(()=> showError('Could not exit PiP'));
  } else if (videoElement.requestPictureInPicture) {
    await videoElement.requestPictureInPicture().catch(()=> showError('PiP unavailable'));
  } else showError('Picture-in-Picture not supported in this browser');
}
pipButton.addEventListener('click', togglePiP);

function toggleFullscreen(){
  const el = (directWrapper.style.display !== 'none') ? videoElement : youtubeIframe;
  if (!el) return;
  if (document.fullscreenElement) document.exitFullscreen().catch(()=> {});
  else el.requestFullscreen().catch(()=> showError('Fullscreen not available'));
}
fullscreenButton.addEventListener('click', toggleFullscreen);

downloadButton.addEventListener('click', () => {
  if (!currentVideoUrl || isYouTubeLink(currentVideoUrl)) return showError('Download only available for direct links');
  const a = document.createElement('a');
  a.href = currentVideoUrl;
  a.download = `video-${Date.now()}.${currentVideoUrl.split('.').pop().split('?')[0]}`;
  document.body.appendChild(a); a.click(); a.remove();
  showSuccess('Download started');
});

resetButton.addEventListener('click', () => {
  videoLinkInput.value = '';
  youtubeIframe.src = '';
  videoElement.pause(); videoElement.src = '';
  youtubeWrapper.style.display = 'block';
  directWrapper.style.display = 'none';
  directControls.style.display = 'none';
  downloadButton.style.display = 'none';
  progressBar.style.width = '0%';
  releaseWakeLock();
  showSuccess('Player reset');
});

// keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (document.activeElement === videoLinkInput) return;
  const directVisible = (directWrapper.style.display !== 'none');
  switch(e.code){
    case 'Space': if (directVisible) { e.preventDefault(); playPauseBtn.click(); } break;
    case 'ArrowRight': if (directVisible){ e.preventDefault(); videoElement.currentTime += 5; } break;
    case 'ArrowLeft': if (directVisible){ e.preventDefault(); videoElement.currentTime -= 5; } break;
    case 'KeyF': e.preventDefault(); toggleFullscreen(); break;
    case 'KeyP': if (directVisible) togglePiP(); break;
    case 'KeyD': if (directVisible) downloadButton.click(); break;
    case 'KeyR': resetButton.click(); break;
    case 'KeyT': themeToggle.click(); break;
    case 'KeyM': if (directVisible) muteBtn.click(); break;
    case 'Enter': if (document.activeElement !== videoLinkInput){ e.preventDefault(); loadVideo(); } break;
  }
});

// ===== Auto-load from query string (support ?=link) =====
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  // some earlier urls used ?=link (blank key)
  const blankKey = params.get('');
  const linkKey = params.get('v') || params.get('video') || params.get('url') || blankKey;
  if (linkKey) {
    videoLinkInput.value = linkKey;
    loadVideo();
  }
});

// ===== matrix heart animation =====
(function initMatrix(){
  const canvas = document.getElementById('matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const fontSize = Math.max(12, Math.floor(window.innerWidth/120)); // responsive
  const columns = Math.floor(w / fontSize);
  const drops = new Array(columns).fill(0);
  const symbols = '♡♡♡♡'; // hearts
  ctx.font = `${fontSize}px monospace`;

  function draw(){
    ctx.fillStyle = 'rgba(5,12,14,0.16)';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#00cec9';
    ctx.shadowColor = '#00f0e6';
    ctx.shadowBlur = 8;
    for (let i=0;i<columns;i++){
      const text = symbols.charAt(Math.floor(Math.random()*symbols.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);
      if (y > h && Math.random() > 0.985) drops[i] = 0;
      drops[i]++;
    }
  }
  let timer = setInterval(draw, 40);
  window.addEventListener('resize', ()=> {
    clearInterval(timer);
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const newFont = Math.max(10, Math.floor(window.innerWidth/120));
    ctx.font = `${newFont}px monospace`;
  });
})();

// ===== particles.js init =====
(function initParticles(){
  if (typeof particlesJS === 'undefined') return;
  particlesJS('particles-js', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: ["#00cec9","#0bd3a6"] },
      shape: { type: "circle" },
      opacity: { value: 0.6, anim: { enable: true, speed: 1, opacity_min: 0.2, sync: false } },
      size: { value: 2, random: true },
      line_linked: { enable: true, distance: 140, color: "#00cec9", opacity: 0.12, width: 1 },
      move: { enable: true, speed: 1.2, direction: "none", random: true, straight: false, bounce: false }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab:{distance:200, line_linked:{opacity:0.2}},
        bubble:{distance:200, size:6, duration:2, opacity:0.8},
        repulse:{distance:100}
      }
    },
    retina_detect: true
  });
})();
