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
        searchInput.style.width = '100%';
        searchInput.style.padding = '12px 12px 12px 40px';
        searchInput.style.width = '100%';
        searchInput.style.padding = '12px 12px 12px 40px';
        searchInput.style.borderRadius = '4px';
        searchInput.style.border = 'none';
        searchInput.style.backgroundColor = 'white';
        searchInput.style.color = 'black';
        searchInput.style.fontSize = '14px';
        
        // Style recent searches
        const recentSearches = content.querySelector('.recent-searches');
        recentSearches.style.marginBottom = '32px';
        
        recentSearches.querySelector('h3').style.marginBottom = '16px';
        recentSearches.querySelector('h3').style.fontSize = '16px';
        
        const recentSearchItems = content.querySelectorAll('.recent-search-item');
        recentSearchItems.forEach(item => {
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.padding = '8px';
            item.style.marginBottom = '8px';
            item.style.borderRadius = '4px';
            item.style.cursor = 'pointer';
            item.style.transition = 'background-color 0.2s ease';
            
            const img = item.querySelector('img');
            img.style.width = '48px';
            img.style.height = '48px';
            img.style.borderRadius = '50%';
            img.style.marginRight = '12px';
            
            const searchType = item.querySelector('.search-type');
            searchType.style.marginLeft = 'auto';
            searchType.style.fontSize = '12px';
            searchType.style.color = 'var(--text-subdued)';
            
            // Add hover effect
            item.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            item.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });
        });
        
        // Style categories
        const browseAll = content.querySelector('.browse-all');
        browseAll.querySelector('h3').style.marginBottom = '16px';
        browseAll.querySelector('h3').style.fontSize = '16px';
        
        const categoryGrid = content.querySelector('.category-grid');
        categoryGrid.style.display = 'grid';
        categoryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
        categoryGrid.style.gap = '24px';
        
        const categoryItems = content.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.style.position = 'relative';
            item.style.borderRadius = '8px';
            item.style.padding = '16px';
            item.style.overflow = 'hidden';
            item.style.height = '180px';
            item.style.cursor = 'pointer';
            item.style.transition = 'all 0.3s ease';
            
            const heading = item.querySelector('h4');
            heading.style.fontSize = '20px';
            heading.style.fontWeight = '700';
            heading.style.marginBottom = '0';
            heading.style.position = 'relative';
            heading.style.zIndex = '1';
            
            const img = item.querySelector('img');
            img.style.position = 'absolute';
            img.style.bottom = '0';
            img.style.right = '0';
            img.style.transform = 'rotate(25deg) translate(18%, -2%)';
            img.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.5)';
            
            // Add hover effect
            item.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // Add search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 0) {
                // Show search results (mock functionality)
                const existingResults = content.querySelector('.search-results');
                if (!existingResults) {
                    showSearchResults(content, searchTerm);
                }
            } else {
                // Hide search results if input is empty
                const existingResults = content.querySelector('.search-results');
                if (existingResults) {
                    existingResults.remove();
                }
            }
        });
        
        return content;
    }
    
    // Show search results
    function showSearchResults(container, searchTerm) {
        // Remove existing results if any
        const existingResults = container.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
        
        // Hide other sections
        container.querySelector('.recent-searches').style.display = 'none';
        container.querySelector('.browse-all').style.display = 'none';
        
        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.classList.add('search-results');
        
        // Mock search results
        resultsContainer.innerHTML = `
            <h3>Top results for "${searchTerm}"</h3>
            <div class="top-result">
                <img src="https://via.placeholder.com/120/FF0000/FFFFFF?text=${searchTerm.charAt(0).toUpperCase()}" alt="Top result">
                <h4>${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)}</h4>
                <span class="result-type">Artist</span>
                <button class="play-btn"><i class="fas fa-play"></i></button>
            </div>
            
            <h3>Songs</h3>
            <div class="search-songs-list">
                <div class="song-row">
                    <div class="song-number">1</div>
                    <img src="https://via.placeholder.com/50/FF0000/FFFFFF?text=${searchTerm.charAt(0).toUpperCase()}" alt="Song">
                    <div class="song-info">
                        <div class="song-title">Song with ${searchTerm}</div>
                        <div class="song-artist">Popular Artist</div>
                    </div>
                    <div class="song-duration">3:45</div>
                </div>
                <div class="song-row">
                    <div class="song-number">2</div>
                    <img src="https://via.placeholder.com/50/00FF00/FFFFFF?text=${searchTerm.charAt(0).toUpperCase()}" alt="Song">
                    <div class="song-info">
                        <div class="song-title">${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Beat</div>
                        <div class="song-artist">Another Artist</div>
                    </div>
                    <div class="song-duration">4:20</div>
                </div>
                <div class="song-row">
                    <div class="song-number">3</div>
                    <img src="https://via.placeholder.com/50/0000FF/FFFFFF?text=${searchTerm.charAt(0).toUpperCase()}" alt="Song">
                    <div class="song-info">
                        <div class="song-title">Best of ${searchTerm}</div>
                        <div class="song-artist">Top Artist</div>
                    </div>
                    <div class="song-duration">3:22</div>
                </div>
            </div>
            
            <h3>Albums</h3>
            <div class="search-album-grid">
                <div class="card">
                    <div class="card-img-container">
                        <img src="https://via.placeholder.com/150/FF5500/FFFFFF?text=Album" alt="Album">
                        <button class="play-btn"><i class="fas fa-play"></i></button>
                    </div>
                    <h4>${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Hits</h4>
                    <p>Various Artists</p>
                </div>
                <div class="card">
                    <div class="card-img-container">
                        <img src="https://via.placeholder.com/150/5500FF/FFFFFF?text=Album" alt="Album">
                        <button class="play-btn"><i class="fas fa-play"></i></button>
                    </div>
                    <h4>The ${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Album</h4>
                    <p>Featured Artist</p>
                </div>
            </div>
        `;
        
        // Style results
        resultsContainer.style.animation = 'fadeIn 0.3s ease';
        
        const topResult = resultsContainer.querySelector('.top-result');
        topResult.style.display = 'flex';
        topResult.style.flexDirection = 'column';
        topResult.style.alignItems = 'center';
        topResult.style.padding = '24px';
        topResult.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        topResult.style.borderRadius = '8px';
        topResult.style.maxWidth = '200px';
        topResult.style.position = 'relative';
        topResult.style.marginBottom = '32px';
        
        topResult.querySelector('img').style.width = '120px';
        topResult.querySelector('img').style.height = '120px';
        topResult.querySelector('img').style.borderRadius = '50%';
        topResult.querySelector('img').style.marginBottom = '16px';
        
        topResult.querySelector('h4').style.marginBottom = '4px';
        topResult.querySelector('h4').style.fontSize = '24px';
        
        topResult.querySelector('.result-type').style.color = 'var(--text-subdued)';
        topResult.querySelector('.result-type').style.fontSize = '14px';
        
        const topResultPlayBtn = topResult.querySelector('.play-btn');
        topResultPlayBtn.style.position = 'absolute';
        topResultPlayBtn.style.bottom = '24px';
        topResultPlayBtn.style.right = '24px';
        topResultPlayBtn.style.width = '48px';
        topResultPlayBtn.style.height = '48px';
        topResultPlayBtn.style.borderRadius = '50%';
        topResultPlayBtn.style.backgroundColor = 'var(--spotify-green)';
        topResultPlayBtn.style.color = 'white';
        topResultPlayBtn.style.border = 'none';
        topResultPlayBtn.style.display = 'flex';
        topResultPlayBtn.style.justifyContent = 'center';
        topResultPlayBtn.style.alignItems = 'center';
        topResultPlayBtn.style.cursor = 'pointer';
        topResultPlayBtn.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        
        // Style song rows
        const songRows = resultsContainer.querySelectorAll('.song-row');
        songRows.forEach((row, index) => {
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.padding = '8px';
            row.style.marginBottom = '8px';
            row.style.borderRadius = '4px';
            row.style.cursor = 'pointer';
            row.style.transition = 'background-color 0.2s ease';
            
            row.querySelector('.song-number').style.width = '24px';
            row.querySelector('.song-number').style.color = 'var(--text-subdued)';
            row.querySelector('.song-number').style.fontSize = '14px';
            
            row.querySelector('img').style.width = '40px';
            row.querySelector('img').style.height = '40px';
            row.querySelector('img').style.marginRight = '16px';
            row.querySelector('img').style.marginLeft = '16px';
            
            row.querySelector('.song-info').style.flex = '1';
            
            row.querySelector('.song-title').style.fontSize = '16px';
            row.querySelector('.song-title').style.marginBottom = '4px';
            
            row.querySelector('.song-artist').style.fontSize = '14px';
            row.querySelector('.song-artist').style.color = 'var(--text-subdued)';
            
            row.querySelector('.song-duration').style.fontSize = '14px';
            row.querySelector('.song-duration').style.color = 'var(--text-subdued)';
            
            // Add hover effect
            row.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            row.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            // Add click functionality
            row.addEventListener('click', function() {
                const title = this.querySelector('.song-title').textContent;
                const artist = this.querySelector('.song-artist').textContent;
                const imgSrc = this.querySelector('img').src;
                
                Player.updateNowPlaying(title, artist, imgSrc);
                Player.togglePlayPause();
            });
        });
        
        // Style album grid
        const albumGrid = resultsContainer.querySelector('.search-album-grid');
        albumGrid.style.display = 'grid';
        albumGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
        albumGrid.style.gap = '24px';
        
        container.appendChild(resultsContainer);
    }
    
    // Create library content
    function createLibraryContent() {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="library-container">
                <div class="library-header">
                    <div class="library-filters">
                        <button class="filter-btn active">Playlists</button>
                        <button class="filter-btn">Artists</button>
                        <button class="filter-btn">Albums</button>
                        <button class="filter-btn">Podcasts</button>
                    </div>
                    <div class="library-sort">
                        <button class="sort-btn">
                            <i class="fas fa-sort"></i>
                            <span>Recents</span>
                        </button>
                    </div>
                </div>
                
                <div class="library-grid">
                    <div class="library-item create-playlist">
                        <div class="create-playlist-btn">
                            <i class="fas fa-plus"></i>
                        </div>
                        <h4>Create Playlist</h4>
                    </div>
                    <div class="library-item">
                        <img src="https://via.placeholder.com/150/1DB954/FFFFFF?text=Liked" alt="Playlist">
                        <h4>Liked Songs</h4>
                        <p>Playlist • 128 songs</p>
                    </div>
                    <div class="library-item">
                    <img src="https://via.placeholder.com/150/FF0000/FFFFFF?text=2023" alt="Playlist">
                        <h4>Top Hits 2023</h4>
                        <p>Playlist • 50 songs</p>
                    </div>
                    <div class="library-item">
                        <img src="https://via.placeholder.com/150/0000FF/FFFFFF?text=Chill" alt="Playlist">
                        <h4>Chill Vibes</h4>
                        <p>Playlist • 76 songs</p>
                    </div>
                    <div class="library-item">
                        <img src="https://via.placeholder.com/150/00FF00/FFFFFF?text=Workout" alt="Playlist">
                        <h4>Workout Mix</h4>
                        <p>Playlist • 42 songs</p>
                    </div>
                    <div class="library-item">
                        <img src="https://via.placeholder.com/150/FFA500/FFFFFF?text=Retro" alt="Playlist">
                        <h4>Retro Classics</h4>
                        <p>Playlist • 93 songs</p>
                    </div>
                    <div class="library-item">
                        <img src="https://via.placeholder.com/150/800080/FFFFFF?text=Rock" alt="Playlist">
                        <h4>Rock Anthems</h4>
                        <p>Playlist • 67 songs</p>
                    </div>
                    <div class="library-item">
                        <img src="https://via.placeholder.com/150/008080/FFFFFF?text=Focus" alt="Playlist">
                        <h4>Focus Flow</h4>
                        <p>Playlist • 35 songs</p>
                    </div>
                </div>
            </div>
        `;
        
        // Style library container
        const libraryContainer = content.querySelector('.library-container');
        
        // Style library header
        const libraryHeader = content.querySelector('.library-header');
        libraryHeader.style.display = 'flex';
        libraryHeader.style.justifyContent = 'space-between';
        libraryHeader.style.alignItems = 'center';
        libraryHeader.style.marginBottom = '24px';
        
        // Style filter buttons
        const filterBtns = content.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            btn.style.border = 'none';
            btn.style.borderRadius = '20px';
            btn.style.padding = '8px 16px';
            btn.style.marginRight = '8px';
            btn.style.fontSize = '14px';
            btn.style.color = 'var(--text-base)';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'all 0.2s ease';
            
            // Add click functionality
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Style active filter
        content.querySelector('.filter-btn.active').style.backgroundColor = 'white';
        content.querySelector('.filter-btn.active').style.color = 'black';
        
        // Style sort button
        const sortBtn = content.querySelector('.sort-btn');
        sortBtn.style.display = 'flex';
        sortBtn.style.alignItems = 'center';
        sortBtn.style.backgroundColor = 'transparent';
        sortBtn.style.border = 'none';
        sortBtn.style.color = 'var(--text-base)';
        sortBtn.style.cursor = 'pointer';
        
        sortBtn.querySelector('i').style.marginRight = '8px';
        
        // Style library grid
        const libraryGrid = content.querySelector('.library-grid');
        libraryGrid.style.display = 'grid';
        libraryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
        libraryGrid.style.gap = '24px';
        
        // Style library items
        const libraryItems = content.querySelectorAll('.library-item');
        libraryItems.forEach(item => {
            item.style.borderRadius = '8px';
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            item.style.padding = '16px';
            item.style.transition = 'all 0.3s ease';
            item.style.cursor = 'pointer';
            
            if (!item.classList.contains('create-playlist')) {
                const img = item.querySelector('img');
                img.style.width = '100%';
                img.style.aspectRatio = '1';
                img.style.objectFit = 'cover';
                img.style.marginBottom = '16px';
                img.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
            }
            
            const heading = item.querySelector('h4');
            heading.style.fontSize = '16px';
            heading.style.fontWeight = '700';
            heading.style.marginBottom = '4px';
            heading.style.whiteSpace = 'nowrap';
            heading.style.overflow = 'hidden';
            heading.style.textOverflow = 'ellipsis';
            
            const paragraph = item.querySelector('p');
            if (paragraph) {
                paragraph.style.fontSize = '14px';
                paragraph.style.color = 'var(--text-subdued)';
                paragraph.style.margin = '0';
            }
            
            // Add hover effect
            item.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                this.style.transform = 'translateY(-4px)';
            });
            
            item.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                this.style.transform = 'translateY(0)';
            });
            
            // Add click functionality
            item.addEventListener('click', function() {
                if (this.classList.contains('create-playlist')) {
                    navigateTo('Create Playlist');
                } else if (item.querySelector('h4').textContent === 'Liked Songs') {
                    navigateTo('Liked Songs');
                } else {
                    // Get playlist name and navigate to detail view
                    const title = this.querySelector('h4').textContent;
                    navigateToDetailView(title, this);
                }
            });
        });
        
        // Style create playlist button
        const createPlaylist = content.querySelector('.create-playlist');
        createPlaylist.style.display = 'flex';
        createPlaylist.style.flexDirection = 'column';
        createPlaylist.style.alignItems = 'center';
        createPlaylist.style.justifyContent = 'center';
        
        const createBtn = createPlaylist.querySelector('.create-playlist-btn');
        createBtn.style.width = '64px';
        createBtn.style.height = '64px';
        createBtn.style.borderRadius = '50%';
        createBtn.style.backgroundColor = 'white';
        createBtn.style.display = 'flex';
        createBtn.style.alignItems = 'center';
        createBtn.style.justifyContent = 'center';
        createBtn.style.marginBottom = '16px';
        
        createBtn.querySelector('i').style.fontSize = '24px';
        createBtn.querySelector('i').style.color = 'black';
        
        return content;
    }
    
    // Create empty playlist content
    function createEmptyPlaylistContent() {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="create-playlist-container">
                <div class="playlist-info">
                    <div class="playlist-img-placeholder">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="playlist-details">
                        <div class="playlist-type">Playlist</div>
                        <h1 class="playlist-title">My Playlist #1</h1>
                        <div class="playlist-description">
                            <input type="text" placeholder="Add a description" class="description-input">
                        </div>
                        <div class="playlist-meta">
                            <span class="username">Your Username</span>
                            <span class="songs-count">0 songs</span>
                        </div>
                    </div>
                </div>
                
                <div class="empty-playlist-message">
                    <h2>Let's find something for your playlist</h2>
                    <div class="search-container">
                        <input type="text" placeholder="Search for songs or episodes" class="playlist-search">
                    </div>
                </div>
            </div>
        `;
        
        // Style create playlist container
        const createPlaylistContainer = content.querySelector('.create-playlist-container');
        
        // Style playlist info
        const playlistInfo = content.querySelector('.playlist-info');
        playlistInfo.style.display = 'flex';
        playlistInfo.style.alignItems = 'flex-end';
        playlistInfo.style.padding = '32px';
        playlistInfo.style.marginBottom = '24px';
        playlistInfo.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        
        // Style playlist image placeholder
        const imgPlaceholder = content.querySelector('.playlist-img-placeholder');
        imgPlaceholder.style.width = '232px';
        imgPlaceholder.style.height = '232px';
        imgPlaceholder.style.backgroundColor = '#282828';
        imgPlaceholder.style.display = 'flex';
        imgPlaceholder.style.alignItems = 'center';
        imgPlaceholder.style.justifyContent = 'center';
        imgPlaceholder.style.marginRight = '24px';
        imgPlaceholder.style.boxShadow = '0 4px 60px rgba(0, 0, 0, 0.5)';
        
        imgPlaceholder.querySelector('i').style.fontSize = '64px';
        imgPlaceholder.querySelector('i').style.color = '#7f7f7f';
        
        // Style playlist details
        const playlistDetails = content.querySelector('.playlist-details');
        
        playlistDetails.querySelector('.playlist-type').style.fontSize = '14px';
        playlistDetails.querySelector('.playlist-type').style.fontWeight = '700';
        playlistDetails.querySelector('.playlist-type').style.marginBottom = '8px';
        
        playlistDetails.querySelector('.playlist-title').style.fontSize = '96px';
        playlistDetails.querySelector('.playlist-title').style.fontWeight = '900';
        playlistDetails.querySelector('.playlist-title').style.marginBottom = '12px';
        playlistDetails.querySelector('.playlist-title').style.marginTop = '0';
        
        // Style description input
        const descriptionInput = content.querySelector('.description-input');
        descriptionInput.style.backgroundColor = 'transparent';
        descriptionInput.style.border = 'none';
        descriptionInput.style.borderBottom = '1px solid transparent';
        descriptionInput.style.color = 'var(--text-subdued)';
        descriptionInput.style.fontSize = '14px';
        descriptionInput.style.padding = '4px 0';
        descriptionInput.style.marginBottom = '8px';
        descriptionInput.style.width = '100%';
        descriptionInput.style.outline = 'none';
        descriptionInput.style.transition = 'border-color 0.2s ease';
        
        descriptionInput.addEventListener('focus', function() {
            this.style.borderColor = 'white';
        });
        
        descriptionInput.addEventListener('blur', function() {
            this.style.borderColor = 'transparent';
        });
        
        // Style playlist meta
        const playlistMeta = content.querySelector('.playlist-meta');
        playlistMeta.style.fontSize = '14px';
        playlistMeta.style.color = 'var(--text-subdued)';
        
        playlistMeta.querySelector('.username').style.fontWeight = '700';
        playlistMeta.querySelector('.songs-count').style.marginLeft = '4px';
        playlistMeta.querySelector('.songs-count').style.display = 'inline-block';
        
        playlistMeta.querySelector('.songs-count').style.marginLeft = '4px';
        playlistMeta.querySelector('.songs-count').style.position = 'relative';
        playlistMeta.querySelector('.songs-count').style.paddingLeft = '12px';
        
        // Add separator dot
        const separator = document.createElement('span');
        separator.textContent = '•';
        separator.style.position = 'absolute';
        separator.style.left = '4px';
        playlistMeta.querySelector('.songs-count').prepend(separator);
        
        // Style empty playlist message
        const emptyMessage = content.querySelector('.empty-playlist-message');
        emptyMessage.style.display = 'flex';
        emptyMessage.style.flexDirection = 'column';
        emptyMessage.style.alignItems = 'center';
        emptyMessage.style.padding = '48px 0';
        
        emptyMessage.querySelector('h2').style.fontSize = '24px';
        emptyMessage.querySelector('h2').style.fontWeight = '700';
        emptyMessage.querySelector('h2').style.marginBottom = '32px';
        
        // Style search container
        const searchContainer = content.querySelector('.search-container');
        searchContainer.style.width = '100%';
        searchContainer.style.maxWidth = '400px';
        
        const playlistSearch = content.querySelector('.playlist-search');
        playlistSearch.style.width = '100%';
        playlistSearch.style.padding = '12px 16px';
        playlistSearch.style.borderRadius = '4px';
        playlistSearch.style.border = 'none';
        playlistSearch.style.backgroundColor = 'white';
        playlistSearch.style.fontSize = '14px';
        playlistSearch.style.color = 'black';
        
        return content;
    }
    
    // Create liked songs content
    function createLikedSongsContent() {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="liked-songs-container">
                <div class="playlist-info">
                    <div class="playlist-img">
                        <div class="liked-songs-icon">
                            <i class="fas fa-heart"></i>
                        </div>
                    </div>
                    <div class="playlist-details">
                        <div class="playlist-type">Playlist</div>
                        <h1 class="playlist-title">Liked Songs</h1>
                        <div class="playlist-meta">
                            <span class="username">Your Username</span>
                            <span class="songs-count">128 songs</span>
                        </div>
                    </div>
                </div>
                
                <div class="playlist-controls">
                <button class="play-btn"><i class="fas fa-play"></i></button>
                    <button class="like-btn"><i class="fas fa-heart"></i></button>
                    <div class="playlist-options">
                        <button class="options-btn"><i class="fas fa-ellipsis-h"></i></button>
                    </div>
                </div>
                
                <div class="songs-table">
                    <div class="songs-header">
                        <div class="col-num">#</div>
                        <div class="col-title">Title</div>
                        <div class="col-album">Album</div>
                        <div class="col-date">Date Added</div>
                        <div class="col-duration"><i class="far fa-clock"></i></div>
                    </div>
                    
                    <div class="songs-list">
                        ${generateLikedSongs()}
                    </div>
                </div>
            </div>
        `;
        
        // Create sample liked songs
        function generateLikedSongs() {
            const songs = [
                { num: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', date: '2 days ago', duration: '3:20' },
                { num: '2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', date: '3 days ago', duration: '3:23' },
                { num: '3', title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', date: '5 days ago', duration: '3:35' },
                { num: '4', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', date: '1 week ago', duration: '2:58' },
                { num: '5', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', album: 'F*CK LOVE 3: OVER YOU', date: '1 week ago', duration: '2:21' },
                { num: '6', title: 'Bad Habits', artist: 'Ed Sheeran', album: '=', date: '2 weeks ago', duration: '3:50' },
                { num: '7', title: 'Montero (Call Me By Your Name)', artist: 'Lil Nas X', album: 'MONTERO', date: '3 weeks ago', duration: '2:17' },
                { num: '8', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', date: '1 month ago', duration: '3:18' },
                { num: '9', title: 'Kiss Me More', artist: 'Doja Cat ft. SZA', album: 'Planet Her', date: '1 month ago', duration: '3:28' },
                { num: '10', title: 'Butter', artist: 'BTS', album: 'Butter', date: '2 months ago', duration: '2:42' }
            ];
            
            return songs.map(song => `
                <div class="song-row">
                    <div class="col-num">${song.num}</div>
                    <div class="col-title">
                        <div class="song-title-info">
                            <div class="song-title">${song.title}</div>
                            <div class="song-artist">${song.artist}</div>
                        </div>
                    </div>
                    <div class="col-album">${song.album}</div>
                    <div class="col-date">${song.date}</div>
                    <div class="col-duration">${song.duration}</div>
                </div>
            `).join('');
        }
        
        // Style liked songs container
        const likedSongsContainer = content.querySelector('.liked-songs-container');
        
        // Style playlist info
        const playlistInfo = content.querySelector('.playlist-info');
        playlistInfo.style.display = 'flex';
        playlistInfo.style.alignItems = 'flex-end';
        playlistInfo.style.padding = '32px';
        playlistInfo.style.marginBottom = '24px';
        playlistInfo.style.background = 'linear-gradient(to bottom, #5038A0, rgba(80, 56, 160, 0.6))';
        
        // Style playlist image
        const playlistImg = content.querySelector('.playlist-img');
        playlistImg.style.width = '232px';
        playlistImg.style.height = '232px';
        playlistImg.style.marginRight = '24px';
        playlistImg.style.boxShadow = '0 4px 60px rgba(0, 0, 0, 0.5)';
        
        // Style liked songs icon
        const likedSongsIcon = content.querySelector('.liked-songs-icon');
        likedSongsIcon.style.width = '100%';
        likedSongsIcon.style.height = '100%';
        likedSongsIcon.style.background = 'linear-gradient(135deg, #450af5, #c4efd9)';
        likedSongsIcon.style.display = 'flex';
        likedSongsIcon.style.alignItems = 'center';
        likedSongsIcon.style.justifyContent = 'center';
        
        likedSongsIcon.querySelector('i').style.fontSize = '96px';
        likedSongsIcon.querySelector('i').style.color = 'white';
        
        // Style playlist details
        const playlistDetails = content.querySelector('.playlist-details');
        
        playlistDetails.querySelector('.playlist-type').style.fontSize = '14px';
        playlistDetails.querySelector('.playlist-type').style.fontWeight = '700';
        playlistDetails.querySelector('.playlist-type').style.marginBottom = '8px';
        
        playlistDetails.querySelector('.playlist-title').style.fontSize = '96px';
        playlistDetails.querySelector('.playlist-title').style.fontWeight = '900';
        playlistDetails.querySelector('.playlist-title').style.marginBottom = '12px';
        playlistDetails.querySelector('.playlist-title').style.marginTop = '0';
        
        // Style playlist meta
        const playlistMeta = content.querySelector('.playlist-meta');
        playlistMeta.style.fontSize = '14px';
        
        playlistMeta.querySelector('.username').style.fontWeight = '700';
        
        playlistMeta.querySelector('.songs-count').style.position = 'relative';
        playlistMeta.querySelector('.songs-count').style.paddingLeft = '12px';
        
        // Add separator dot
        const separator = document.createElement('span');
        separator.textContent = '•';
        separator.style.position = 'absolute';
        separator.style.left = '4px';
        playlistMeta.querySelector('.songs-count').prepend(separator);
        
        // Style playlist controls
        const playlistControls = content.querySelector('.playlist-controls');
        playlistControls.style.display = 'flex';
        playlistControls.style.alignItems = 'center';
        playlistControls.style.padding = '24px 32px';
        
        // Style play button
        const playBtn = content.querySelector('.play-btn');
        playBtn.style.width = '56px';
        playBtn.style.height = '56px';
        playBtn.style.borderRadius = '50%';
        playBtn.style.backgroundColor = 'var(--spotify-green)';
        playBtn.style.color = 'black';
        playBtn.style.border = 'none';
        playBtn.style.display = 'flex';
        playBtn.style.alignItems = 'center';
        playBtn.style.justifyContent = 'center';
        playBtn.style.marginRight = '32px';
        playBtn.style.cursor = 'pointer';
        playBtn.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        
        playBtn.querySelector('i').style.fontSize = '24px';
        playBtn.querySelector('i').style.marginLeft = '3px'; // Center the play icon
        
        // Add play button functionality
        playBtn.addEventListener('click', function() {
            // Toggle play state
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                Player.togglePlayPause();
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                Player.togglePlayPause();
            }
        });
        
        // Style like button
        const likeBtn = content.querySelector('.like-btn');
        likeBtn.style.backgroundColor = 'transparent';
        likeBtn.style.border = 'none';
        likeBtn.style.color = 'var(--spotify-green)';
        likeBtn.style.fontSize = '24px';
        likeBtn.style.marginRight = '24px';
        likeBtn.style.cursor = 'pointer';
        
        // Style options button
        const optionsBtn = content.querySelector('.options-btn');
        optionsBtn.style.backgroundColor = 'transparent';
        optionsBtn.style.border = 'none';
        optionsBtn.style.color = 'var(--text-subdued)';
        optionsBtn.style.fontSize = '24px';
        optionsBtn.style.cursor = 'pointer';
        
        // Style songs table
        const songsTable = content.querySelector('.songs-table');
        songsTable.style.padding = '0 32px';
        
        // Style songs header
        const songsHeader = content.querySelector('.songs-header');
        songsHeader.style.display = 'grid';
        songsHeader.style.gridTemplateColumns = '16px 4fr 3fr 2fr 1fr';
        songsHeader.style.gap = '16px';
        songsHeader.style.padding = '0 16px 8px 16px';
        songsHeader.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        songsHeader.style.color = 'var(--text-subdued)';
        songsHeader.style.fontSize = '14px';
        
        // Style song rows
        const songRows = content.querySelectorAll('.song-row');
        songRows.forEach(row => {
            row.style.display = 'grid';
            row.style.gridTemplateColumns = '16px 4fr 3fr 2fr 1fr';
            row.style.gap = '16px';
            row.style.padding = '16px';
            row.style.borderRadius = '4px';
            row.style.cursor = 'pointer';
            row.style.transition = 'background-color 0.2s ease';
            
            // Style title info
            const titleInfo = row.querySelector('.song-title-info');
            titleInfo.style.display = 'flex';
            titleInfo.style.flexDirection = 'column';
            
            row.querySelector('.song-title').style.fontSize = '16px';
            row.querySelector('.song-title').style.marginBottom = '4px';
            
            row.querySelector('.song-artist').style.fontSize = '14px';
            row.querySelector('.song-artist').style.color = 'var(--text-subdued)';
            
            // Style other columns
            row.querySelector('.col-album').style.color = 'var(--text-subdued)';
            row.querySelector('.col-date').style.color = 'var(--text-subdued)';
            row.querySelector('.col-duration').style.color = 'var(--text-subdued)';
            
            // Add hover effect
            row.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            row.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            // Add click functionality
            row.addEventListener('click', function() {
                const title = this.querySelector('.song-title').textContent;
                const artist = this.querySelector('.song-artist').textContent;
                
                // Create a random color for placeholder image
                const randomColor = Math.floor(Math.random()*16777215).toString(16);
                const imgSrc = `https://via.placeholder.com/60/${randomColor}/FFFFFF?text=${title.charAt(0)}`;
                
                Player.updateNowPlaying(title, artist, imgSrc);
                Player.togglePlayPause();
            });
        });
        
        return content;
    }
    
    // Create a detail view for a selected item
    function createDetailView(title, sourceCard) {
        const content = document.createElement('div');
        const isAlbum = sourceCard.querySelector('p').textContent.includes('Album') || 
                       !sourceCard.querySelector('p').textContent.includes('Playlist');
        
        // Extract image and subtitle
        const imgSrc = sourceCard.querySelector('img').src;
        const subtitle = sourceCard.querySelector('p').textContent;
        
        content.innerHTML = `
            <div class="detail-container">
                <div class="detail-header">
                    <div class="detail-img">
                        <img src="${imgSrc}" alt="${title}">
                    </div>
                    <div class="detail-info">
                        <div class="detail-type">${isAlbum ? 'Album' : 'Playlist'}</div>
                        <h1 class="detail-title">${title}</h1>
                        <div class="detail-description">${subtitle}</div>
                        <div class="detail-meta">
                            <span class="detail-owner">${isAlbum ? subtitle.split(' • ')[0] : 'Spotify'}</span>
                            <span class="detail-songs-count">10 songs</span>
                            <span class="detail-duration">35 min 12 sec</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-controls">
                    <button class="play-btn"><i class="fas fa-play"></i></button>
                    <button class="like-btn"><i class="far fa-heart"></i></button>
                    <button class="download-btn"><i class="fas fa-arrow-down"></i></button>
                    <div class="detail-options">
                        <button class="options-btn"><i class="fas fa-ellipsis-h"></i></button>
                    </div>
                </div>
                
                <div class="songs-table">
                    <div class="songs-header">
                        <div class="col-num">#</div>
                        <div class="col-title">Title</div>
                        ${isAlbum ? '' : '<div class="col-album">Album</div>'}
                        <div class="col-date">Date Added</div>
                        <div class="col-duration"><i class="far fa-clock"></i></div>
                    </div>
                    
                    <div class="songs-list">
                        ${generateDetailSongs(isAlbum)}
                    </div>
                </div>

                
                
                
        
