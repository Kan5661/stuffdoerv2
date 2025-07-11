const configSetup = async () => {
    const config = await eel.read_config()()
    let useDark = false;

    if (config.theme === "dark") {
        useDark = true;
    } else if (config.theme === "system") {
        useDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    document.body.classList.toggle("darkTheme", useDark);

    updateAccentVariables(config.accent);
}

function updateAccentVariables(accent) {
    const root = document.documentElement;

    switch(accent) {
        case 'none':
            root.style.setProperty('--accentMain', 'inherit');
            root.style.setProperty('--accent2', 'inherit');
            break;
        case 'lavender':
            root.style.setProperty('--accentMain', 'rgb(204, 108, 190)');
            root.style.setProperty('--accent2', 'rgb(156, 34, 138)');
            break;
        case 'blue':
            root.style.setProperty('--accentMain', 'rgb(74, 144, 226)');
            root.style.setProperty('--accent2', 'rgb(30, 58, 138)');
            break;
        case 'green':
            root.style.setProperty('--accentMain', 'rgb(34, 197, 94)');
            root.style.setProperty('--accent2', 'rgb(21, 128, 61)');
            break;
        case 'orange':
            root.style.setProperty('--accentMain', 'rgb(249, 115, 22)');
            root.style.setProperty('--accent2', 'rgb(194, 65, 12)');
            break;
        default:
            root.style.setProperty('--accentMain', 'inherit');
            root.style.setProperty('--accent2', 'inherit');
    }
}
// SPA Navigation System
class SPARouter {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        // Handle navigation clicks
        document.querySelectorAll('.navLink').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('[data-page]')?.dataset.page;
                if (!page) return;
                this.navigateTo(page);
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = e.state ? e.state.page : 'home';
            this.showPage(page);
        });

        // Set initial state
        history.replaceState({ page: 'home' }, '', window.location.pathname);
    }

    navigateTo(page) {
        if (page === this.currentPage) return;

        this.showPage(page);
        history.pushState({ page: page }, '', window.location.pathname);
        console.log("set mode: ", page)
        eel.set_mode(page)()
    }

    showPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Remove active state from all nav links
        document.querySelectorAll('.navLink').forEach(link => {
            link.classList.remove('navSelected');
        });

        // Show selected page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Add active state to current nav link
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('navSelected');
        }

        this.currentPage = page;

        // Call page-specific initialization if needed
        this.initializePage(page);
    }

    initializePage(page) {
        // Initialize page-specific functionality
        switch(page) {
            case 'settings':
                // Initialize settings page if settings.js has init function
                if (typeof initializeSettings === 'function') {
                    initializeSettings();
                }
                break;
            case 'click':
                // Initialize click page if click.js has init function
                if (typeof initializeClick === 'function') {
                    initializeClick();
                }
                break;
            case 'text':
                // Initialize text page if text.js has init function
                if (typeof initializeText === 'function') {
                    initializeText();
                }
                break;
            case 'script':
                // Initialize script page if script.js has init function
                if (typeof initializeScript === 'function') {
                    initializeScript();
                }
                break;
        }
    }
}

// Initialize SPA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SPARouter();
});

configSetup()
