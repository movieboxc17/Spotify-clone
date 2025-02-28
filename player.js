const Player = (function() {
    // Private variables
    let isPlaying = false;
    let currentVolume = 70;
    let currentProgress = 30;
    let currentTime = "1:21";
    let totalTime = "5:56";
    let isMuted = false;
    let prevVolume = currentVolume;
    let isShuffleOn = false;
    let isRepeatOn = false;
    let isLiked = false;
    let currentTrack = {
        title: "Song Title",
        artist: "Artist Name",
        album: "Album Name",
        coverUrl: "https://via.placeholder.com/56",
        duration: "5:56"
    };
    
    // DOM Elements
    let playPauseBtn;
    let progressBar;
    let progressContainer;
    let volumeBar;
    let volumeBarContainer;
    let volumeBtn;
    let currentTimeEl;
    let totalTimeEl;
    let shuffleBtn;
    let repeatBtn;
    let prevBtn;
    let nextBtn;
    let likeBtn;
    let nowPlaying;
    let progressInterval;
    
    // Initialize player
    function init() {
        // Get DOM elements
        playPauseBtn = document.querySelector('.play-pause-btn');
        progressBar = document.querySelector('.progress-bar');
        progressContainer = document.querySelector('.progress-container');
        volumeBar = document.querySelector('.volume-bar');
        volumeBarContainer = document.querySelector('.volume-bar-container');
        volumeBtn = document.querySelector('.volume-control .control-btn');
        currentTimeEl = document.querySelector('.current-time');
        totalTimeEl = document.querySelector('.total-time');
        shuffleBtn = document.querySelector('.control-buttons .control-btn:first-child');
        repeatBtn = document.querySelector('.control-buttons .control-btn:last-child');
        prevBtn = document.querySelector('.control-buttons .control-btn:nth-child(2)');
        nextBtn = document.querySelector('.control-buttons .control-btn:nth-child(4)');
        likeBtn = document.querySelector('.like-btn');
        nowPlaying = document.querySelector('.now-playing');
        
        // Set initial states
        updateCurrentTime(currentProgress);
        currentTimeEl.textContent = currentTime;
        totalTimeEl.textContent = totalTime;
        
        // Add event listeners
        addEventListeners();
        
        // Start progress simulation
        startProgressSimulation();
    }
    
    function addEventListeners() {
        // Play/Pause button
        playPauseBtn.addEventListener('click', togglePlayPause);
        
        // Progress bar
        progressContainer.addEventListener('click', handleProgressBarClick);
        
        // Volume control
        volumeBarContainer.addEventListener('click', handleVolumeBarClick);
        volumeBtn.addEventListener('click', toggleMute);
        
        // Shuffle button
        shuffleBtn.addEventListener('click', toggleShuffle);
        
        // Repeat button
        repeatBtn.addEventListener('click', toggleRepeat);
        
        // Like button
        likeBtn.addEventListener('click', toggleLike);
        
        // Previous and Next buttons
        prevBtn.addEventListener('click', previous);
        nextBtn.addEventListener('click', next);
        
        // Enable drag functionality
        enableDragFunctionality();
    }
    
    // Handle play/pause
    function togglePlayPause() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            addNowPlayingIndicator();
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            removeNowPlayingIndicator();
        }
        
        // Notify of playback state change
        const event = new CustomEvent('playbackStateChanged', {
            detail: { isPlaying: isPlaying }
        });
        document.dispatchEvent(event);
    }
    
    // Handle progress bar click
    function handleProgressBarClick(e) {
        const clickPosition = e.offsetX;
        const totalWidth = this.clientWidth;
        currentProgress = (clickPosition / totalWidth) * 100;
        progressBar.style.width = `${currentProgress}%`;
        updateCurrentTime(currentProgress);
    }
    
    // Handle volume bar click
    function handleVolumeBarClick(e) {
        const clickPosition = e.offsetX;
        const totalWidth = this.clientWidth;
        currentVolume = Math.round((clickPosition / totalWidth) * 100);
        volumeBar.style.width = `${currentVolume}%`;
        updateVolumeIcon();
    }
    
    // Toggle mute
    function toggleMute() {
        isMuted = !isMuted;
        if (isMuted) {
            prevVolume = currentVolume;
            currentVolume = 0;
            volumeBar.style.width = '0%';
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            currentVolume = prevVolume;
            volumeBar.style.width = `${currentVolume}%`;
            updateVolumeIcon();
        }
    }
    
    // Toggle shuffle
    function toggleShuffle() {
        isShuffleOn = !isShuffleOn;
        shuffleBtn.classList.toggle('active-control');
        if (isShuffleOn) {
            shuffleBtn.style.color = 'var(--spotify-green)';
        } else {
            shuffleBtn.style.color = '';
        }
    }
    
    // Toggle repeat
    function toggleRepeat() {
        isRepeatOn = !isRepeatOn;
        repeatBtn.classList.toggle('active-control');
        if (isRepeatOn) {
            repeatBtn.style.color = 'var(--spotify-green)';
        } else {
            repeatBtn.style.color = '';
        }
    }
    
    // Toggle like
    function toggleLike() {
        isLiked = !isLiked;
        if (isLiked) {
            likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
            likeBtn.classList.add('active');
        } else {
            likeBtn.innerHTML = '<i class="far fa-heart"></i>';
            likeBtn.classList.remove('active');
        }
    }
    
    // Previous track
    function previous() {
        currentProgress = 0;
        progressBar.style.width = '0%';
        updateCurrentTime(0);
        
        // Simulate loading a new track
        loadRandomTrack();
    }
    
    // Next track
    function next() {
        currentProgress = 0;
        progressBar.style.width = '0%';
        updateCurrentTime(0);
        
        // Simulate loading a new track
        loadRandomTrack();
    }
    
    // Update track info
    function updateNowPlaying(trackName, artistName, imgSrc) {
        currentTrack.title = trackName;
        currentTrack.artist = artistName;
        currentTrack.coverUrl = imgSrc;
        
        document.querySelector('.track-name').textContent = trackName;
        document.querySelector('.artist-name').textContent = artistName;
        document.querySelector('.now-playing img').src = imgSrc;
    }
    
    // Add equalizer animation to now playing
    function addNowPlayingIndicator() {
        // Remove if already exists
        removeNowPlayingIndicator();
        
        // Create equalizer animation
        const equalizer = document.createElement('div');
        equalizer.classList.add('equalizer');
        
        for (let i = 0; i < 4; i++) {
            const bar = document.createElement('div');
            bar.classList.add('eq-bar');
            equalizer.appendChild(bar);
        }
        
        // Add to now playing
        nowPlaying.appendChild(equalizer);
    }
    
    // Remove equalizer animation
    function removeNowPlayingIndicator() {
        const equalizer = document.querySelector('.equalizer');
        if (equalizer) {
            equalizer.remove();
        }
    }
    
    // Update time based on progress
    function updateCurrentTime(progress) {
        // Convert percentage to time (simulation)
        const totalSeconds = timeToSeconds(totalTime);
        const currentSeconds = Math.round((progress / 100) * totalSeconds);
        currentTime = secondsToTime(currentSeconds);
        currentTimeEl.textContent = currentTime;
    }
    
    // Convert time string to seconds
    function timeToSeconds(timeStr) {
        const [mins, secs] = timeStr.split(':').map(Number);
        return mins * 60 + secs;
    }
    
    // Convert seconds to time string
    function secondsToTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update volume icon based on volume level
    function updateVolumeIcon() {
        if (currentVolume === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (currentVolume < 30) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
    
    // Enable drag functionality for progress and volume bars
    function enableDragFunctionality() {
        // Progress bar drag
        let isDraggingProgress = false;
        
        progressBar.addEventListener('mousedown', function(e) {
            isDraggingProgress = true;
            document.addEventListener('mousemove', moveProgressBar);
            document.addEventListener('mouseup', stopDraggingProgress);
            e.preventDefault();
        });
        
        function moveProgressBar(e) {
            if (!isDraggingProgress) return;
            
            const rect = progressContainer.getBoundingClientRect();
            const position = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
            const percentage = (position / rect.width) * 100;
            
            currentProgress = percentage;
            progressBar.style.width = `${percentage}%`;
            updateCurrentTime(percentage);
        }
        
        function stopDraggingProgress() {
            isDraggingProgress = false;
            document.removeEventListener('mousemove', moveProgressBar);
            document.removeEventListener('mouseup', stopDraggingProgress);
        }
        
        // Volume bar drag
        let isDraggingVolume = false;
        
        volumeBar.addEventListener('mousedown', function(e) {
            isDraggingVolume = true;
            document.addEventListener('mousemove', moveVolumeBar);
            document.addEventListener('mouseup', stopDraggingVolume);
            e.preventDefault();
        });
        
        function moveVolumeBar(e) {
            if (!isDraggingVolume) return;
            
            const rect = volumeBarContainer.getBoundingClientRect();
            const position = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
            const percentage = (position / rect.width) * 100;
            
            currentVolume = Math.round(percentage);
            volumeBar.style.width = `${percentage}%`;
            updateVolumeIcon();
            
            isMuted = (currentVolume === 0);
        }
        
        function stopDraggingVolume() {
            isDraggingVolume = false;
            document.removeEventListener('mousemove', moveVolumeBar);
            document.removeEventListener('mouseup', stopDraggingVolume);
        }
    }
    
    // Start progress simulation
    function startProgressSimulation() {
      progressInterval = setInterval(() => {
            if (isPlaying) {
                currentProgress += 0.4;
                if (currentProgress >= 100) {
                    if (isRepeatOn) {
                        currentProgress = 0;
                    } else {
                        isPlaying = false;
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                        removeNowPlayingIndicator();
                        
                        // If shuffle is on or it's not the last track, play next track
                        if (isShuffleOn) {
                            setTimeout(() => {
                                next();
                                togglePlayPause();
                            }, 500);
                        }
                    }
                }
                progressBar.style.width = `${currentProgress}%`;
                updateCurrentTime(currentProgress);
            }
        }, 1000);
    }
    
    // Load a random track to simulate track changes
    function loadRandomTrack() {
        const tracks = [
            {
                title: "Bohemian Rhapsody",
                artist: "Queen",
                album: "A Night at the Opera",
                coverUrl: "https://via.placeholder.com/56/995500/ffffff?text=Queen"
            },
            {
                title: "Blinding Lights",
                artist: "The Weeknd",
                album: "After Hours",
                coverUrl: "https://via.placeholder.com/56/ff0000/ffffff?text=TW"
            },
            {
                title: "Shape of You",
                artist: "Ed Sheeran",
                album: "÷ (Divide)",
                coverUrl: "https://via.placeholder.com/56/00ff00/ffffff?text=ES"
            },
            {
                title: "Dance Monkey",
                artist: "Tones and I",
                album: "The Kids Are Coming",
                coverUrl: "https://via.placeholder.com/56/0000ff/ffffff?text=T&I"
            },
            {
                title: "Someone You Loved",
                artist: "Lewis Capaldi",
                album: "Divinely Uninspired To A Hellish Extent",
                coverUrl: "https://via.placeholder.com/56/999999/ffffff?text=LC"
            }
        ];
        
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        currentTrack = randomTrack;
        
        updateNowPlaying(randomTrack.title, randomTrack.artist, randomTrack.coverUrl);
        
        // Generate random duration between 2 and 5 minutes
        const minSeconds = 2 * 60;
        const maxSeconds = 5 * 60;
        const randomSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
        totalTime = secondsToTime(randomSeconds);
        totalTimeEl.textContent = totalTime;
        
        // Reset liked state
        isLiked = false;
        likeBtn.innerHTML = '<i class="far fa-heart"></i>';
        likeBtn.classList.remove('active');
        
        // Notify of track change
        const event = new CustomEvent('trackChanged', {
            detail: { track: currentTrack }
        });
        document.dispatchEvent(event);
    }
    
    // Get current track info
    function getCurrentTrack() {
        return currentTrack;
    }
    
    // Public methods
    return {
        init: init,
        togglePlayPause: togglePlayPause,
        toggleMute: toggleMute,
        toggleShuffle: toggleShuffle,
        toggleRepeat: toggleRepeat,
        toggleLike: toggleLike,
        next: next,
        previous: previous,
        getCurrentTrack: getCurrentTrack,
        updateNowPlaying: updateNowPlaying
    };
})();
