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
const createPlaylistButton = document.getElementById('create-playlist');
const playlistModal = document.getElementById('playlist-modal');
const closeModalButton = document.querySelector('.close-modal');
const savePlaylistButton = document.getElementById('save-playlist');
const playlistNameInput = document.getElementById('playlist-name');

// App State
let songs = [];
let playlists = [
    {
        id: 1,
        name: "Favorites",
        cover: "https://i.ibb.co/d0Lw85R6/Picsart-25-08-01-19-18-42-186.png",
        songs: [1, 2, 3]
    },
    {
        id: 2,
        name: "Workout Mix",
        cover: "https://i.ibb.co/d0Lw85R6/Picsart-25-08-01-19-18-42-186.png",
        songs: [4, 5]
    },
    {
        id: 3,
        name: "Chill Vibes",
        cover: "https://i.ibb.co/d0Lw85R6/Picsart-25-08-01-19-18-42-186.png",
        songs: [2, 3, 5]
    }
];
let currentSongIndex = 0;
let isPlaying = false;
let currentPlaylist = null;
let currentPlaylistSongIndices = null;
let currentPlaylistCurrentIndex = 0;

// Initialize the app
async function init() {
    await loadSongs();
    renderAllSongs();
    renderPlaylists();
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
    } catch (error) {
        console.error('Error loading songs:', error);
        // Fallback data if collection.json fails to load
        songs = [
            {
            "id": 1,
            "title": "Aankhon Mein Doob Jaane Ko",
            "artist": "THE 9TEEN",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.mp3"
        },
        {
            "id": 2,
            "title": "Tere Vaaste",
            "artist": "Sachin-Jigar, Varun Jain, Shadab Faridi",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tere%20Vaaste%20-%20Sachin-Jigar%2C%20Varun%20Jain%2C%20Shadab%20Faridi.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tere%20Vaaste%20-%20Sachin-Jigar%2C%20Varun%20Jain%2C%20Shadab%20Faridi.mp3"
        },
        {
            "id": 3,
            "title": "Pasoori Nu",
            "artist": "Arijit Singh",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Pasoori%20Nu%20-%20Arijit%20Singh.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Pasoori%20Nu%20-%20Arijit%20Singh.mp3"
        },
        {
            "id": 4,
            "title": "Kesariya",
            "artist": "Arijit Singh",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Kesariya%20-%20Arijit%20Singh.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Kesariya%20-%20Arijit%20Singh.mp3"
        },
        {
            "id": 5,
            "title": "Raatan Lambiyan",
            "artist": "Tanishk Bagchi, Jubin Nautiyal",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Raatan%20Lambiyan%20-%20Tanishk%20Bagchi%2C%20Jubin%20Nautiyal.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Raatan%20Lambiyan%20-%20Tanishk%20Bagchi%2C%20Jubin%20Nautiyal.mp3"
        },
        {
            "id": 6,
            "title": "Shayad",
            "artist": "Arijit Singh",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Shayad%20-%20Arijit%20Singh.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Shayad%20-%20Arijit%20Singh.mp3"
        },
        {
            "id": 7,
            "title": "Tum Hi Aana",
            "artist": "Jubin Nautiyal",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tum%20Hi%20Aana%20-%20Jubin%20Nautiyal.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tum%20Hi%20Aana%20-%20Jubin%20Nautiyal.mp3"
        },
        {
            "id": 8,
            "title": "Bekhayali",
            "artist": "Sachet Tandon",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Bekhayali%20-%20Sachet%20Tandon.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Bekhayali%20-%20Sachet%20Tandon.mp3"
        },
        {
            "id": 9,
            "title": "Tujhe Kitna Chahne Lage",
            "artist": "Arijit Singh",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tujhe%20Kitna%20Chahne%20Lage%20-%20Arijit%20Singh.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tujhe%20Kitna%20Chahne%20Lage%20-%20Arijit%20Singh.mp3"
        },
        {
            "id": 10,
            "title": "Ve Maahi",
            "artist": "Arijit Singh",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Ve%20Maahi%20-%20Arijit%20Singh.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Ve%20Maahi%20-%20Arijit%20Singh.mp3"
        },
        {
            "id": 11,
            "title": "Kaise Hua",
            "artist": "Vishal Mishra",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Kaise%20Hua%20-%20Vishal%20Mishra.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Kaise%20Hua%20-%20Vishal%20Mishra.mp3"
        },
        {
            "id": 12,
            "title": "Tera Ban Jaunga",
            "artist": "Akhil Sachdeva, Tulsi Kumar",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tera%20Ban%20Jaunga%20-%20Akhil%20Sachdeva%2C%20Tulsi%20Kumar.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tera%20Ban%20Jaunga%20-%20Akhil%20Sachdeva%2C%20Tulsi%20Kumar.mp3"
        },
        {
            "id": 13,
            "title": "Pehla Pyaar",
            "artist": "Arko, Akhil Sachdeva",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Pehla%20Pyaar%20-%20Arko%2C%20Akhil%20Sachdeva.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Pehla%20Pyaar%20-%20Arko%2C%20Akhil%20Sachdeva.mp3"
        },
        {
            "id": 14,
            "title": "Tere Bin",
            "artist": "Rahat Fateh Ali Khan, Asees Kaur",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tere%20Bin%20-%20Rahat%20Fateh%20Ali%20Khan%2C%20Asees%20Kaur.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tere%20Bin%20-%20Rahat%20Fateh%20Ali%20Khan%2C%20Asees%20Kaur.mp3"
        },
        {
            "id": 15,
            "title": "Dil Diyan Gallan",
            "artist": "Atif Aslam",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Dil%20Diyan%20Gallan%20-%20Atif%20Aslam.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Dil%20Diyan%20Gallan%20-%20Atif%20Aslam.mp3"
        },
        {
            "id": 16,
            "title": "Tera Yaar Hoon Main",
            "artist": "Arijit Singh",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tera%20Yaar%20Hoon%20Main%20-%20Arijit%20Singh.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tera%20Yaar%20Hoon%20Main%20-%20Arijit%20Singh.mp3"
        },
        {
            "id": 17,
            "title": "Mere Sohneya",
            "artist": "Sachet Tandon, Parampara Tandon",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Mere%20Sohneya%20-%20Sachet%20Tandon%2C%20Parampara%20Tandon.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Mere%20Sohneya%20-%20Sachet%20Tandon%2C%20Parampara%20Tandon.mp3"
        },
        {
            "id": 18,
            "title": "Tum Se Hi",
            "artist": "Mohit Chauhan",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tum%20Se%20Hi%20-%20Mohit%20Chauhan.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tum%20Se%20Hi%20-%20Mohit%20Chauhan.mp3"
        },
        {
            "id": 19,
            "title": "Tum Mile",
            "artist": "Neeraj Shridhar",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tum%20Mile%20-%20Neeraj%20Shridhar.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Tum%20Mile%20-%20Neeraj%20Shridhar.mp3"
        },
        {
            "id": 20,
            "title": "Ae Dil Hai Mushkil",
            "artist": "Pritam, Arijit Singh",
            "cover": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Ae%20Dil%20Hai%20Mushkil%20-%20Pritam%2C%20Arijit%20Singh.jpg",
            "source": "https://raw.githubusercontent.com/shm0210/music-player-assets/main/Ae%20Dil%20Hai%20Mushkil%20-%20Pritam%2C%20Arijit%20Singh.mp3"
        }
        ];
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
    function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    
    searchResults.innerHTML = '';
    const results = songs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No songs found</p>';
        return;
    }
    
    results.forEach(song => {
        const songIndex = songs.findIndex(s => s.id === song.id);
        const songElement = document.createElement('div');
        songElement.className = 'song-card';
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <button class="play-button" data-index="${songIndex}">
                <i class="fas fa-play"></i>
            </button>
        `;
        
        songElement.addEventListener('click', () => {
            playSong(songIndex);
        });
        
        searchResults.appendChild(songElement);
    });
    
    navigateTo('search-page');
}
    });
    searchButton.addEventListener('click', performSearch);
    
    // Shuffle all button
    shuffleAllButton.addEventListener('click', shuffleAllSongs);
    
    // Playlist modal
    createPlaylistButton.addEventListener('click', () => {
        playlistModal.style.display = 'flex';
    });
    
    closeModalButton.addEventListener('click', () => {
        playlistModal.style.display = 'none';
    });
    
    savePlaylistButton.addEventListener('click', createNewPlaylist);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === playlistModal) {
            playlistModal.style.display = 'none';
        }
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
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-details">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <button class="play-button" data-index="${index}">
                <i class="fas fa-play"></i>
            </button>
        `;
        
        songElement.addEventListener('click', () => {
            playSong(index);
        });
        
        allSongsContainer.appendChild(songElement);
    });
}

