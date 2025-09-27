class SecureVault {
    constructor() {
        this.passwordMap = {
            'suku!@shubham': 'suku!@shubham.json',
            'shubham!@shubham': 'shubham!@shubham.json'
        };
        this.maxAttempts = 5;
        this.attemptCount = 0;
        this.lockTime = 30000; // 30 seconds lockout
        
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

        // Rate limiting protection
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

        const password = document.getElementById('password').value;
        const submitBtn = document.getElementById('submit-btn');
        const buttonText = submitBtn.querySelector('.button-text');
        const spinner = submitBtn.querySelector('.spinner');

        // Show loading state
        buttonText.classList.add('hidden');
        spinner.classList.add('active');
        submitBtn.disabled = true;

        // Simulate network delay for security
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            if (this.authenticate(password)) {
                await this.loadUserContent(password);
                this.startNewSession();
            } else {
                this.handleFailedAttempt();
            }
        } catch (error) {
            this.showError('Authentication failed. Please try again.');
            console.error('Login error:', error);
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
        
        try {
            const response = await fetch(`data/${jsonFile}`);
            if (!response.ok) throw new Error('Failed to load content');
            
            const userData = await response.json();
            this.displayContent(userData);
            this.showContentScreen();
            
        } catch (error) {
            throw new Error('Content not available');
        }
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
        if (sessionStorage.getItem('currentSession')) {
            this.showLoginScreen(); // Force re-authentication
        }
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SecureVault();
});
