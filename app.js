const PLAYLIST_ID = "9495307201/papa-ke-jamane-ke-gaane";
const R2_ROOT = "https://pub-dca67106d684416ebbeaf0588d7d3363.r2.dev/";
const BASE_URL = R2_ROOT + "papa-ke-jamane-ke-gaane/";
const BHOJPURI_BASE_URL = R2_ROOT + "bihari-banger/";
const URL_2009 = R2_ROOT + "2009-vibes/";
const BARTAN_URL = R2_ROOT + "bartan-time/";
const GYM_URL = R2_ROOT + "gym-jam/";
const GENZ_URL = R2_ROOT + "genz-gaane/";
const NEENDI_URL = R2_ROOT + "neendi-time/";
const SHADI_URL = R2_ROOT + "shadi-samarav/";
const KK_URL = R2_ROOT + "the-great-kk/";
const CHANNEL_KEY = "pkj-channel-v1";

const audio = document.getElementById("audio");
const nowTitle = document.getElementById("nowTitle");
const nowArtist = document.getElementById("nowArtist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("playBtn");
const miniPlayer = document.getElementById("miniPlayer");
const seek = document.getElementById("seek");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volumeRange = document.getElementById("volumeRange");
const volumeIcon = document.getElementById("volumeIcon");
const muteBtn = document.getElementById("muteBtn");
const toast = document.getElementById("toast");
const errorPanel = document.getElementById("errorPanel");
const errorText = document.getElementById("errorText");
const playlistPopup = document.getElementById("playlistPopup");
const playlistPopupClose = document.getElementById("playlistPopupClose");
const popupList = document.getElementById("popupList");
const popupCount = document.getElementById("popupCount");
const channelBtn = document.getElementById("channelBtn");
const channelMenu = document.getElementById("channelMenu");
const currentChannelName = document.getElementById("currentChannelName");
const queueTitle = document.getElementById("queueTitle");
const heroTitle = document.getElementById("heroTitle");
const heroSub = document.getElementById("heroSub");

// Channel configurations — every channel below now has a real song list
// (channels with no supplied links — Chatpate Songs, Tamil Hits, Punjabi
// Tadka — have been removed until links are provided for them)
const CHANNELS = {
  papa: {
    id: 'papa',
    name: 'Papa Ke Jamane Ke Gaane',
    songList: songs,
    baseUrl: BASE_URL,
    heroTitle: 'पापा के<br>ज़माने के गाने',
    heroSub: 'पुराने गीत, वही एहसास — एक सुकून भरी शाम के लिए।'
  },
  bhojpuri: {
    id: 'bhojpuri',
    name: 'Bhojpuri Banger',
    songList: bhojpuriSongs,
    baseUrl: BHOJPURI_BASE_URL,
    heroTitle: 'भोजपुरी<br>बैंगर',
    heroSub: 'गाँव की मस्ती, ढोलक की थाप — पूरा यूपी-बिहार झूमेगा!'
  },
  '2009': {
    id: '2009',
    name: '2009s Vibe',
    songList: songs2009,
    baseUrl: URL_2009,
    heroTitle: '2009<br>की यादें',
    heroSub: 'वो साल, वो गाने — एक सुनहरी यात्रा।'
  },
  bartam: {
    id: 'bartam',
    name: 'Bartan Time',
    songList: bartanSongs,
    baseUrl: BARTAN_URL,
    heroTitle: 'बर्तन<br>टाइम',
    heroSub: 'किचन में काम करते हुए गाने — मज़ा आ जाए!'
  },
  gym: {
    id: 'gym',
    name: 'Gym Jam',
    songList: gymSongs,
    baseUrl: GYM_URL,
    heroTitle: 'GYM<br>JAM',
    heroSub: 'पंप करो, मसल्स बनाओ — हार्ड वर्कआउट के लिए!'
  },
  genz: {
    id: 'genz',
    name: 'Genz Gaane',
    songList: genzSongs,
    baseUrl: GENZ_URL,
    heroTitle: 'Gen Z<br>गाने',
    heroSub: 'नई पीढ़ी के हिट्स — हर दिन नया ट्रेंड!'
  },
  neendi: {
    id: 'neendi',
    name: 'Neendi Time',
    songList: neendiSongs,
    baseUrl: NEENDI_URL,
    heroTitle: 'नींदी<br>टाइम',
    heroSub: 'सुकून भरी रातें, मीठे सपने — आराम की लोरी।'
  },
  shadi: {
    id: 'shadi',
    name: 'Shadi Samaroh',
    songList: shadiSongs,
    baseUrl: SHADI_URL,
    heroTitle: 'शादी<br>समारोह',
    heroSub: 'बैंड, बाजा, बारात — हर शादी का जश्न इन्हीं गानों से!'
  },
  kk: {
    id: 'kk',
    name: 'The Great KK',
    songList: kkSongs,
    baseUrl: KK_URL,
    heroTitle: 'THE GREAT<br>KK',
    heroSub: 'KK के सबसे बेहतरीन गाने — एक शानदार श्रद्धांजलि।'
  }
};

const state = {
  index: -1,
  queue: [],       // shuffled permutation of song indices for the current channel
  queuePos: -1,    // pointer into state.queue — this IS the play history
  shuffle: true, // Always on
  repeat: false,
  channel: localStorage.getItem(CHANNEL_KEY) || 'papa'
};

const clean = s => s.replace(/\.mp3$/i, "");
const artistOf = title => {
  const i = title.indexOf(" - ");
  return i > -1 ? title.slice(0, i) : "Unknown artist";
};
const nameOf = title => {
  const i = title.indexOf(" - ");
  return i > -1 ? title.slice(i + 3) : title;
};
const fmt = seconds => {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60), s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2,"0")}`;
};

// URL construction — matches the exact encoding pattern used across every
// supplied R2 link (spaces become %20; & , ( ) + are left as literal
// characters, same as encodeURIComponent leaves ' outside the escape set)
const urlFor = (filename, channelId) => {
  const channel = CHANNELS[channelId || state.channel];
  const base = channel.baseUrl || '';

  const encoded = encodeURIComponent(filename)
    .replace(/%2C/g, ',')
    .replace(/%26/g, '&')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2B/g, '+');

  return base + encoded;
};

function savePrefs(){
  localStorage.setItem(CHANNEL_KEY, state.channel);
}
function notify(msg){
  toast.textContent = msg; toast.classList.add("show");
  clearTimeout(notify.t); notify.t = setTimeout(()=>toast.classList.remove("show"),2200);
}

function getCurrentSongs() {
  return CHANNELS[state.channel].songList || [];
}

// Proper shuffle: build one shuffled permutation of every song index (a
// "bag"), walk through it front-to-back so every song plays exactly once,
// then build a fresh permutation when the bag is exhausted. state.queuePos
// doubles as real play history, so Previous always returns to the actual
// song that played before — not an arithmetic neighbour in the raw list.
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildShuffleQueue(avoidIndex) {
  const currentSongs = getCurrentSongs();
  const queue = shuffleArray(currentSongs.map((_, i) => i));
  // avoid an immediate repeat of the last-played song when a new bag starts
  if (avoidIndex != null && queue.length > 1 && queue[0] === avoidIndex) {
    const swapWith = 1 + Math.floor(Math.random() * (queue.length - 1));
    [queue[0], queue[swapWith]] = [queue[swapWith], queue[0]];
  }
  return queue;
}
// Jump to an explicit song (e.g. picked from the playlist popup) without
// breaking shuffle history: the picked song is spliced in right after the
// current position, so Previous still leads back to whatever was playing,
// and Next continues the same shuffle bag afterward.
function jumpToIndex(index, autoplay = true) {
  const currentSongs = getCurrentSongs();
  if (index < 0 || index >= currentSongs.length) return;
  if (!state.queue.length) state.queue = buildShuffleQueue();
  const existingPos = state.queue.indexOf(index);
  if (existingPos > -1) state.queue.splice(existingPos, 1);
  const insertPos = state.queuePos + 1;
  state.queue.splice(insertPos, 0, index);
  state.queuePos = insertPos;
  loadSong(index, autoplay);
}

function renderPopup() {
  const currentSongs = getCurrentSongs();
  if(!currentSongs.length) {
    popupList.innerHTML = `<div style="padding:30px;color:#847a70;font-size:12px;text-align:center;">🎵 No songs in this channel</div>`;
    popupCount.textContent = '0';
    return;
  }
  popupCount.textContent = currentSongs.length;
  popupList.innerHTML = "";
  currentSongs.forEach((title, index) => {
    const row = document.createElement("div");
    row.className = "popup-song" + (index===state.index ? " active" : "");
    row.innerHTML = `
      <div class="popup-song-num">${index===state.index && !audio.paused ? "♫" : index+1}</div>
      <div class="popup-song-info">
        <div class="popup-song-title">${escapeHtml(nameOf(title))}</div>
        <div class="popup-song-artist">${escapeHtml(artistOf(title))}</div>
      </div>`;
    row.addEventListener("click", () => {
      jumpToIndex(index, true);
      closePlaylistPopup();
    });
    popupList.appendChild(row);
  });
}

function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

async function loadSong(index, autoplay=false){
  const currentSongs = getCurrentSongs();
  if(index<0 || index>=currentSongs.length) return;
  state.index=index;
  const title=currentSongs[index];
  nowTitle.textContent=nameOf(title);
  nowArtist.textContent=artistOf(title);
  cover.querySelector("span").textContent = "♫";
  
  const fullUrl = urlFor(title, state.channel);
  console.log("Loading song URL:", fullUrl);
  
  audio.src = fullUrl;
  audio.load();
  errorPanel.hidden=true;
  renderPopup();
  if(autoplay){
    try { await audio.play(); }
    catch(err){ showPlaybackError(err); }
  }
}
function showPlaybackError(err){
  errorPanel.hidden=false;
  const blocked = err && (err.name==="NotAllowedError" || err.name==="AbortError");
  errorText.textContent = blocked
    ? "Browser blocked automatic playback. Press Play again after interacting with the page."
    : "The MP3 URL may be unavailable, blocked by the host, or not reachable right now.";
  playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
}
function togglePlay(){
  const currentSongs = getCurrentSongs();
  if(state.index<0 || state.index>=currentSongs.length){
    if(!currentSongs.length) return;
    if(!state.queue.length) state.queue = buildShuffleQueue();
    state.queuePos = 0;
    loadSong(state.queue[state.queuePos], true);
    return;
  }
  if(audio.paused) audio.play().catch(showPlaybackError);
  else audio.pause();
}
function next(autoplay=false){
  const currentSongs = getCurrentSongs();
  if(!currentSongs.length) return;
  if(!state.queue.length) state.queue = buildShuffleQueue();
  if(state.queuePos >= state.queue.length - 1){
    // bag exhausted — every song has played once, start a fresh shuffle
    state.queue = buildShuffleQueue(state.queue[state.queuePos]);
    state.queuePos = -1;
  }
  state.queuePos++;
  loadSong(state.queue[state.queuePos], autoplay);
}
function previous(autoplay=false){
  const currentSongs = getCurrentSongs();
  if(!currentSongs.length) return;
  if(audio.currentTime>4){audio.currentTime=0;return;}
  if(state.queuePos > 0){
    state.queuePos--;
    loadSong(state.queue[state.queuePos], autoplay);
  } else {
    // already at the start of this shuffle bag — nothing earlier to return to
    audio.currentTime = 0;
  }
}
function syncPlayer(){
  const isPaused = audio.paused;
  playBtn.innerHTML = isPaused 
    ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`
    : `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
  miniPlayer.classList.toggle("is-playing", !isPaused);
  seek.value=audio.duration?((audio.currentTime/audio.duration)*100):0;
  currentTime.textContent=fmt(audio.currentTime);
  duration.textContent=fmt(audio.duration);
  if(state.index>=0) { renderPopup(); }
}
function toggleMute(){
  audio.muted=!audio.muted;
  volumeIcon.textContent=audio.muted?"◌":"◖";
  muteBtn.innerHTML = audio.muted
    ? `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/><path d="M16 7c2 2 2 6 0 8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19 4c4 4 4 12 0 16" stroke="currentColor" stroke-width="2" fill="none"/></svg>`
    : `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/><path d="M16 7c2 2 2 6 0 8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19 4c4 4 4 12 0 16" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
}
function escapeKey(e){
  if(["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) return;
  if(e.code==="Space"){e.preventDefault();togglePlay()}
  if(e.code==="ArrowRight") audio.currentTime=Math.min(audio.duration||0,audio.currentTime+5);
  if(e.code==="ArrowLeft") audio.currentTime=Math.max(0,audio.currentTime-5);
  if(e.code==="ArrowUp"){e.preventDefault();volumeRange.value=Math.min(1,+volumeRange.value+.05);audio.volume=+volumeRange.value}
  if(e.code==="ArrowDown"){e.preventDefault();volumeRange.value=Math.max(0,+volumeRange.value-.05);audio.volume=+volumeRange.value}
}

// Playlist Popup
function openPlaylistPopup() {
  renderPopup();
  playlistPopup.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closePlaylistPopup() {
  playlistPopup.hidden = true;
  document.body.style.overflow = '';
}

// Channel switching
function switchChannel(channelId) {
  if(channelId === state.channel) return;
  state.channel = channelId;
  state.index = -1;
  
  const channel = CHANNELS[channelId];
  currentChannelName.textContent = channel.name;
  queueTitle.textContent = channel.name;
  heroTitle.innerHTML = channel.heroTitle || 'पापा के<br>ज़माने के गाने';
  heroSub.textContent = channel.heroSub || 'पुराने गीत, वही एहसास — एक सुकून भरी शाम के लिए।';
  
  document.querySelectorAll('.channel-item').forEach(el => {
    el.classList.toggle('active', el.dataset.channel === channelId);
  });
  
  channelMenu.classList.remove('open');
  channelBtn.parentElement.classList.remove('open');
  
  savePrefs();
  renderPopup();
  
  state.queue = buildShuffleQueue();
  state.queuePos = 0;
  if(state.queue.length > 0){
    loadSong(state.queue[state.queuePos], true);
  }
  
  notify(`📻 Switched to ${channel.name}`);
}

document.getElementById("nextBtn").onclick=()=>next(true);
document.getElementById("prevBtn").onclick=()=>previous(true);
playBtn.onclick=togglePlay;
document.getElementById("retryBtn").onclick=()=>loadSong(state.index,false);
volumeRange.oninput=()=>{audio.volume=+volumeRange.value;audio.muted=audio.volume===0};
volumeIcon.onclick=toggleMute;
muteBtn.onclick=toggleMute;
seek.oninput=()=>{if(audio.duration)audio.currentTime=(+seek.value/100)*audio.duration};
document.getElementById("supportBtn").onclick=()=>notify("☕ Support us — add your own payment link in app.js.");
const channelFooterCta = document.getElementById("channelFooterCta");
if(channelFooterCta){
  channelFooterCta.onclick = (e) => {
    e.stopPropagation();
    notify("☕ Support us — add your own payment link in app.js.");
  };
}
document.getElementById("fullscreenBtn").onclick=async()=>{
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }catch{notify("Fullscreen is not available in this browser")}
};

// Playlist popup events — clicking the mini player opens the playlist;
// clicks on the actual transport controls or seek bar are excluded so
// play/pause/skip/seek still work without popping the playlist open.
miniPlayer.addEventListener('click', (e) => {
  if(e.target.closest('.mini-controls') || e.target.closest('#seek')) return;
  openPlaylistPopup();
});
playlistPopupClose.onclick = (e) => { e.stopPropagation(); closePlaylistPopup(); };
document.addEventListener('click', (e) => {
  if(!playlistPopup.hidden && !playlistPopup.contains(e.target) && !miniPlayer.contains(e.target)) {
    closePlaylistPopup();
  }
});

// Channel dropdown events
channelBtn.onclick = (e) => {
  e.stopPropagation();
  channelMenu.classList.toggle('open');
  channelBtn.parentElement.classList.toggle('open');
};
document.querySelectorAll('.channel-item').forEach(el => {
  el.onclick = () => switchChannel(el.dataset.channel);
});
document.addEventListener('click', (e) => {
  if(!channelMenu.contains(e.target) && e.target !== channelBtn) {
    channelMenu.classList.remove('open');
    channelBtn.parentElement.classList.remove('open');
  }
});

audio.addEventListener("play",syncPlayer);
audio.addEventListener("pause",syncPlayer);
audio.addEventListener("timeupdate",syncPlayer);
audio.addEventListener("loadedmetadata",syncPlayer);
audio.addEventListener("error",(e) => {
  console.error("Audio error:", e);
  showPlaybackError();
});
audio.addEventListener("ended",()=>{ if(state.repeat) loadSong(state.index,true); else next(true); });
window.addEventListener("keydown",escapeKey);

function tickClock(){
  document.getElementById("clock").textContent=new Intl.DateTimeFormat([], {hour:"numeric",minute:"2-digit"}).format(new Date());
}
tickClock(); setInterval(tickClock,30000);
audio.volume=0.85;

// Initialize channel
const initialChannel = state.channel;
const channel = CHANNELS[initialChannel];
if(channel) {
  currentChannelName.textContent = channel.name;
  queueTitle.textContent = channel.name;
  heroTitle.innerHTML = channel.heroTitle || 'पापा के<br>ज़माने के गाने';
  heroSub.textContent = channel.heroSub || 'पुराने गीत, वही एहसास — एक सुकून भरी शाम के लिए।';
  document.querySelectorAll('.channel-item').forEach(el => {
    el.classList.toggle('active', el.dataset.channel === initialChannel);
  });
}

renderPopup();

// Load a random-but-shuffle-consistent first song on load (user must press play)
state.queue = buildShuffleQueue();
state.queuePos = 0;
if(state.queue.length > 0){
  loadSong(state.queue[state.queuePos], false);
}
