// Sample data structure - in a real app, this would come from collection.json
let songs = [];
let playlists = [
    {
        id: 1,
        name: "Favorites",
        cover: "https://via.placeholder.com/300",
        songs: [1, 2, 3]
    },
    {
        id: 2,
        name: "Workout Mix",
        cover: "https://via.placeholder.com/300",
        songs: [4, 5, 6]
    },
    {
        id: 3,
        name: "Chill Vibes",
        cover: "https://via.placeholder.com/300",
        songs: [7, 8, 9]
    }
];

// DOM Elements
const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const songsContainer = document.querySelector('.songs-container');
const searchInput = document.getElementById('search-input');
const searchResults = document.querySelector('.search-results');
const playlistsContainer = document.querySelector('.playlists-container');
const playlistSongsContainer = document.querySelector('.playlist-songs-container');
const playlistSongsList = document.querySelector('.playlist-songs-list');
const backButton = document.querySelector('.back-button');
const recentSongs = document.querySelector('.recent-songs');
const currentSongTitle = document.getElementById('current-song-title');
const currentSongArtist = document.getElementById('current-song-artist');
const currentSongCover = document.getElementById('current-song-cover');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const progressBar = document.querySelector('.progress-bar');

// Audio element
const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let recentlyPlayed = [];

// Load songs from collection.json
fetch('collection.json')
    .then(response => response.json())
    .then(data => {
        songs = data.songs;
        renderSongs(songs);
        renderPlaylists();
        // Set first song as default
        if (songs.length > 0) {
            loadSong(0);
        }
    })
    .catch(error => {
        console.error('Error loading songs:', error);
        // Fallback data if collection.json fails to load
        songs = [
            {
                id: 1,
                title: "Aankhon Mein Doob Jaane Ko",
                artist: "THE 9TEEN",
                cover: "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.jpg",
                source: "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.mp3"
            },
            {
                id: 2,
                title: "Sample Song 2",
                artist: "Artist 2",
                cover: "https://via.placeholder.com/300",
                source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            },
            {
                id: 3,
                title: "Sample Song 3",
                artist: "Artist 3",
                cover: "https://via.placeholder.com/300",
                source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            }
        ];
        renderSongs(songs);
        renderPlaylists();
        if (songs.length > 0) {
            loadSong(0);
        }
    });

// Navigation
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const pageName = item.getAttribute('data-page');
        showPage(pageName);
        
        // Update active menu item
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

function showPage(pageName) {
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.classList.contains(`${pageName}-page`)) {
            page.classList.add('active');
        }
    });
    
    // Hide playlist songs view when switching pages
    if (pageName !== 'playlists') {
        playlistsContainer.style.display = 'grid';
        playlistSongsContainer.style.display = 'none';
    }
}

// Render songs
function renderSongs(songsArray, container = songsContainer) {
    container.innerHTML = '';
    
    songsArray.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-details">
                <h4 class="song-name">${song.title}</h4>
                <p class="song-artist">${song.artist}</p>
            </div>
            <button class="song-play-btn" data-index="${index}">
                <i class="fas fa-play"></i>
            </button>
        `;
        container.appendChild(songElement);
        
        // Add click event to play song
        const playBtn = songElement.querySelector('.song-play-btn');
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            loadSong(index);
            playSong();
        });
        
        // Add click event to song item (play on click anywhere)
        songElement.addEventListener('click', () => {
            loadSong(index);
            playSong();
        });
    });
}

// Render playlists
function renderPlaylists() {
    playlistsContainer.innerHTML = '';
    
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist-card';
        playlistElement.innerHTML = `
            <img src="${playlist.cover}" alt="${playlist.name}" class="playlist-cover">
            <h4 class="playlist-name">${playlist.name}</h4>
            <p class="playlist-song-count">${playlist.songs.length} songs</p>
            <button class="playlist-play-btn" data-id="${playlist.id}">
                <i class="fas fa-play"></i>
            </button>
        `;
        playlistsContainer.appendChild(playlistElement);
        
        // Add click event to view playlist
        playlistElement.addEventListener('click', () => {
            viewPlaylist(playlist.id);
        });
    });
}

// View playlist songs
function viewPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    // Hide playlists grid and show songs list
    playlistsContainer.style.display = 'none';
    playlistSongsContainer.style.display = 'block';
    
    // Set playlist title
    document.querySelector('.playlist-title').textContent = playlist.name;
    
    // Get songs in this playlist
    const playlistSongs = songs.filter(song => playlist.songs.includes(song.id));
    
    // Render playlist songs
    renderSongs(playlistSongs, playlistSongsList);
}

// Back button for playlist view
backButton.addEventListener('click', () => {
    playlistsContainer.style.display = 'grid';
    playlistSongsContainer.style.display = 'none';
});

// Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.length === 0) {
        searchResults.innerHTML = '<p class="search-placeholder">Search for songs, artists, or albums</p>';
        return;
    }
    
    const filteredSongs = songs.filter(song => 
        song.title.toLowerCase().includes(searchTerm) || 
        song.artist.toLowerCase().includes(searchTerm)
    );
    
    if (filteredSongs.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No results found</p>';
    } else {
        renderSongs(filteredSongs, searchResults);
    }
});

// Player functionality
function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    
    currentSongTitle.textContent = song.title;
    currentSongArtist.textContent = song.artist;
    currentSongCover.src = song.cover;
    audio.src = song.source;
    
    // Add to recently played
    addToRecentlyPlayed(song);
}

function playSong() {
    isPlaying = true;
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    playSong();
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    playSong();
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time display
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function updateTotalTime() {
    const duration = audio.duration;
    const totalMinutes = Math.floor(duration / 60);
    let totalSeconds = Math.floor(duration % 60);
    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    totalTimeEl.textContent = `${totalMinutes}:${totalSeconds}`;
}

function addToRecentlyPlayed(song) {
    // Check if song already exists in recently played
    const existingIndex = recentlyPlayed.findIndex(s => s.id === song.id);
    if (existingIndex !== -1) {
        recentlyPlayed.splice(existingIndex, 1);
    }
    
    // Add to beginning of array
    recentlyPlayed.unshift(song);
    
    // Keep only last 5 songs
    if (recentlyPlayed.length > 5) {
        recentlyPlayed.pop();
    }
    
    // Update UI
    renderRecentlyPlayed();
}

function renderRecentlyPlayed() {
    recentSongs.innerHTML = '';
    
    recentlyPlayed.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-details">
                <h4 class="song-name">${song.title}</h4>
                <p class="song-artist">${song.artist}</p>
            </div>
            <button class="song-play-btn">
                <i class="fas fa-play"></i>
            </button>
        `;
        recentSongs.appendChild(songElement);
        
        // Add click event to play song
        songElement.addEventListener('click', () => {
            const index = songs.findIndex(s => s.id === song.id);
            if (index !== -1) {
                loadSong(index);
                playSong();
            }
        });
    });
}

// Event Listeners
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);
audio.addEventListener('loadedmetadata', updateTotalTime);

progressBar.addEventListener('click', setProgress);

// Initialize
showPage('home');