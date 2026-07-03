class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                card: 'rgba(255, 255, 255, 0.95)',
                text: '#2d3748',
                border: '#e2e8f0'
            },
            dark: {
                background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                card: 'rgba(26, 32, 44, 0.95)',
                text: '#e2e8f0',
                border: '#4a5568'
            },
            ocean: {
                background: 'linear-gradient(135deg, #0066cc 0%, #003366 100%)',
                card: 'rgba(255, 255, 255, 0.9)',
                text: '#1a365d',
                border: '#bee3f8'
            },
            sunset: {
                background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
                card: 'rgba(255, 255, 255, 0.9)',
                text: '#744210',
                border: '#fbd38d'
            }
        };

        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(this.currentTheme);
        this.createThemeSelector();
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--theme-${key}`, value);
        });

        document.body.style.background = theme.background;
        document.querySelectorAll('.container, .payment-card, .success-card').forEach(el => {
            el.style.background = theme.card;
            el.style.color = theme.text;
        });

        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
            el.style.color = theme.text;
        });

        document.querySelectorAll('.form-group label').forEach(el => {
            el.style.color = theme.text;
        });

        localStorage.setItem('theme', themeName);
        this.currentTheme = themeName;
    }

    createThemeSelector() {
        const selector = document.createElement('div');
        selector.className = 'theme-selector';
        selector.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            gap: 8px;
            background: rgba(255,255,255,0.9);
            padding: 10px 15px;
            border-radius: 50px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
            z-index: 1000;
        `;

        const themes = [
            { name: 'light', emoji: '☀️', label: 'Light' },
            { name: 'dark', emoji: '🌙', label: 'Dark' },
            { name: 'ocean', emoji: '🌊', label: 'Ocean' },
            { name: 'sunset', emoji: '🌅', label: 'Sunset' }
        ];

        themes.forEach(({ name, emoji, label }) => {
            const btn = document.createElement('button');
            btn.textContent = emoji;
            btn.title = label;
            btn.style.cssText = `
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 2px solid ${name === this.currentTheme ? '#667eea' : 'transparent'};
                background: white;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.3s;
            `;
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
            btn.addEventListener('click', () => {
                this.applyTheme(name);
                // Update border of active theme
                selector.querySelectorAll('button').forEach(b => {
                    b.style.borderColor = 'transparent';
                });
                btn.style.borderColor = '#667eea';
                showNotification(`Theme changed to ${label}`, 'success');
            });
            selector.appendChild(btn);
        });

        document.body.appendChild(selector);
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if dark mode was previously set via old system
    if (localStorage.getItem('darkMode') === 'true') {
        localStorage.setItem('theme', 'dark');
    }
    
    // Initialize theme manager
    const themeManager = new ThemeManager();
    window.themeManager = themeManager;
});
