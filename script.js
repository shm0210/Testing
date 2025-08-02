// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const playButton = document.getElementById('play-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const progressBar = document.getElementById('progress-bar');
const currentTimeElement = document.getElementById('current-time');
const durationElement = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');
const nowPlayingTitle = document.getElementById('now-playing-title');
const nowPlayingArtist = document.getElementById('now-playing-artist');
const nowPlayingCover = document.getElementById('now-playing-cover');
const themeToggle = document.getElementById('theme-toggle');
const navButtons = document.querySelectorAll('.nav-button');
const pages = document.querySelectorAll('.page');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const allSongsContainer = document.getElementById('all-songs');
const playlistsContainer = document.getElementById('playlists');
const playlistSongsContainer = document.getElementById('playlist-songs');
const totalSongsElement = document.getElementById('total-songs');
const totalPlaylistsElement = document.getElementById('total-playlists');
const totalTimeElement = document.getElementById('total-time');
const shuffleAllButton = document.getElementById('shuffle-all');
const allSongsCountElement = document.getElementById('all-songs-count');
const favoritesCountElement = document.getElementById('favorites-count');

// App State
let songs = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentSongIndex = 0;
let isPlaying = false;
let currentPlaylist = null;
let currentPlaylistSongIndices = null;
let currentPlaylistCurrentIndex = 0;

// Initialize the app
async function init() {
    await loadSongs();
    renderAllSongs();
    setupPlaylistEvents();
    updatePlayerInfo();
    updateStats();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set initial volume
    audioPlayer.volume = volumeBar.value;
    
    // Load theme preference from localStorage
    loadThemePreference();
}

// Load songs from collection.json
async function loadSongs() {
    try {
        const response = await fetch('collection.json');
        const data = await response.json();
        songs = data.songs;
        
        // Update counts
        allSongsCountElement.textContent = `${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`;
        favoritesCountElement.textContent = `${favorites.length} ${favorites.length === 1 ? 'song' : 'songs'}`;
    } catch (error) {
        console.error('Error loading songs:', error);
        // Fallback data if collection.json fails to load
        songs = [
            {
                id: 1,
                title: "Aankhon Mein Doob Jaane Ko",
                artist: "THE 9TEEN",
                cover: "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.jpg",
                source: "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.mp3",
                duration: 180
            },
            {
                id: 2,
                title: "Sample Song 2",
                artist: "Artist 2",
                cover: "https://i.ibb.co/d0Lw85R6/Picsart-25-08-01-19-18-42-186.png",
                source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                duration: 210
            }
        ];
        
        allSongsCountElement.textContent = `${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`;
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Player controls
    playButton.addEventListener('click', togglePlay);
    prevButton.addEventListener('click', playPrevious);
    nextButton.addEventListener('click', playNext);
    
    // Progress bar
    progressBar.addEventListener('input', setProgress);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', playNext);
    
    // Volume control
    volumeBar.addEventListener('input', setVolume);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.getAttribute('data-page');
            navigateTo(pageId);
        });
    });
    
    // Search functionality
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    searchButton.addEventListener('click', performSearch);
    
    // Shuffle all button
    shuffleAllButton.addEventListener('click', shuffleAllSongs);
}

// Set up playlist events
function setupPlaylistEvents() {
    // All Songs playlist
    document.querySelector('.all-songs-playlist .play-all-button').addEventListener('click', () => {
        playAllSongs();
    });
    
    document.querySelector('.all-songs-playlist').addEventListener('click', () => {
        showAllSongsPlaylist();
    });
    
    // Favorites playlist
    document.querySelector('.favorites-playlist .play-all-button').addEventListener('click', () => {
        playFavorites();
    });
    
    document.querySelector('.favorites-playlist').addEventListener('click', () => {
        showFavoritesPlaylist();
    });
}

// Render all songs in the home page
function renderAllSongs() {
    allSongsContainer.innerHTML = '';
    
    songs.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'song-card';
        if (index === currentSongIndex && isPlaying) {
            songElement.classList.add('now-playing');
        }
        
        const isFavorite = favorites.includes(song.id);
        
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-actions">
                <button class="favorite-button" data-id="${song.id}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <button class="play-button" data-index="${index}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
        
        songElement.addEventListener('click', () => {
            playSong(index);
        });
        
        const favoriteButton = songElement.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(song.id, favoriteButton);
        });
        
        allSongsContainer.appendChild(songElement);
    });
}

// Toggle favorite status
function toggleFavorite(songId, button) {
    const icon = button.querySelector('i');
    const index = favorites.indexOf(songId);
    
    if (index === -1) {
        favorites.push(songId);
        icon.classList.remove('far');
        icon.classList.add('fas');
    } else {
        favorites.splice(index, 1);
        icon.classList.remove('fas');
        icon.classList.add('far');
    }
    
    // Update localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update favorites count
    favoritesCountElement.textContent = `${favorites.length} ${favorites.length === 1 ? 'song' : 'songs'}`;
}