// Render playlists with improved "Play All" button
function renderPlaylists() {
    playlistsContainer.innerHTML = '';
    
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist-card';
        playlistElement.innerHTML = `
            <img src="${playlist.cover}" alt="${playlist.name}" class="playlist-cover">
            <div class="playlist-info">
                <div class="playlist-name">${playlist.name}</div>
                <div class="playlist-song-count">${playlist.songs.length} ${playlist.songs.length === 1 ? 'song' : 'songs'}</div>
                <button class="play-all-button" data-playlist-id="${playlist.id}">
                    <i class="fas fa-play"></i> PLAY ALL
                </button>
            </div>
        `;
        
        const playAllButton = playlistElement.querySelector('.play-all-button');
        playAllButton.addEventListener('click', (e) => {
            e.stopPropagation();
            playPlaylist(playlist.id);
        });
        
        playlistElement.addEventListener('click', () => {
            showPlaylistSongs(playlist.id);
        });
        
        playlistsContainer.appendChild(playlistElement);
    });
}



// Play entire playlist
function playPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || playlist.songs.length === 0) return;
    
    const songIndices = playlist.songs.map(id => songs.findIndex(s => s.id === id));
    if (songIndices.length > 0) {
        playSong(songIndices[0], songIndices);
    }
}

