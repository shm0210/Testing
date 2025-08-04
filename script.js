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
    // Set default theme
    setDefaultTheme();
    
    // Show loading state
    showLoadingState();
    
    try {
        // Load songs and playlists in parallel
        await Promise.all([
            loadSongs(),
            initPlaylists()
        ]);
        
        // Initialize player and other components
        initPlayer();
        initNavigation();
        initThemeToggle();
        initSearch();
        
        // Update UI
        updateUI();
    } catch (error) {
        console.error('Initialization error:', error);
        showErrorState();
    } finally {
        // Hide loading state
        hideLoadingState();
    }
}

// Show loading state
function showLoadingState() {
    allSongsList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading songs...</p>
        </div>
    `;
}

// Hide loading state
function hideLoadingState() {
    // This will be handled by renderAllSongs()
}

// Show error state
function showErrorState() {
    allSongsList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load songs. Please try again later.</p>
        </div>
    `;
}

// Set default theme
function setDefaultTheme() {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeToggle.querySelector('i').classList.add('fa-moon');
}

// Load songs from collection.json with caching
async function loadSongs() {
    try {
        // Check cache first
        const cachedSongs = localStorage.getItem('cachedSongs');
        const cachedTimestamp = localStorage.getItem('cachedSongsTimestamp');
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // Use cached data if it's less than a day old
        if (cachedSongs && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp)) < oneDay) {
            songs = JSON.parse(cachedSongs);
        } else {
            // Fetch fresh data
            const response = await fetch('collection.json');
            if (!response.ok) throw new Error('Failed to fetch songs');
            
            const data = await response.json();
            songs = data.songs;
            
            // Cache the data
            localStorage.setItem('cachedSongs', JSON.stringify(songs));
            localStorage.setItem('cachedSongsTimestamp', Date.now().toString());
        }
        
        totalSongsEl.textContent = songs.length;
        renderAllSongs();
    } catch (error) {
        console.error('Error loading songs:', error);
        throw error; // Re-throw to be caught in init()
    }
}