// Play all songs
function playAllSongs() {
    if (songs.length === 0) return;
    
    const allSongIndices = [...Array(songs.length).keys()];
    playSong(0, allSongIndices);
}

// Play favorites
function playFavorites() {
    if (favorites.length === 0) return;
    
    const favoriteIndices = favorites.map(id => songs.findIndex(s => s.id === id));
    if (favoriteIndices.length > 0 && favoriteIndices[0] !== -1) {
        playSong(favoriteIndices[0], favoriteIndices);
    }
}

// Show all songs as playlist
function showAllSongsPlaylist() {
    currentPlaylist = {
        name: "All Songs",
        songs: songs.map(song => song.id)
    };
    
    // Hide playlists, show songs
    playlistsContainer.style.display = 'none';
    playlistSongsContainer.style.display = 'block';
    
    playlistSongsContainer.innerHTML = `
        <div class="playlist-header">
            <h3>All Songs</h3>
            <div class="playlist-actions">
                <button class="back-button" id="back-to-playlists">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <button class="action-button" id="play-playlist">
                    <i class="fas fa-play"></i> Play All
                </button>
            </div>
        </div>
        <div class="playlist-songs-list" id="playlist-songs-list"></div>
    `;
    
    const playlistSongsList = document.getElementById('playlist-songs-list');
    const backButton = document.getElementById('back-to-playlists');
    const playPlaylistButton = document.getElementById('play-playlist');
    
    backButton.addEventListener('click', () => {
        playlistsContainer.style.display = 'grid';
        playlistSongsContainer.style.display = 'none';
        currentPlaylist = null;
    });
    
    playPlaylistButton.addEventListener('click', () => {
        playAllSongs();
    });
    
    songs.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'song-card';
        if (index === currentSongIndex && isPlaying) {
            songElement.classList.add('now-playing');
        }
        
        const isFavorite = favorites.includes(song.id);
        
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-actions">
                <button class="favorite-button" data-id="${song.id}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <button class="play-button" data-index="${index}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
        
        songElement.addEventListener('click', () => {
            playSong(index, [...Array(songs.length).keys()]);
        });
        
        const favoriteButton = songElement.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(song.id, favoriteButton);
        });
        
        playlistSongsList.appendChild(songElement);
    });
}

// Show favorites playlist
function showFavoritesPlaylist() {
    if (favorites.length === 0) return;
    
    currentPlaylist = {
        name: "Favorites",
        songs: [...favorites]
    };
    
    // Hide playlists, show songs
    playlistsContainer.style.display = 'none';
    playlistSongsContainer.style.display = 'block';
    
    playlistSongsContainer.innerHTML = `
        <div class="playlist-header">
            <h3>Favorites</h3>
            <div class="playlist-actions">
                <button class="back-button" id="back-to-playlists">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <button class="action-button" id="play-playlist">
                    <i class="fas fa-play"></i> Play All
                </button>
            </div>
        </div>
        <div class="playlist-songs-list" id="playlist-songs-list"></div>
    `;
    
    const playlistSongsList = document.getElementById('playlist-songs-list');
    const backButton = document.getElementById('back-to-playlists');
    const playPlaylistButton = document.getElementById('play-playlist');
    
    backButton.addEventListener('click', () => {
        playlistsContainer.style.display = 'grid';
        playlistSongsContainer.style.display = 'none';
        currentPlaylist = null;
    });
    
    playPlaylistButton.addEventListener('click', () => {
        playFavorites();
    });
    
    favorites.forEach(songId => {
        const songIndex = songs.findIndex(s => s.id === songId);
        if (songIndex !== -1) {
            const song = songs[songIndex];
            const songElement = document.createElement('div');
            songElement.className = 'song-card';
            if (songIndex === currentSongIndex && isPlaying) {
                songElement.classList.add('now-playing');
            }
            
            songElement.innerHTML = `
                <img src="${song.cover}" alt="${song.title}" class="song-cover">
                <div class="song-details">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-actions">
                    <button class="favorite-button" data-id="${song.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="play-button" data-index="${songIndex}">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            `;
            
            songElement.addEventListener('click', () => {
                playSong(songIndex, favorites.map(id => songs.findIndex(s => s.id === id)));
            });
            
            const favoriteButton = songElement.querySelector('.favorite-button');
            favoriteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(song.id, favoriteButton);
                // Remove from DOM if in favorites playlist
                if (currentPlaylist && currentPlaylist.name === "Favorites") {
                    songElement.remove();
                }
            });
            
            playlistSongsList.appendChild(songElement);
        }
    });
}

// Perform search
function performSearch() {
    const query = searchInput.value.toLowerCase();
    if (!query) {
        searchResults.innerHTML = '<p>Enter a search term</p>';
        return;
    }
    
    const results = songs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p>No results found</p>';
        return;
    }
    
    searchResults.innerHTML = '';
    results.forEach((song, index) => {
        const songIndex = songs.findIndex(s => s.id === song.id);
        const songElement = document.createElement('div');
        songElement.className = 'song-card';
        if (songIndex === currentSongIndex && isPlaying) {
            songElement.classList.add('now-playing');
        }
        
        const isFavorite = favorites.includes(song.id);
        
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-actions">
                <button class="favorite-button" data-id="${song.id}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <button class="play-button" data-index="${songIndex}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
        
        songElement.addEventListener('click', () => {
            playSong(songIndex);
        });
        
        const favoriteButton = songElement.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(song.id, favoriteButton);
        });
        
        searchResults.appendChild(songElement);
    });
}

