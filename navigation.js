const Navigation = (function() {
    // Private variables
    let navigationHistory = [];
    let currentHistoryIndex = -1;
    let contentSections = {};
    
    // DOM Elements
    let mainContent;
    let backBtn;
    let forwardBtn;
    
    // Initialize navigation
    function init() {
        // Get DOM elements
        mainContent = document.querySelector('.main-content');
        backBtn = document.querySelector('.back-btn');
        forwardBtn = document.querySelector('.forward-btn');
        
        // Initialize navigation state
        disableBackForwardButtons();
        
        // Set up sections data
        setupSections();
        
        // Add event listeners
        addEventListeners();
        
        // Set initial section
        navigateTo('Home');
    }
    
    function setupSections() {
        // Define content for different sections
        contentSections = {
            'Home': createHomeContent(),
            'Search': createSearchContent(),
            'Your Library': createLibraryContent(),
            'Create Playlist': createEmptyPlaylistContent(),
            'Liked Songs': createLikedSongsContent()
        };
    }
    
    function addEventListeners() {
        // Back and forward buttons
        if (backBtn) {
            backBtn.addEventListener('click', goBack);
        }
        
        if (forwardBtn) {
            forwardBtn.addEventListener('click', goForward);
        }
    }
    
    // Add section to history and navigate
    function navigateTo(sectionName) {
        // Update history
        if (currentHistoryIndex >= 0) {
            // Remove forward history if we're navigating from middle of history
            navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
        }
        
        navigationHistory.push(sectionName);
        currentHistoryIndex = navigationHistory.length - 1;
        
        // Update UI
        updateContent(sectionName);
        updateNavButtons();
    }
    
    // Go back in history
    function goBack() {
        if (currentHistoryIndex > 0) {
            currentHistoryIndex--;
            const sectionName = navigationHistory[currentHistoryIndex];
            
            updateContent(sectionName);
            updateNavButtons();
        }
    }
    
    // Go forward in history
    function goForward() {
        if (currentHistoryIndex < navigationHistory.length - 1) {
            currentHistoryIndex++;
            const sectionName = navigationHistory[currentHistoryIndex];
            
            updateContent(sectionName);
            updateNavButtons();
        }
    }
    
    // Update content based on section
    function updateContent(sectionName) {
        // Update title
        const greetingTitle = document.querySelector('.greeting h2');
        if (greetingTitle) {
            greetingTitle.textContent = sectionName;
        }
        
        // Update content
        if (contentSections[sectionName]) {
            // Clear current content
            const contentContainer = document.querySelector('.content-grid');
            if (contentContainer) {
                // Save scroll position
                const scrollPos = mainContent.scrollTop;
                
                contentContainer.innerHTML = '';
                contentContainer.appendChild(contentSections[sectionName]);
                
                // Add event listeners to new elements
                addContentEventListeners();
                
                 // Reset scroll position
                mainContent.scrollTop = 0;
            }
        }
        // Update sidebar active state
        const sidebarLinks = document.querySelectorAll('.main-nav li');
        sidebarLinks.forEach(link => {
            const linkText = link.querySelector('a').textContent.trim();
            if (linkText === sectionName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Update navigation buttons state
    function updateNavButtons() {
        if (currentHistoryIndex <= 0) {
            disableButton(backBtn);
        } else {
            enableButton(backBtn);
        }
        
        if (currentHistoryIndex >= navigationHistory.length - 1) {
            disableButton(forwardBtn);
        } else {
            enableButton(forwardBtn);
        }
    }
    
    // Disable navigation buttons at init
    function disableBackForwardButtons() {
        disableButton(backBtn);
        disableButton(forwardBtn);
    }
    
    // Disable a button
    function disableButton(button) {
        if (button) {
            button.disabled = true;
            button.classList.add('disabled');
        }
    }
    
    // Enable a button
    function enableButton(button) {
        if (button) {
            button.disabled = false;
            button.classList.remove('disabled');
        }
    }
    
    // Add event listeners to content elements
    function addContentEventListeners() {
        // Add event listeners to play buttons
        const playBtns = document.querySelectorAll('.content-grid .play-btn');
        playBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Get card info
                const card = this.closest('.card');
                if (!card) return;
                
                const title = card.querySelector('h4').textContent;
                const subtitle = card.querySelector('p').textContent;
                const imgSrc = card.querySelector('img').src;
                
                // Update now playing
                Player.updateNowPlaying(title, subtitle, imgSrc);
                
                // Start playback if not already playing
                if (!Player.isPlaying) {
                    Player.togglePlayPause();
                }
            });
        });
        
        // Add event listeners to cards
        const cards = document.querySelectorAll('.content-grid .card');
        cards.forEach(card => {
            card.addEventListener('click', function() {
                // Get info for navigation
                const title = this.querySelector('h4').textContent;
                
                // Create and navigate to detail view
                navigateToDetailView(title, this);
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', function() {
                const playBtn = this.querySelector('.play-btn');
                if (playBtn) {
                    playBtn.style.opacity = '1';
                    playBtn.style.transform = 'translateY(0)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const playBtn = this.querySelector('.play-btn');
                if (playBtn) {
                    playBtn.style.opacity = '0';
                    playBtn.style.transform = 'translateY(8px)';
                }
            });
        });
    }
    
    // Navigate to a detail view
    function navigateToDetailView(title, sourceCard) {
        // Create a detail view for the selected item
        contentSections[title] = createDetailView(title, sourceCard);
        
        // Navigate to the new section
        navigateTo(title);
    }
    
    // Create home content
    function createHomeContent() {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="section">
                <div class="section-header">
                    <h3>Recently played</h3>
                    <a href="#" class="show-all">Show all</a>
                </div>
                <div class="card-grid">
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/FF0000/FFFFFF?text=Pop" alt="Playlist">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Pop Mix</h4>
                        <p>Drake, Justin Bieber, Ed Sheeran and more</p>
                    </div>
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/00FF00/FFFFFF?text=Rock" alt="Playlist">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Rock Classics</h4>
                        <p>Queen, AC/DC, Led Zeppelin and more</p>
                    </div>
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/0000FF/FFFFFF?text=Chill" alt="Playlist">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Chill Hits</h4>
                        <p>Billie Eilish, Khalid, Lauv and more</p>
                    </div>
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/FFFF00/000000?text=Workout" alt="Playlist">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Workout Mix</h4>
                        <p>Eminem, Kendrick Lamar, Drake and more</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">
                    <h3>Made For You</h3>
                    <a href="#" class="show-all">Show all</a>
                </div>
                <div class="card-grid">
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/FF00FF/FFFFFF?text=Daily1" alt="Daily Mix">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Daily Mix 1</h4>
                        <p>Personalized mix of music you love</p>
                    </div>
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/00FFFF/000000?text=Daily2" alt="Daily Mix">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Daily Mix 2</h4>
                        <p>Personalized mix of music you love</p>
                    </div>
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/FFFF00/000000?text=Discover" alt="Discover Weekly">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Discover Weekly</h4>
                        <p>New music based on your taste</p>
                    </div>
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/FF0000/FFFFFF?text=Release" alt="Release Radar">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Release Radar</h4>
                        <p>New releases from artists you follow</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">
                    <h3>Popular Albums</h3>
                    <a href="#" class="show-all">Show all</a>
                </div>
                <div class="card-grid">
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/333333/FFFFFF?text=Album1" alt="Album">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>After Hours</h4>
                        <p>The Weeknd</p>
                    </div>
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/666666/FFFFFF?text=Album2" alt="Album">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Future Nostalgia</h4>
                        <p>Dua Lipa</p>
                    </div>
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/999999/FFFFFF?text=Album3" alt="Album">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Hollywood's Bleeding</h4>
                        <p>Post Malone</p>
                    </div>
                    <div class="card">
                        <div class="card-img-container">
                            <img src="https://via.placeholder.com/150/CCCCCC/000000?text=Album4" alt="Album">
                            <button class="play-btn"><i class="fas fa-play"></i></button>
                        </div>
                        <h4>Fine Line</h4>
                        <p>Harry Styles</p>
                    </div>
                </div>
            </div>
        `;
        
        return content;
    }
    
    // Create search content
    function createSearchContent() {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="search-container">
                <div class="search-input-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" placeholder="What do you want to listen to?">
                </div>
                
                <div class="recent-searches">
                    <h3>Recent searches</h3>
                    <div class="recent-search-items">
                        <div class="recent-search-item">
                            <img src="https://via.placeholder.com/60/FF0000/FFFFFF?text=Drake" alt="Artist">
                            <span>Drake</span>
                            <span class="search-type">Artist</span>
                        </div>
                        <div class="recent-search-item">
                            <img src="https://via.placeholder.com/60/00FF00/FFFFFF?text=Pop" alt="Playlist">
                            <span>Pop Mix</span>
                            <span class="search-type">Playlist</span>
                        </div>
                        <div class="recent-search-item">
                            <img src="https://via.placeholder.com/60/0000FF/FFFFFF?text=EDM" alt="Genre">
                            <span>Electronic Dance</span>
                            <span class="search-type">Genre</span>
                        </div>
                    </div>
                </div>
                
                <div class="browse-all">
                    <h3>Browse all</h3>
                    <div class="category-grid">
                        <div class="category-item" style="background-color: #E13300;">
                            <h4>Podcasts</h4>
                            <img src="https://via.placeholder.com/80/E13300/FFFFFF?text=🎙️" alt="Podcasts">
                        </div>
                        <div class="category-item" style="background-color: #7358FF;">
                            <h4>Made For You</h4>
                            <img src="https://via.placeholder.com/80/7358FF/FFFFFF?text=👤" alt="Made For You">
                        </div>
                        <div class="category-item" style="background-color: #1E3264;">
                            <h4>Charts</h4>
                            <img src="https://via.placeholder.com/80/1E3264/FFFFFF?text=📊" alt="Charts">
                        </div>
                        <div class="category-item" style="background-color: #E8115B;">
                            <h4>New Releases</h4>
                            <img src="https://via.placeholder.com/80/E8115B/FFFFFF?text=🆕" alt="New Releases">
                        </div>
                        <div class="category-item" style="background-color: #B02897;">
                            <h4>Discover</h4>
                            <img src="https://via.placeholder.com/80/B02897/FFFFFF?text=🔍" alt="Discover">
                        </div>
                        <div class="category-item" style="background-color: #537AA1;">
                            <h4>Live Events</h4>
                            <img src="https://via.placeholder.com/80/537AA1/FFFFFF?text=🎫" alt="Live Events">
                        </div>
                        <div class="category-item" style="background-color: #509BF5;">
                            <h4>Pop</h4>
                            <img src="https://via.placeholder.com/80/509BF5/FFFFFF?text=🎵" alt="Pop">
                        </div>
                        <div class="category-item" style="background-color: #BC5900;">
                            <h4>Hip-Hop</h4>
                            <img src="https://via.placeholder.com/80/BC5900/FFFFFF?text=🎤" alt="Hip-Hop">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Style search container
        const searchContainer = content.querySelector('.search-container');
        
        // Style search input
        const searchInputContainer = content.querySelector('.search-input-container');
        searchInputContainer.style.position = 'relative';
        searchInputContainer.style.marginBottom = '24px';
        
        const searchIcon = content.querySelector('.search-icon');
        searchIcon.style.position = 'absolute';
        searchIcon.style.left = '12px';
        searchIcon.style.top = '12px';
        searchIcon.style.color = 'var(--text-subdued)';

        const searchInput = content.querySelector('.search-input');
        
