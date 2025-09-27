class SecureVault {
    constructor() {
        this.passwordMap = {
            'suku!@shubham': {
                file: 'suku.json',
                data: {
                    "welcomeMessage": "Suku's Private Vault",
                    "greeting": "Welcome back, Suku!",
                    "notes": [
                        {
                            "title": "Important Reminder",
                            "content": "Remember to complete the project documentation by Friday.",
                            "date": "2024-09-27"
                        },
                        {
                            "title": "Personal Goals",
                            "content": "Learn advanced JavaScript patterns and contribute to open source.",
                            "date": "2024-09-26"
                        },
                        {
                            "title": "Security Notes",
                            "content": "Always use strong, unique passwords for different services.",
                            "date": "2024-09-25"
                        }
                    ]
                }
            },
            'shubham!@shubham': {
                file: 'shubham.json',
                data: {
                    "welcomeMessage": "Shubham's Secret Space",
                    "greeting": "Hello Shubham! Your notes are secure.",
                    "notes": [
                        {
                            "title": "Project Ideas",
                            "content": "Develop a machine learning model for image recognition.",
                            "date": "2024-09-27"
                        },
                        {
                            "title": "Learning Resources",
                            "content": "Check out the new cybersecurity course on Coursera.",
                            "date": "2024-09-26"
                        },
                        {
                            "title": "Meeting Notes",
                            "content": "Team meeting scheduled for tomorrow at 2 PM.",
                            "date": "2024-09-25"
                        }
                    ]
                }
            }
        };
        
        this.maxAttempts = 5;
        this.attemptCount = 0;
        this.lockTime = 30000;

        this.initializeEventListeners();
        this.preloadContent();
    }

    initializeEventListeners() {
        const loginForm = document.getElementById('login-form');
        const togglePassword = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');
        const logoutBtn = document.getElementById('logout-btn');

        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        logoutBtn.addEventListener('click', () => this.handleLogout());

        passwordInput.addEventListener('input', () => this.clearError());
        
        // Enter key support
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('toggle-password');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.textContent = '🔒';
        } else {
            passwordInput.type = 'password';
            toggleButton.textContent = '👁️';
        }
    }

    async preloadContent() {
        // Preload any external content here if needed
        console.log('Content preloaded and ready');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        if (this.isLockedOut()) {
            this.showError('Too many failed attempts. Please wait 30 seconds.');
            return;
        }

        const password = document.getElementById('password').value.trim();
        const submitBtn = document.getElementById('submit-btn');
        const buttonText = submitBtn.querySelector('.button-text');
        const spinner = submitBtn.querySelector('.spinner');

        // Show loading state (minimal delay for UX)
        buttonText.classList.add('hidden');
        spinner.classList.add('active');
        submitBtn.disabled = true;

        // Minimal delay for better UX (150ms instead of 1000ms)
        await new Promise(resolve => setTimeout(resolve, 150));

        try {
            if (this.authenticate(password)) {
                await this.loadUserContent(password);
                this.startNewSession();
            } else {
                this.handleFailedAttempt();
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Authentication failed. Please try again.');
        } finally {
            buttonText.classList.remove('hidden');
            spinner.classList.remove('active');
            submitBtn.disabled = false;
        }
    }

    authenticate(password) {
        return this.passwordMap[password] !== undefined;
    }

    async loadUserContent(password) {
        const userConfig = this.passwordMap[password];
        
        try {
            // Try to load from embedded data first (instant)
            if (userConfig.data) {
                this.displayContent(userConfig.data);
                this.showContentScreen();
                return;
            }
            
            // Fallback to file loading if embedded data not available
            const response = await fetch(`data/${userConfig.file}`);
            if (!response.ok) throw new Error('File not found');
            
            const userData = await response.json();
            this.displayContent(userData);
            this.showContentScreen();
            
        } catch (error) {
            console.error('Error loading content:', error);
            // Show default content if both methods fail
            this.displayContent(this.getDefaultContent(password));
            this.showContentScreen();
        }
    }

    getDefaultContent(password) {
        const username = password.split('!@')[0];
        return {
            welcomeMessage: `${username.charAt(0).toUpperCase() + username.slice(1)}'s Private Vault`,
            greeting: `Welcome back, ${username}!`,
            notes: [
                {
                    "title": "Welcome to Your Secure Space",
                    "content": "This is your personal secure area. Add your custom content in the JSON file.",
                    "date": new Date().toISOString().split('T')[0]
                }
            ]
        };
    }

    displayContent(userData) {
        const contentArea = document.getElementById('content-area');
        const pageTitle = document.getElementById('page-title');
        
        pageTitle.textContent = userData.welcomeMessage || 'Welcome Back';
        
        // Add smooth transition
        contentArea.style.opacity = '0';
        
        setTimeout(() => {
            contentArea.innerHTML = `
                <div class="user-header">
                    <h2>${userData.greeting || 'Hello!'}</h2>
                    <p class="last-access">Last accessed: ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="note-grid">
                    ${userData.notes ? userData.notes.map(note => `
                        <div class="note-card">
                            <h3>${note.title}</h3>
                            <p>${note.content}</p>
                            ${note.date ? `<small class="note-date">${note.date}</small>` : ''}
                        </div>
                    `).join('') : '<p>No notes available.</p>'}
                </div>
                
                ${userData.additionalContent ? `
                    <div class="additional-content">
                        ${userData.additionalContent}
                    </div>
                ` : ''}
                
                <div class="quick-actions">
                    <button class="action-btn" onclick="this.classList.add('clicked')">🔄 Refresh</button>
                    <button class="action-btn" onclick="window.print()">🖨️ Print</button>
                </div>
            `;
            
            // Smooth fade in
            contentArea.style.opacity = '1';
        }, 50);
    }

    showContentScreen() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('content-screen').classList.add('active');
    }

    showLoginScreen() {
        document.getElementById('content-screen').classList.remove('active');
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
        this.clearError();
    }

    handleFailedAttempt() {
        this.attemptCount++;
        const remainingAttempts = this.maxAttempts - this.attemptCount;
        
        if (remainingAttempts > 0) {
            this.showError(`Invalid password. ${remainingAttempts} attempts remaining.`);
        } else {
            this.lockAccount();
            this.showError('Account temporarily locked. Please wait 30 seconds.');
        }
        
        // Shake animation for wrong password
        this.shakeLoginForm();
    }

    shakeLoginForm() {
        const loginForm = document.getElementById('login-form');
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 500);
    }

    isLockedOut() {
        const lockTime = localStorage.getItem('lockTime');
        if (lockTime && Date.now() - parseInt(lockTime) < this.lockTime) {
            return true;
        }
        localStorage.removeItem('lockTime');
        this.attemptCount = 0;
        return false;
    }

    lockAccount() {
        localStorage.setItem('lockTime', Date.now().toString());
        setTimeout(() => {
            localStorage.removeItem('lockTime');
            this.attemptCount = 0;
            this.clearError();
        }, this.lockTime);
    }

    startNewSession() {
        const sessionId = 'session_' + Date.now();
        sessionStorage.setItem('currentSession', sessionId);
        this.attemptCount = 0;
    }

    checkExistingSession() {
        this.showLoginScreen(); // Always require login for security
    }

    handleLogout() {
        sessionStorage.removeItem('currentSession');
        this.showLoginScreen();
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    clearError() {
        const errorDiv = document.getElementById('error-message');
        errorDiv.classList.add('hidden');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SecureVault();
});