// Shuffle all songs
function shuffleAllSongs() {
    if (songs.length === 0) return;
    
    // Create array of indices and shuffle it
    const shuffledIndices = [...Array(songs.length).keys()];
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    
    // Play first song from shuffled list
    playSong(shuffledIndices[0], shuffledIndices);
}

// Play a song with improved now-playing indicator
function playSong(index, playlistSongIndices = null) {
    if (index < 0 || index >= songs.length) return;
    
    currentSongIndex = index;
    const song = songs[currentSongIndex];
    
    audioPlayer.src = song.source;
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            updatePlayButton();
            updatePlayerInfo();
            
            // Update now-playing indicators
            updateNowPlayingIndicators();
            
            // If playing from a playlist, set the next songs to be from the playlist
            if (playlistSongIndices) {
                currentPlaylistSongIndices = playlistSongIndices;
                currentPlaylistCurrentIndex = playlistSongIndices.indexOf(index);
            } else {
                currentPlaylistSongIndices = null;
            }
        })
        .catch(error => {
            console.error('Error playing song:', error);
        });
}

// Update now-playing indicators on all song cards
function updateNowPlayingIndicators() {
    document.querySelectorAll('.song-card').forEach(card => {
        card.classList.remove('now-playing');
    });
    
    const currentCards = document.querySelectorAll(`.song-card button[data-index="${currentSongIndex}"]`);
    currentCards.forEach(button => {
        button.closest('.song-card').classList.add('now-playing');
    });
}

// Toggle play/pause
function togglePlay() {
    if (audioPlayer.src) {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        updatePlayButton();
        updateNowPlayingIndicators();
    } else if (songs.length > 0) {
        // If no song is selected, play the first one
        playSong(0);
    }
}

// Play previous song
function playPrevious() {
    if (currentPlaylistSongIndices) {
        // If in playlist mode
        currentPlaylistCurrentIndex = (currentPlaylistCurrentIndex - 1 + currentPlaylistSongIndices.length) % currentPlaylistSongIndices.length;
        playSong(currentPlaylistSongIndices[currentPlaylistCurrentIndex], currentPlaylistSongIndices);
    } else {
        // Normal mode
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex);
    }
}

// Play next song
function playNext() {
    if (currentPlaylistSongIndices) {
        // If in playlist mode
        currentPlaylistCurrentIndex = (currentPlaylistCurrentIndex + 1) % currentPlaylistSongIndices.length;
        playSong(currentPlaylistSongIndices[currentPlaylistCurrentIndex], currentPlaylistSongIndices);
    } else {
        // Normal mode
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(currentSongIndex);
    }
}

// Update progress bar
function updateProgress() {
    const { currentTime, duration } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;
    
    // Update time display
    currentTimeElement.textContent = formatTime(currentTime);
    if (duration) {
        durationElement.textContent = formatTime(duration);
    }
}

// Set progress bar
function setProgress() {
    const progress = progressBar.value;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (progress / 100) * duration;
}

// Set volume
function setVolume() {
    audioPlayer.volume = volumeBar.value;
}

// Update play button icon
function updatePlayButton() {
    const icon = playButton.querySelector('i');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

// Update player info (title, artist, cover)
function updatePlayerInfo() {
    if (songs.length === 0 || currentSongIndex === null) {
        nowPlayingTitle.textContent = 'No song selected';
        nowPlayingArtist.textContent = 'GEETORY';
        nowPlayingCover.src = 'https://i.ibb.co/d0Lw85R6/Picsart-25-08-01-19-18-42-186.png';
        return;
    }
    
    const song = songs[currentSongIndex];
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    nowPlayingCover.src = song.cover;
}

// Update stats (total songs, playlists, total time)
function updateStats() {
    totalSongsElement.textContent = songs.length;
    totalPlaylistsElement.textContent = 2; // All Songs and Favorites
    
    // Calculate total duration in hours
    const totalSeconds = songs.reduce((sum, song) => sum + (song.duration || 180), 0);
    const totalHours = Math.round(totalSeconds / 3600);
    totalTimeElement.textContent = totalHours;
}

// Toggle dark/light theme with localStorage
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
}

// Load theme preference from localStorage
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

// Navigate to a page
function navigateTo(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update active nav button
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-page') === pageId) {
            button.classList.add('active');
        }
    });
    
    // Clear search results when leaving search page
    if (pageId !== 'search-page') {
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
    
    // Reset playlist view if leaving playlist page
    if (pageId !== 'playlist-page' && currentPlaylist) {
        playlistsContainer.style.display = 'grid';
        playlistSongsContainer.style.display = 'none';
        currentPlaylist = null;
    }
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);