// DOM Elements
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-button');
const themeToggle = document.querySelector('.theme-toggle');
const playerContainer = document.getElementById('player-container');
const playButton = document.getElementById('play-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const nowPlayingCover = document.getElementById('now-playing-cover');
const nowPlayingTitle = document.getElementById('now-playing-title');
const nowPlayingArtist = document.getElementById('now-playing-artist');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const allSongsList = document.getElementById('all-songs');
const playlistsList = document.getElementById('playlists-list');
const playlistDetailView = document.getElementById('playlist-detail-view');
const playlistsView = document.getElementById('playlists-view');
const backToPlaylists = document.getElementById('back-to-playlists');
const playlistSongsList = document.getElementById('playlist-songs-list');
const detailPlaylistName = document.getElementById('detail-playlist-name');
const totalSongsEl = document.getElementById('total-songs');
const totalPlaylistsEl = document.getElementById('total-playlists');

// App State
let currentSongIndex = 0;
let isPlaying = false;
let songs = [];
let playlists = [];
let audio = new Audio();
let isFirstPlay = true;

// Initialize the app
async function init() {
    // Force dark mode by default
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeToggle.querySelector('i').classList.add('fa-moon');
    
    // Load songs from collection.json
    await loadSongs();
    
    // Initialize player
    initPlayer();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize search
    initSearch();
    
    // Initialize playlists
    initPlaylists();
    
    // Update UI
    updateUI();
}

// Load songs from collection.json
async function loadSongs() {
    try {
        const response = await fetch('collection.json');
        const data = await response.json();
        songs = data.songs;
        totalSongsEl.textContent = songs.length;
        
        // Render all songs
        renderAllSongs();
    } catch (error) {
        console.error('Error loading songs:', error);
        showError('Failed to load songs. Please try again later.');
    }
}

// Show error message
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
    `;
    document.body.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

// Render all songs in the home page
function renderAllSongs() {
    allSongsList.innerHTML = '';
    
    if (songs.length === 0) {
        allSongsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <p>No songs available</p>
            </div>
        `;
        return;
    }
    
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.dataset.index = index;
        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.name}" class="song-cover" onerror="this.src='https://via.placeholder.com/50'">
            <div class="song-details">
                <p class="song-name">${song.name}</p>
                <p class="song-artist">${song.artist}</p>
            </div>
            <button class="play-button song-play-button ${index === currentSongIndex && isPlaying ? 'playing' : ''}">
                <i class="fas ${index === currentSongIndex && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
            </button>
        `;
        allSongsList.appendChild(songItem);
    });
    
    // Add event listeners to song play buttons
    document.querySelectorAll('.song-play-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const songItem = this.closest('.song-item');
            const index = parseInt(songItem.dataset.index);
            
            if (index === currentSongIndex) {
                togglePlay();
            } else {
                playSong(index);
            }
        });
    });
    
    // Add event listeners to song items
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            playSong(index);
        });
    });
}

// Initialize player with better error handling
function initPlayer() {
    // Play/Pause button
    playButton.addEventListener('click', togglePlay);
    
    // Previous button
    prevButton.addEventListener('click', prevSong);
    
    // Next button
    nextButton.addEventListener('click', nextSong);
    
    // Progress bar click
    progressBar.addEventListener('click', setProgress);
    
    // Time update
    audio.addEventListener('timeupdate', updateProgress);
    
    // Song ended
    audio.addEventListener('ended', nextSong);
    
    // Player visibility based on song loaded
    audio.addEventListener('loadedmetadata', () => {
        playerContainer.style.display = 'flex';
    });
    
    // Error handling
    audio.addEventListener('error', handleAudioError);
    
    // Play/pause events
    audio.addEventListener('play', () => {
        isPlaying = true;
        updatePlayButton();
        highlightCurrentSong();
    });
    
    audio.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayButton();
        highlightCurrentSong();
    });
}

// Handle audio errors
function handleAudioError() {
    console.error('Audio error:', audio.error);
    showError('Error playing song. Skipping to next track...');
    nextSong();
}

// Load song with error handling
function loadSong(index) {
    if (songs.length === 0) return;
    
    try {
        currentSongIndex = index;
        const song = songs[index];
        
        // Reset audio element
        audio.src = '';
        audio.load();
        
        // Set new source
        audio.src = song.link;
        nowPlayingCover.src = song.cover;
        nowPlayingTitle.textContent = song.name;
        nowPlayingArtist.textContent = song.artist;
        
        // Preload the audio
        audio.preload = 'auto';
        
        // Show loading state
        playerContainer.style.display = 'flex';
        nowPlayingTitle.textContent = 'Loading...';
        nowPlayingArtist.textContent = song.name;
        
        // When enough data is loaded to start playing
        audio.addEventListener('canplay', function onCanPlay() {
            audio.removeEventListener('canplay', onCanPlay);
            
            if (isFirstPlay) {
                isFirstPlay = false;
            } else {
                audio.play().catch(error => {
                    console.error('Playback error:', error);
                    handleAudioError();
                });
            }
        }, { once: true });
        
        // Highlight currently playing song in lists
        highlightCurrentSong();
        
    } catch (error) {
        console.error('Error loading song:', error);
        handleAudioError();
    }
}

// Play song with error handling
function playSong(index) {
    if (index !== currentSongIndex) {
        loadSong(index);
    } else {
        audio.play().catch(error => {
            console.error('Error playing song:', error);
            handleAudioError();
        });
    }
}

// Rest of the player functions remain the same (togglePlay, prevSong, nextSong, etc.)
// ... [previous code for togglePlay, prevSong, nextSong, updateProgress, etc.]

// Initialize playlists without localStorage
function initPlaylists() {
    // Default playlists (removed localStorage dependency)
    playlists = [
        {
            id: 1,
            name: 'Just Feel',
            cover: 'https://mosaic.scdn.co/640/ab67616d00001e024c375a25c4afc9c754061da6ab67616d00001e0275a0429b40af0e83780b58e3ab67616d00001e02f332a3bc2f19abf7de632042ab67616d00001e02fc8c4535825cdc0bcafde19a',
            songs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
        },
        {
            id: 2,
            name: 'Spritual',
            cover: 'https://mosaic.scdn.co/640/ab67616d00001e021592fefed668233b3d38fa0eab67616d00001e023874cc361eca103f5dd69286ab67616d00001e02759b1cd31a392ad7a5fb1e9aab67616d00001e02790d4c884ca491d8562156a2',
            songs: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
        }
    ];
    
    totalPlaylistsEl.textContent = playlists.length;
    renderPlaylists();
    
    // Back to playlists button
    backToPlaylists.addEventListener('click', function() {
        playlistDetailView.style.display = 'none';
        playlistsView.style.display = 'block';
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
