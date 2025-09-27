class SecureVault {
    constructor() {
        this.passwordMap = {
            'suku!@shubham': 'suku.json',
            'shubham!@shubham': 'shubham.json'
        };
        this.maxAttempts = 5;
        this.attemptCount = 0;
        this.lockTime = 30000;

        this.initializeEventListeners();
        this.checkExistingSession();
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

        // Show loading state
        buttonText.classList.add('hidden');
        spinner.classList.add('active');
        submitBtn.disabled = true;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            if (this.authenticate(password)) {
                await this.loadUserContent(password);
                this.startNewSession();
            } else {
                this.handleFailedAttempt();
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Authentication failed. Please check your password and try again.');
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
        const jsonFile = this.passwordMap[password];
        console.log('Loading file:', jsonFile);
        
        try {
            // Try to fetch from data folder first
            let response = await fetch(`data/${jsonFile}`);
            
            // If not found in data folder, try current directory
            if (!response.ok) {
                response = await fetch(jsonFile);
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const userData = await response.json();
            console.log('User data loaded:', userData);
            this.displayContent(userData);
            this.showContentScreen();
            
        } catch (error) {
            console.error('Error loading JSON:', error);
            // If JSON file doesn't exist, create default content
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
                    "content": "This is your personal secure area. Your JSON file will be loaded here once created.",
                    "date": new Date().toISOString().split('T')[0]
                },
                {
                    "title": "How to Add Your Content",
                    "content": "Create a JSON file with your notes in the data folder. The file should match your password mapping.",
                    "date": new Date().toISOString().split('T')[0]
                }
            ]
        };
    }

    displayContent(userData) {
        const contentArea = document.getElementById('content-area');
        const pageTitle = document.getElementById('page-title');
        
        pageTitle.textContent = userData.welcomeMessage || 'Welcome Back';
        
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
        `;
    }

    showContentScreen() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('content-screen').classList.add('active');
    }

    showLoginScreen() {
        document.getElementById('content-screen').classList.remove('active');
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('password').value = '';
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
        // Always show login screen for security
        this.showLoginScreen();
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