// Render all songs in the home page
function renderAllSongs() {
    if (!allSongsList) return;
    
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
    
    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.dataset.index = index;
        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.name}" class="song-cover" loading="lazy">
            <div class="song-details">
                <p class="song-name">${song.name}</p>
                <p class="song-artist">${song.artist}</p>
            </div>
            <button class="play-button song-play-button ${index === currentSongIndex && isPlaying ? 'playing' : ''}">
                <i class="fas ${index === currentSongIndex && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
            </button>
        `;
        fragment.appendChild(songItem);
    });
    
    allSongsList.appendChild(fragment);
    
    // Add event listeners
    setupSongEventListeners();
}

// Setup event listeners for songs
function setupSongEventListeners() {
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

// Initialize player
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
    
    // Error handling
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        // Skip to next song if current one fails
        setTimeout(nextSong, 1000);
    });
}

// Load song with error handling
function loadSong(index) {
    if (!songs.length || index < 0 || index >= songs.length) return;
    
    try {
        currentSongIndex = index;
        const song = songs[index];
        
        // Preload cover image
        const img = new Image();
        img.src = song.cover;
        
        audio.src = song.link;
        nowPlayingCover.src = song.cover;
        nowPlayingTitle.textContent = song.name;
        nowPlayingArtist.textContent = song.artist;
        
        if (isFirstPlay) {
            isFirstPlay = false;
        } else {
            audio.play().catch(error => {
                console.error('Error playing song:', error);
                // Try next song if this one fails
                setTimeout(nextSong, 1000);
            });
        }
        
        highlightCurrentSong();
    } catch (error) {
        console.error('Error loading song:', error);
        // Skip to next song if current one fails
        setTimeout(nextSong, 1000);
    }
}

// Play song
function playSong(index) {
    if (index !== currentSongIndex) {
        loadSong(index);
    } else {
        audio.play().catch(error => {
            console.error('Error playing song:', error);
        });
    }
}

// Toggle play/pause
function togglePlay() {
    if (!songs.length) return;
    
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play().catch(error => {
            console.error('Error playing song:', error);
        });
    }
}

// Update play button icon
function updatePlayButton() {
    const icon = playButton.querySelector('i');
    if (isPlaying) {
        playButton.classList.add('playing');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        playButton.classList.remove('playing');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
    
    // Update all song play buttons
    document.querySelectorAll('.song-play-button').forEach(button => {
        const songItem = button.closest('.song-item');
        const index = parseInt(songItem.dataset.index);
        
        if (index === currentSongIndex) {
            button.classList.toggle('playing', isPlaying);
            const btnIcon = button.querySelector('i');
            if (isPlaying) {
                btnIcon.classList.remove('fa-play');
                btnIcon.classList.add('fa-pause');
            } else {
                btnIcon.classList.remove('fa-pause');
                btnIcon.classList.add('fa-play');
            }
        } else {
            button.classList.remove('playing');
            const btnIcon = button.querySelector('i');
            btnIcon.classList.remove('fa-pause');
            btnIcon.classList.add('fa-play');
        }
    });
}

// Previous song
function prevSong() {
    if (!songs.length) return;
    
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
}

// Next song
function nextSong() {
    if (!songs.length) return;
    
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
}

// Update progress bar
function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time displays
    currentTimeEl.textContent = formatTime(currentTime);
    
    // Only update duration if it's a valid number
    if (!isNaN(duration)) {
        durationEl.textContent = formatTime(duration);
    }
}

// Set progress bar on click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Highlight current song in lists
function highlightCurrentSong() {
    // Remove all active classes first
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current song
    const currentSongItems = document.querySelectorAll(`.song-item[data-index="${currentSongIndex}"]`);
    currentSongItems.forEach(item => {
        item.classList.add('active');
    });
    
    // Update play buttons
    updatePlayButton();
}

// Initialize navigation
function initNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pageId = this.dataset.page;
            showPage(pageId);
            
            // Update active state of nav buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Show page
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(pageId).classList.add('active');
}

// Initialize theme toggle
function initThemeToggle() {
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
}

// Initialize search
function initSearch() {
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Perform search
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (query === '') {
        searchResults.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>Search for songs, artists or albums</p>
            </div>
        `;
        return;
    }
    
    const results = songs.filter(song => 
        song.name.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        (song.album && song.album.toLowerCase().includes(query))
    );
    
    renderSearchResults(results);
}

// Render search results
function renderSearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-times-circle"></i>
                <p>No results found</p>
            </div>
        `;
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    results.forEach((song, index) => {
        const songIndex = songs.findIndex(s => s.id === song.id);
        const songItem = document.createElement('div');
        songItem.className = `song-item ${songIndex === currentSongIndex ? 'active' : ''}`;
        songItem.dataset.index = songIndex;
        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.name}" class="song-cover" loading="lazy">
            <div class="song-details">
                <p class="song-name">${song.name}</p>
                <p class="song-artist">${song.artist}</p>
                ${song.album ? `<p class="song-album">${song.album}</p>` : ''}
            </div>
            <button class="play-button song-play-button ${songIndex === currentSongIndex && isPlaying ? 'playing' : ''}">
                <i class="fas ${songIndex === currentSongIndex && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
            </button>
        `;
        fragment.appendChild(songItem);
    });
    
    searchResults.appendChild(fragment);
    
    // Add event listeners
    setupSongEventListeners();
}