// Show songs in a playlist with improved interface
function showPlaylistSongs(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    currentPlaylist = playlist;
    
    // Hide playlists, show songs
    playlistsContainer.style.display = 'none';
    playlistSongsContainer.style.display = 'block';
    
    playlistSongsContainer.innerHTML = `
        <div class="playlist-header">
            <h3>${playlist.name}</h3>
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
        playPlaylist(playlistId);
    });
    
    playlist.songs.forEach(songId => {
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
                <button class="play-button" data-index="${songIndex}">
                    <i class="fas fa-play"></i>
                </button>
            `;
            
            songElement.addEventListener('click', () => {
                playSong(songIndex, playlist.songs.map(id => songs.findIndex(s => s.id === id)));
            });
            
            playlistSongsList.appendChild(songElement);
        }
    });
}

// Create new playlist
function createNewPlaylist() {
    const name = playlistNameInput.value.trim();
    if (!name) return;
    
    const newPlaylist = {
        id: Date.now(), // Simple unique ID
        name: name,
        cover: "https://i.ibb.co/d0Lw85R6/Picsart-25-08-01-19-18-42-186.png",
        songs: []
    };
    
    playlists.push(newPlaylist);
    renderPlaylists();
    updateStats();
    
    // Reset and close modal
    playlistNameInput.value = '';
    playlistModal.style.display = 'none';
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
    totalPlaylistsElement.textContent = playlists.length;
    
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