// Validate Indian mobile number
function validateMobile(mobile) {
    return /^[6-9]\d{9}$/.test(mobile);
}

// Validate email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate amount
function validateAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 10000000;
}

// Sanitize input (XSS protection)
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validate UPI ID format
function validateUPI(upiId) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId);
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    // Mobile validation
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('blur', function() {
            if (this.value && !validateMobile(this.value)) {
                this.style.borderColor = '#fc8181';
                showNotification('Invalid mobile number', 'error');
            } else {
                this.style.borderColor = '#48bb78';
            }
        });
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#fc8181';
                showNotification('Invalid email address', 'error');
            } else {
                this.style.borderColor = '#48bb78';
            }
        });
    }

    // Amount validation
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('blur', function() {
            if (this.value && !validateAmount(this.value)) {
                this.style.borderColor = '#fc8181';
                showNotification('Amount must be between ₹1 and ₹10,000,000', 'error');
            } else {
                this.style.borderColor = '#48bb78';
            }
        });
    }
});
