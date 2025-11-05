// Main app logic, routing, and state management

// Router
function navigateTo(route) {
    window.location.hash = route;
    handleRoute();
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || '';

    if (hash === '' || hash === 'campaign-chooser') {
        renderCampaignChooser();
    } else if (hash === 'prayer-feed') {
        renderPrayerFeed();
    } else if (hash.startsWith('prayer-fuel/')) {
        const parts = hash.split('/');
        if (parts.length === 3) {
            const campaignId = parts[1];
            const date = parts[2];
            renderPrayerFuel(campaignId, date);
        } else {
            navigateTo('#prayer-feed');
        }
    } else if (hash === 'campaigns') {
        renderCampaigns();
    } else if (hash === 'reminder-config') {
        renderReminderConfig();
    } else {
        // Default to campaign chooser
        navigateTo('#campaign-chooser');
    }
}

// Sidebar functions
function toggleSidebar() {
    const nav = document.getElementById('navigation');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger-menu');

    const isOpen = nav.classList.contains('open');

    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const nav = document.getElementById('navigation');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger-menu');

    nav.classList.add('open');
    overlay.classList.remove('hidden');
    hamburger.classList.add('active');
}

function closeSidebar() {
    const nav = document.getElementById('navigation');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger-menu');

    nav.classList.remove('open');
    overlay.classList.add('hidden');
    hamburger.classList.remove('active');
}

// Initialize app
function initApp() {
    // Set up hamburger menu
    document.getElementById('hamburger-menu').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });

    // Close sidebar when clicking overlay
    document.getElementById('sidebar-overlay').addEventListener('click', () => {
        closeSidebar();
    });

    // Set up navigation event listeners
    document.getElementById('nav-prayer-feed').addEventListener('click', () => {
        navigateTo('#prayer-feed');
        closeSidebar();
    });

    document.getElementById('nav-campaigns').addEventListener('click', () => {
        navigateTo('#campaigns');
        closeSidebar();
    });

    document.getElementById('nav-share').addEventListener('click', () => {
        alert('Share app functionality would be implemented here');
        closeSidebar();
    });

    document.getElementById('nav-language').addEventListener('change', (e) => {
        saveAppLanguage(e.target.value);
    });

    // Load saved app language
    const appLanguage = getAppLanguage();
    document.getElementById('nav-language').value = appLanguage;

    // Handle initial route
    const hash = window.location.hash.slice(1);
    const subscribed = getSubscribedCampaigns();

    if (subscribed.length === 0) {
        // No subscriptions - always go to campaign chooser
        if (!hash || hash === 'campaign-chooser') {
            handleRoute();
        } else {
            navigateTo('#campaign-chooser');
        }
    } else {
        // Has subscriptions - check if there's a hash, otherwise default to prayer feed
        if (hash) {
            handleRoute();
        } else {
            navigateTo('#prayer-feed');
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleRoute);
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

