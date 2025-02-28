const UI = (function() {
    // Private variables
    let isFullscreen = false;
    
    // DOM Elements
    let mainContainer;
    let cards;
    let playBtns;
    let sidebarLinks;
    let quickLinkItems;
    
    // Initialize UI
    function init() {
        // Get DOM elements
        mainContainer = document.querySelector('.container');
        cards = document.querySelectorAll('.card');
        playBtns = document.querySelectorAll('.play-btn');
        sidebarLinks = document.querySelectorAll('.main-nav li');
        quickLinkItems = document.querySelectorAll('.quick-link-item');
        
        // Add event listeners
        addEventListeners();
        
        // Initialize tooltips
        initTooltips();
        
        // Initialize custom scroll behavior
        initCustomScrollBehavior();
        
        // Add dark mode toggle in UI
        addThemeToggle();
    }
    
    function addEventListeners() {
        // Card play buttons
        playBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                // Get card info
                const card = this.closest('.card');
                const title = card.querySelector('h4').textContent;
                const description = card.querySelector('p').textContent;
                const imgSrc = card.querySelector('img').src;
                
                // Update now playing
                Player.updateNowPlaying(title, description, imgSrc);
                
                // Start playback
                if (!Player.isPlaying) {
                    Player.togglePlayPause();
                }
            });
        });
        
        // Quick link items
        quickLinkItems.forEach(item => {
            item.addEventListener('click', function() {
                // Simulate playlist selection
                const playlistName = this.querySelector('span').textContent;
                console.log(`Selected playlist: ${playlistName}`);
                
                // Add active state to the selected item
                quickLinkItems.forEach(i => i.classList.remove('active-item'));
                this.classList.add('active-item');
                
                // Update greeting
                document.querySelector('.greeting h2').textContent = `Playlist: ${playlistName}`;
            });
        });
        
        // Sidebar navigation
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function() {
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Get the section name
                const sectionName = this.querySelector('a').textContent.trim();
                
                // Notify navigation module
                Navigation.navigateTo(sectionName);
            });
        });
        
        // Profile button event listener
        const profileBtn = document.querySelector('.profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', toggleProfileDropdown);
        }
    }
    
    // Initialize tooltips
    function initTooltips() {
        // Add tooltips to controls
        const controls = document.querySelectorAll('.control-btn');
        controls.forEach(control => {
            const icon = control.querySelector('i');
            if (!icon) return;
            
            if (icon.classList.contains('fa-random')) {
                control.setAttribute('data-tooltip', 'Shuffle');
            } else if (icon.classList.contains('fa-step-backward')) {
                control.setAttribute('data-tooltip', 'Previous');
            } else if (icon.classList.contains('fa-step-forward')) {
                control.setAttribute('data-tooltip', 'Next');
            } else if (icon.classList.contains('fa-redo')) {
                control.setAttribute('data-tooltip', 'Repeat');
            } else if (icon.classList.contains('fa-volume-up') || 
                       icon.classList.contains('fa-volume-down') || 
                       icon.classList.contains('fa-volume-mute')) {
                control.setAttribute('data-tooltip', 'Volume');
            } else if (icon.classList.contains('fa-list-ul')) {
                control.setAttribute('data-tooltip', 'Queue');
            } else if (icon.classList.contains('fa-desktop')) {
                control.setAttribute('data-tooltip', 'Connect to a device');
            } else if (icon.classList.contains('fa-heart')) {
                control.setAttribute('data-tooltip', 'Save to your Library');
            }
        });
        
        // Add tooltip to play button
        const playPauseBtn = document.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.setAttribute('data-tooltip', 'Play');
            
            // Update tooltip on play/pause
            document.addEventListener('playbackStateChanged', function(e) {
                if (e.detail.isPlaying) {
                    playPauseBtn.setAttribute('data-tooltip', 'Pause');
                } else {
                    playPauseBtn.setAttribute('data-tooltip', 'Play');
                }
            });
        }
    }
    
    // Initialize custom scroll behavior
    function initCustomScrollBehavior() {
        const scrollableElements = document.querySelectorAll('.main-content, .sidebar, .playlists');
        
        scrollableElements.forEach(element => {
            element.addEventListener('scroll', function() {
                // Add custom scroll effects
                if (this.scrollTop > 20) {
                    this.classList.add('scrolled');
                    
                    // Add header shadow when scrolled
                    if (this.classList.contains('main-content')) {
                        document.querySelector('.topbar').classList.add('scrolled');
                    }
                } else {
                    this.classList.remove('scrolled');
                    
                    // Remove header shadow when at top
                    if (this.classList.contains('main-content')) {
                        document.querySelector('.topbar').classList.remove('scrolled');
                    }
                }
            });
        });
    }
    
    // Add theme toggle
    function addThemeToggle() {
        const extraControls = document.querySelector('.extra-controls');
        
        const themeBtn = document.createElement('button');
        themeBtn.classList.add('control-btn', 'theme-toggle');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        themeBtn.setAttribute('data-tooltip', 'Toggle dark/light mode');
        
        if (extraControls) {
            extraControls.appendChild(themeBtn);
            
            themeBtn.addEventListener('click', toggleTheme);
        }
    }
    
    // Toggle between dark and light theme
    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        
        const themeBtn = document.querySelector('.theme-toggle');
        if (document.body.classList.contains('light-theme')) {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            themeBtn.setAttribute('data-tooltip', 'Switch to dark mode');
        } else {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            themeBtn.setAttribute('data-tooltip', 'Switch to light mode');
        }
        
        // Store theme preference
        const isDarkTheme = !document.body.classList.contains('light-theme');
        localStorage.setItem('spotify-theme', isDarkTheme ? 'dark' : 'light');
    }
    
    // Toggle fullscreen
    function toggleFullscreen() {
        if (!isFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        
        isFullscreen = !isFullscreen;
    }
    
    // Toggle profile dropdown
    function toggleProfileDropdown() {
        const existing = document.querySelector('.profile-dropdown');
        if (existing) {
            existing.remove();
            return;
        }
        
        const profileBtn = document.querySelector('.profile-btn');
        const dropdown = document.createElement('div');
        dropdown.classList.add('profile-dropdown');
        dropdown.innerHTML = `
            <div class="profile-dropdown-item">Profile</div>
            <div class="profile-dropdown-item">Account</div>
            <div class="profile-dropdown-item">Settings</div>
            <div class="profile-dropdown-divider"></div>
            <div class="profile-dropdown-item">Log out</div>
        `;
        
        // Position the dropdown
        const rect = profileBtn.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.top = rect.bottom + 'px';
        dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        dropdown.style.backgroundColor = 'var(--bg-elevated-base)';
        dropdown.style.borderRadius = '4px';
        dropdown.style.boxShadow = '0 16px 24px rgba(0, 0, 0, 0.3)';
        dropdown.style.padding = '8px 0';
        dropdown.style.zIndex = '1000';
        dropdown.style.minWidth = '180px';
        dropdown.style.animation = 'fadeIn 0.2s ease-out';
        
        // Style the dropdown items
        const items = dropdown.querySelectorAll('.profile-dropdown-item');
        items.forEach(item => {
            item.style.padding = '10px 16px';
            item.style.cursor = 'pointer';
            item.style.fontSize = '14px';
            item.style.transition = 'background-color 0.2s ease';
            
            item.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'var(--bg-elevated-highlight)';
            });
            
            item.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            item.addEventListener('click', function() {
                console.log(`Selected: ${this.textContent}`);
                dropdown.remove();
                
                // Handle specific actions
                if (this.textContent === 'Settings') {
                    Modals.showSettingsModal();
                } else if (this.textContent === 'Log out') {
                    Modals.showLogoutConfirmation();
                }
            });
        });
        
        // Style the divider
        const divider = dropdown.querySelector('.profile-dropdown-divider');
        divider.style.height = '1px';
        divider.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        divider.style.margin = '4px 0';
        
        document.body.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        const closeDropdownHandler = function(e) {
            if (!dropdown.contains(e.target) && e.target !== profileBtn) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdownHandler);
            }
        };
        
        // Delay adding the event listener to prevent immediate triggering
      setTimeout(() => {
            document.addEventListener('click', closeDropdownHandler);
        }, 0);
    }
    
    // Create color palette view
    function createColorPaletteView() {
        const paletteContainer = document.createElement('div');
        paletteContainer.classList.add('color-palette-container');
        paletteContainer.innerHTML = `
            <h3>Color Palette</h3>
            <div class="palette-grid">
                <div class="color-item" style="background-color: var(--spotify-green);">
                    <span>Spotify Green</span>
                    <code>#1DB954</code>
                </div>
                <div class="color-item" style="background-color: var(--bg-base);">
                    <span>Background Base</span>
                    <code>#121212</code>
                </div>
                <div class="color-item" style="background-color: var(--bg-highlight);">
                    <span>Background Highlight</span>
                    <code>#1A1A1A</code>
                </div>
                <div class="color-item" style="background-color: var(--bg-press);">
                    <span>Background Press</span>
                    <code>#000000</code>
                </div>
                <div class="color-item" style="background-color: var(--bg-elevated-base);">
                    <span>Elevated Base</span>
                    <code>#282828</code>
                </div>
                <div class="color-item" style="background-color: var(--bg-elevated-highlight);">
                    <span>Elevated Highlight</span>
                    <code>#3E3E3E</code>
                </div>
                <div class="color-item" style="background-color: var(--text-base); color: black;">
                    <span>Text Base</span>
                    <code>#FFFFFF</code>
                </div>
                <div class="color-item" style="background-color: var(--text-subdued); color: black;">
                    <span>Text Subdued</span>
                    <code>#A7A7A7</code>
                </div>
            </div>
        `;
        
        // Style the container
        paletteContainer.style.padding = '20px';
        paletteContainer.style.backgroundColor = 'var(--bg-elevated-base)';
        paletteContainer.style.borderRadius = '8px';
        paletteContainer.style.maxWidth = '800px';
        paletteContainer.style.margin = '20px auto';
        
        // Style the title
        paletteContainer.querySelector('h3').style.marginTop = '0';
        paletteContainer.querySelector('h3').style.marginBottom = '16px';
        paletteContainer.querySelector('h3').style.fontSize = '18px';
        
        // Style the grid
        const grid = paletteContainer.querySelector('.palette-grid');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
        grid.style.gap = '16px';
        
        // Style color items
        const colorItems = paletteContainer.querySelectorAll('.color-item');
        colorItems.forEach(item => {
            item.style.padding = '16px';
            item.style.borderRadius = '4px';
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.justifyContent = 'space-between';
            item.style.height = '100px';
            item.style.transition = 'transform 0.2s ease';
            item.style.cursor = 'pointer';
            
            // Add copy functionality
            item.addEventListener('click', function() {
                const colorCode = this.querySelector('code').textContent;
                navigator.clipboard.writeText(colorCode).then(() => {
                    Notifications.show(`Copied color code: ${colorCode}`);
                });
            });
            
            // Add hover effect
            item.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
            });
            
            const span = item.querySelector('span');
            span.style.fontSize = '14px';
            span.style.fontWeight = '500';
            
            const code = item.querySelector('code');
            code.style.fontSize = '12px';
            code.style.opacity = '0.8';
        });
        
        return paletteContainer;
    }
    
    // Toggle friend activity panel
    function toggleFriendActivity() {
        const mainContent = document.querySelector('.main-content');
        const existingPanel = document.querySelector('.friend-activity-panel');
        
        if (existingPanel) {
            // Remove the panel
            existingPanel.remove();
            mainContent.style.width = '100%';
        } else {
            // Create the panel
            const friendPanel = document.createElement('div');
            friendPanel.classList.add('friend-activity-panel');
            friendPanel.innerHTML = `
                <div class="panel-header">
                    <h3>Friend Activity</h3>
                    <button class="close-panel-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="friend-list">
                    <div class="friend-item">
                        <img src="https://via.placeholder.com/40" alt="Friend">
                        <div class="friend-info">
                            <div class="friend-name">John Doe</div>
                            <div class="friend-activity">
                                <div class="song-name">Bohemian Rhapsody</div>
                                <div class="artist-name">Queen</div>
                            </div>
                            <div class="activity-time">2m ago</div>
                        </div>
                    </div>
                    <div class="friend-item">
                        <img src="https://via.placeholder.com/40" alt="Friend">
                        <div class="friend-info">
                            <div class="friend-name">Jane Smith</div>
                            <div class="friend-activity">
                                <div class="song-name">Billie Jean</div>
                                <div class="artist-name">Michael Jackson</div>
                            </div>
                            <div class="activity-time">5m ago</div>
                        </div>
                    </div>
                    <div class="friend-item">
                        <img src="https://via.placeholder.com/40" alt="Friend">
                        <div class="friend-info">
                            <div class="friend-name">David Johnson</div>
                            <div class="friend-activity">
                                <div class="song-name">Shape of You</div>
                                <div class="artist-name">Ed Sheeran</div>
                            </div>
                            <div class="activity-time">10m ago</div>
                        </div>
                    </div>
                </div>
                <div class="find-friends">
                    <button class="find-friends-btn">Find Friends</button>
                </div>
            `;
            
            // Style the panel
            friendPanel.style.width = '280px';
            friendPanel.style.height = 'calc(100vh - 90px)';
            friendPanel.style.backgroundColor = 'var(--bg-base)';
            friendPanel.style.position = 'fixed';
            friendPanel.style.top = '0';
            friendPanel.style.right = '0';
            friendPanel.style.borderLeft = '1px solid var(--essential-subdued)';
            friendPanel.style.overflowY = 'auto';
            friendPanel.style.zIndex = '10';
            friendPanel.style.animation = 'slideIn 0.3s ease';
            
            // Style panel header
            const header = friendPanel.querySelector('.panel-header');
            header.style.padding = '16px';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.borderBottom = '1px solid var(--essential-subdued)';
            
            header.querySelector('h3').style.margin = '0';
            header.querySelector('h3').style.fontSize = '16px';
            header.querySelector('h3').style.fontWeight = '700';
            
            const closeBtn = header.querySelector('.close-panel-btn');
            closeBtn.style.background = 'transparent';
            closeBtn.style.border = 'none';
            closeBtn.style.color = 'var(--text-subdued)';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '16px';
            
            // Style friend list
            const friendList = friendPanel.querySelector('.friend-list');
            friendList.style.padding = '16px';
            
            // Style friend items
            const friendItems = friendPanel.querySelectorAll('.friend-item');
            friendItems.forEach(item => {
                item.style.display = 'flex';
                item.style.padding = '8px 0';
                item.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                
                const img = item.querySelector('img');
                img.style.width = '40px';
                img.style.height = '40px';
                img.style.borderRadius = '50%';
                img.style.marginRight = '12px';
                
                const friendInfo = item.querySelector('.friend-info');
                friendInfo.style.flex = '1';
                
                const friendName = item.querySelector('.friend-name');
                friendName.style.fontSize = '14px';
                friendName.style.fontWeight = '700';
                friendName.style.marginBottom = '4px';
                
                const songName = item.querySelector('.song-name');
                songName.style.fontSize = '12px';
                songName.style.fontWeight = '500';
                
                const artistName = item.querySelector('.artist-name');
                artistName.style.fontSize = '12px';
                artistName.style.color = 'var(--text-subdued)';
                
                const activityTime = item.querySelector('.activity-time');
                activityTime.style.fontSize = '11px';
                activityTime.style.color = 'var(--text-subdued)';
                activityTime.style.marginTop = '4px';
            });
            
            // Style find friends section
            const findFriends = friendPanel.querySelector('.find-friends');
            findFriends.style.padding = '16px';
            findFriends.style.textAlign = 'center';
            
            const findFriendsBtn = findFriends.querySelector('.find-friends-btn');
            findFriendsBtn.style.backgroundColor = 'transparent';
            findFriendsBtn.style.border = '1px solid var(--text-subdued)';
            findFriendsBtn.style.color = 'var(--text-base)';
            findFriendsBtn.style.padding = '8px 16px';
            findFriendsBtn.style.borderRadius = '500px';
            findFriendsBtn.style.fontSize = '14px';
            findFriendsBtn.style.fontWeight = '700';
            findFriendsBtn.style.cursor = 'pointer';
            findFriendsBtn.style.transition = 'all 0.2s ease';
            
            findFriendsBtn.addEventListener('mouseover', function() {
                this.style.borderColor = 'var(--text-base)';
                this.style.transform = 'scale(1.05)';
            });
            
            findFriendsBtn.addEventListener('mouseout', function() {
                this.style.borderColor = 'var(--text-subdued)';
                this.style.transform = 'scale(1)';
            });
            
            findFriendsBtn.addEventListener('click', function() {
                Notifications.show('Finding friends feature coming soon!');
            });
            
            // Add close button functionality
            closeBtn.addEventListener('click', function() {
                friendPanel.remove();
                mainContent.style.width = '100%';
            });
            
            document.body.appendChild(friendPanel);
            
            // Adjust main content width
            mainContent.style.width = 'calc(100% - 280px)';
        }
    }
    
    // Show/hide the lyrics panel
    function toggleLyricsPanel() {
        const existingPanel = document.querySelector('.lyrics-panel');
        
        if (existingPanel) {
            existingPanel.remove();
            return;
        }
        
        const lyricsPanel = document.createElement('div');
        lyricsPanel.classList.add('lyrics-panel');
        lyricsPanel.innerHTML = `
            <div class="lyrics-header">
                <div class="lyrics-title">Lyrics</div>
                <button class="close-lyrics-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="current-track-info">
                <img src="${Player.getCurrentTrack().coverUrl}" alt="Track cover">
                <div class="track-details">
                    <div class="track-title">${Player.getCurrentTrack().title}</div>
                    <div class="track-artist">${Player.getCurrentTrack().artist}</div>
                </div>
            </div>
            <div class="lyrics-content">
                <div class="lyrics-line active">Now I've heard there was a secret chord</div>
                <div class="lyrics-line">That David played, and it pleased the Lord</div>
                <div class="lyrics-line">But you don't really care for music, do you?</div>
                <div class="lyrics-line">It goes like this, the fourth, the fifth</div>
                <div class="lyrics-line">The minor fall, the major lift</div>
                <div class="lyrics-line">The baffled king composing Hallelujah</div>
                <div class="lyrics-line">Hallelujah, Hallelujah</div>
                <div class="lyrics-line">Hallelujah, Hallelujah</div>
                <div class="lyrics-line">Your faith was strong but you needed proof</div>
                <div class="lyrics-line">You saw her bathing on the roof</div>
                <div class="lyrics-line">Her beauty and the moonlight overthrew you</div>
            </div>
        `;
        
        // Style the panel
        lyricsPanel.style.position = 'fixed';
        lyricsPanel.style.top = '0';
        lyricsPanel.style.right = '0';
        lyricsPanel.style.width = '400px';
        lyricsPanel.style.height = '100vh';
        lyricsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        lyricsPanel.style.backdropFilter = 'blur(40px)';
        lyricsPanel.style.zIndex = '9999';
        lyricsPanel.style.overflowY = 'auto';
        lyricsPanel.style.animation = 'slideInRight 0.3s ease';
        
        // Style header
        const header = lyricsPanel.querySelector('.lyrics-header');
      header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '16px';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        
        const lyricsTitle = header.querySelector('.lyrics-title');
        lyricsTitle.style.fontWeight = '700';
        lyricsTitle.style.fontSize = '24px';
        
        const closeBtn = header.querySelector('.close-lyrics-btn');
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'var(--text-subdued)';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        
        // Style current track info
        const trackInfo = lyricsPanel.querySelector('.current-track-info');
        trackInfo.style.display = 'flex';
        trackInfo.style.alignItems = 'center';
        trackInfo.style.padding = '16px';
        trackInfo.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        
        const trackImage = trackInfo.querySelector('img');
        trackImage.style.width = '56px';
        trackImage.style.height = '56px';
        trackImage.style.borderRadius = '4px';
        trackImage.style.marginRight = '16px';
        
        const trackDetails = trackInfo.querySelector('.track-details');
        trackDetails.style.flex = '1';
        
        const trackTitle = trackDetails.querySelector('.track-title');
        trackTitle.style.fontWeight = '700';
        trackTitle.style.fontSize = '16px';
        trackTitle.style.marginBottom = '4px';
        
        const trackArtist = trackDetails.querySelector('.track-artist');
        trackArtist.style.fontSize = '14px';
        trackArtist.style.color = 'var(--text-subdued)';
        
        // Style lyrics content
        const lyricsContent = lyricsPanel.querySelector('.lyrics-content');
        lyricsContent.style.padding = '16px';
        lyricsContent.style.fontSize = '24px';
        lyricsContent.style.fontWeight = '500';
        lyricsContent.style.lineHeight = '1.6';
        lyricsContent.style.textAlign = 'center';
        
        const lyricsLines = lyricsContent.querySelectorAll('.lyrics-line');
        lyricsLines.forEach(line => {
            line.style.margin = '20px 0';
            line.style.opacity = '0.6';
            line.style.transition = 'all 0.3s ease';
        });
        
        // Highlight active lyrics line
        const activeLine = lyricsContent.querySelector('.lyrics-line.active');
        if (activeLine) {
            activeLine.style.opacity = '1';
            activeLine.style.fontSize = '28px';
            activeLine.style.color = 'var(--spotify-green)';
        }
        
        // Add close button functionality
        closeBtn.addEventListener('click', function() {
            lyricsPanel.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                lyricsPanel.remove();
            }, 300);
        });
        
        // Simulate lyrics scrolling with playback
        let currentLineIndex = 0;
        
        const scrollInterval = setInterval(() => {
            if (!document.body.contains(lyricsPanel)) {
                clearInterval(scrollInterval);
                return;
            }
            
            if (Player.isPlaying) {
                lyricsLines.forEach(line => {
                    line.classList.remove('active');
                    line.style.opacity = '0.6';
                    line.style.fontSize = '24px';
                    line.style.color = 'var(--text-base)';
                });
                
                currentLineIndex = (currentLineIndex + 1) % lyricsLines.length;
                
                const newActiveLine = lyricsLines[currentLineIndex];
                newActiveLine.classList.add('active');
                newActiveLine.style.opacity = '1';
                newActiveLine.style.fontSize = '28px';
                newActiveLine.style.color = 'var(--spotify-green)';
                
                // Scroll to keep active line in view
                newActiveLine.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 5000);
        
        document.body.appendChild(lyricsPanel);
    }
    
    // Create mini player view
    function toggleMiniPlayer() {
        const existingMiniPlayer = document.querySelector('.mini-player');
        
        if (existingMiniPlayer) {
            existingMiniPlayer.remove();
            return;
        }
        
        const miniPlayer = document.createElement('div');
        miniPlayer.classList.add('mini-player');
        miniPlayer.innerHTML = `
            <div class="mini-player-content">
                <img src="${Player.getCurrentTrack().coverUrl}" alt="Track cover">
                <div class="mini-track-info">
                    <div class="mini-track-title">${Player.getCurrentTrack().title}</div>
                    <div class="mini-track-artist">${Player.getCurrentTrack().artist}</div>
                </div>
                <div class="mini-controls">
                    <button class="mini-control-btn mini-prev-btn"><i class="fas fa-step-backward"></i></button>
                    <button class="mini-control-btn mini-play-btn">
                        <i class="fas ${Player.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                    <button class="mini-control-btn mini-next-btn"><i class="fas fa-step-forward"></i></button>
                </div>
                <button class="mini-close-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Style mini player
        miniPlayer.style.position = 'fixed';
        miniPlayer.style.bottom = '20px';
        miniPlayer.style.right = '20px';
        miniPlayer.style.backgroundColor = 'var(--bg-elevated-base)';
        miniPlayer.style.borderRadius = '8px';
        miniPlayer.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
        miniPlayer.style.zIndex = '1000';
        miniPlayer.style.animation = 'fadeIn 0.3s ease';
        
        const content = miniPlayer.querySelector('.mini-player-content');
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        content.style.padding = '12px';
        
        const img = miniPlayer.querySelector('img');
        img.style.width = '48px';
        img.style.height = '48px';
        img.style.borderRadius = '4px';
        img.style.marginRight = '12px';
        
        const trackInfo = miniPlayer.querySelector('.mini-track-info');
        trackInfo.style.marginRight = '16px';
        trackInfo.style.width = '120px';
        
        const trackTitle = trackInfo.querySelector('.mini-track-title');
        trackTitle.style.fontWeight = '700';
        trackTitle.style.fontSize = '14px';
        trackTitle.style.whiteSpace = 'nowrap';
        trackTitle.style.overflow = 'hidden';
        trackTitle.style.textOverflow = 'ellipsis';
        
        const trackArtist = trackInfo.querySelector('.mini-track-artist');
        trackArtist.style.fontSize = '12px';
        trackArtist.style.color = 'var(--text-subdued)';
        trackArtist.style.whiteSpace = 'nowrap';
        trackArtist.style.overflow = 'hidden';
        trackArtist.style.textOverflow = 'ellipsis';
        
        const controls = miniPlayer.querySelector('.mini-controls');
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.marginRight = '12px';
        
        const controlBtns = miniPlayer.querySelectorAll('.mini-control-btn');
        controlBtns.forEach(btn => {
            btn.style.backgroundColor = 'transparent';
            btn.style.border = 'none';
            btn.style.color = 'var(--text-base)';
            btn.style.fontSize = '14px';
            btn.style.cursor = 'pointer';
            btn.style.padding = '8px';
        });
        
        const playBtn = miniPlayer.querySelector('.mini-play-btn');
        playBtn.style.fontSize = '16px';
        
        const closeBtn = miniPlayer.querySelector('.mini-close-btn');
        closeBtn.style.backgroundColor = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'var(--text-subdued)';
        closeBtn.style.fontSize = '16px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '8px';
        
        // Add event listeners
        playBtn.addEventListener('click', function() {
            Player.togglePlayPause();
            this.innerHTML = `<i class="fas ${Player.isPlaying ? 'fa-pause' : 'fa-play'}"></i>`;
        });
        
        miniPlayer.querySelector('.mini-prev-btn').addEventListener('click', function() {
            Player.previous();
        });
        
        miniPlayer.querySelector('.mini-next-btn').addEventListener('click', function() {
            Player.next();
        });
        
        closeBtn.addEventListener('click', function() {
            miniPlayer.remove();
        });
        
        // Make mini player draggable
        makeDraggable(miniPlayer);
        
        document.body.appendChild(miniPlayer);
    }
    
    // Make an element draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.style.cursor = 'move';
        
        element.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }
        
        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // Public methods
    return {
        init: init,
        toggleFullscreen: toggleFullscreen,
        toggleTheme: toggleTheme,
        toggleFriendActivity: toggleFriendActivity,
        toggleLyricsPanel: toggleLyricsPanel,
        toggleMiniPlayer: toggleMiniPlayer,
        createColorPaletteView: createColorPaletteView
    };
})();