// Initialize playlists
function initPlaylists() {
    return new Promise((resolve) => {
        // Load playlists from localStorage
        const savedPlaylists = localStorage.getItem('playlists');
        if (savedPlaylists) {
            playlists = JSON.parse(savedPlaylists);
        } else {
            // Default playlists
            playlists = [
                {
                    id: 1,
                    name: 'Just Feel',
                    cover: 'https://mosaic.scdn.co/640/ab67616d00001e024c375a25c4afc9c754061da6ab67616d00001e0275a0429b40af0e83780b58e3ab67616d00001e02f332a3bc2f19abf7de632042ab67616d00001e02fc8c4535825cdc0bcafde19a',
                    songs: [43, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
                },
                {
                    id: 2,
                    name: 'Spritual',
                    cover: 'https://mosaic.scdn.co/640/ab67616d00001e021592fefed668233b3d38fa0eab67616d00001e023874cc361eca103f5dd69286ab67616d00001e02759b1cd31a392ad7a5fb1e9aab67616d00001e02790d4c884ca491d8562156a2',
                    songs: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
                },
                {
                    id: 3,
                    name: 'Favourite',
                    cover: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84a97f2ce0d5468e95baebfa01',
                    songs: [1, 21, 22, 23, 24, 41, 42]
                }
            ];
            savePlaylists();
        }
        
        totalPlaylistsEl.textContent = playlists.length;
        renderPlaylists();
        
        // Back to playlists button
        backToPlaylists.addEventListener('click', function() {
            playlistDetailView.style.display = 'none';
            playlistsView.style.display = 'block';
        });
        
        resolve();
    });
}

// Save playlists to localStorage
function savePlaylists() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

// Render playlists
function renderPlaylists() {
    playlistsList.innerHTML = '';
    
    if (playlists.length === 0) {
        playlistsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <p>No playlists yet</p>
            </div>
        `;
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    playlists.forEach(playlist => {
        const playlistCard = document.createElement('div');
        playlistCard.className = 'playlist-card';
        playlistCard.dataset.id = playlist.id;
        playlistCard.innerHTML = `
            <img src="${playlist.cover}" alt="${playlist.name}" class="playlist-cover" loading="lazy">
            <div class="playlist-info">
                <p class="playlist-name">${playlist.name}</p>
                <p class="playlist-song-count">${playlist.songs.length} songs</p>
            </div>
            <button class="play-button play-button-large playlist-play-button">
                <i class="fas fa-play"></i>
            </button>
        `;
        fragment.appendChild(playlistCard);
    });
    
    playlistsList.appendChild(fragment);
    
    // Add event listeners to playlist cards
    document.querySelectorAll('.playlist-card').forEach(card => {
        card.addEventListener('click', function() {
            const playlistId = parseInt(this.dataset.id);
            showPlaylistDetail(playlistId);
        });
    });
    
    // Add event listeners to playlist play buttons
    document.querySelectorAll('.playlist-play-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const playlistCard = this.closest('.playlist-card');
            const playlistId = parseInt(playlistCard.dataset.id);
            playPlaylist(playlistId);
        });
    });
}

// Show playlist detail
function showPlaylistDetail(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    detailPlaylistName.textContent = playlist.name;
    playlistSongsList.innerHTML = '';
    
    if (playlist.songs.length === 0) {
        playlistSongsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <p>No songs in this playlist</p>
            </div>
        `;
    } else {
        const fragment = document.createDocumentFragment();
        
        playlist.songs.forEach(songId => {
            const song = songs.find(s => s.id === songId);
            if (song) {
                const songIndex = songs.findIndex(s => s.id === songId);
                const songItem = document.createElement('div');
                songItem.className = `song-item ${songIndex === currentSongIndex ? 'active' : ''}`;
                songItem.dataset.index = songIndex;
                songItem.innerHTML = `
                    <img src="${song.cover}" alt="${song.name}" class="song-cover" loading="lazy">
                    <div class="song-details">
                        <p class="song-name">${song.name}</p>
                        <p class="song-artist">${song.artist}</p>
                    </div>
                    <button class="play-button song-play-button ${songIndex === currentSongIndex && isPlaying ? 'playing' : ''}">
                        <i class="fas ${songIndex === currentSongIndex && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                `;
                fragment.appendChild(songItem);
            }
        });
        
        playlistSongsList.appendChild(fragment);
        
        // Add event listeners
        setupSongEventListeners();
    }
    
    playlistsView.style.display = 'none';
    playlistDetailView.style.display = 'block';
}

// Play playlist
function playPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || playlist.songs.length === 0) return;
    
    // Find the first song in the playlist
    const firstSongId = playlist.songs[0];
    const songIndex = songs.findIndex(s => s.id === firstSongId);
    
    if (songIndex !== -1) {
        playSong(songIndex);
    }
}

// Update UI
function updateUI() {
    // Force dark mode by default
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeToggle.querySelector('i').classList.add('fa-moon');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);