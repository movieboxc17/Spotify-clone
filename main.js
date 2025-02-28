document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Player.init();
    UI.init();
    Navigation.init();
    Modals.init();
    Notifications.init();
    ContextMenus.init();
    ConnectDevices.init();
    LibraryManager.init();
    SearchFeature.init();
    
    // Set up global app state
    const AppState = {
        currentTheme: 'dark',
        isOnline: true,
        userPremium: true
    };
    
    // Welcome notification
    setTimeout(() => {
        Notifications.show('Welcome to Spotify');
    }, 1000);
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Space bar for play/pause
            if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                Player.togglePlayPause();
            }
            
            // Arrow right for next
            if (e.code === 'ArrowRight' && document.activeElement.tagName !== 'INPUT') {
                Player.next();
            }
            
            // Arrow left for previous
            if (e.code === 'ArrowLeft' && document.activeElement.tagName !== 'INPUT') {
                Player.previous();
            }
            
            // M for mute
            if (e.code === 'KeyM' && document.activeElement.tagName !== 'INPUT') {
                Player.toggleMute();
            }
            
            // F for fullscreen
            if (e.code === 'KeyF' && document.activeElement.tagName !== 'INPUT') {
                UI.toggleFullscreen();
            }
            
            // L for like
            if (e.code === 'KeyL' && document.activeElement.tagName !== 'INPUT') {
                Player.toggleLike();
            }
            
            // S for shuffle
            if (e.code === 'KeyS' && document.activeElement.tagName !== 'INPUT') {
                Player.toggleShuffle();
            }
            
            // R for repeat
            if (e.code === 'KeyR' && document.activeElement.tagName !== 'INPUT') {
                Player.toggleRepeat();
            }
            
            // Ctrl+N for new playlist
            if (e.ctrlKey && e.code === 'KeyN') {
                e.preventDefault();
                Modals.showCreatePlaylistModal();
            }
        });
    }
});
