document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const CONFIG = {
        UPI_ID: 'paytmqr281005050101whg6sa9wkmnz@paytm',
        MERCHANT_NAME: 'SHUBHAM VISHWAKARMA',
        APP_NAME: 'SecurePay'
    };

    // DOM Elements
    const form = document.getElementById('paymentForm');
    const orderIdInput = document.getElementById('orderId');
    const qrSection = document.getElementById('qrSection');
    const progressFill = document.getElementById('progressFill');

    // Generate Order ID
    function generateOrderId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }

    // Set initial Order ID
    orderIdInput.value = generateOrderId();

    // Update progress
    function updateProgress(percent) {
        progressFill.style.width = percent + '%';
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3000);
    }

    // Generate UPI Link
    function generateUPILink(amount, orderId, purpose = '') {
        const params = new URLSearchParams({
            pa: CONFIG.UPI_ID,
            pn: CONFIG.MERCHANT_NAME,
            am: amount,
            cu: 'INR',
            tn: `Order-${orderId}`
        });

        if (purpose) {
            params.append('purpose', purpose);
        }

        return `upi://pay?${params.toString()}`;
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('customerName').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const email = document.getElementById('email').value.trim();
        const amount = document.getElementById('amount').value;
        const purpose = document.getElementById('purpose').value.trim();
        const orderId = orderIdInput.value;

        // Validate
        if (!name || !mobile || !email || !amount) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (!/^[0-9]{10}$/.test(mobile)) {
            showNotification('Please enter a valid 10-digit mobile number', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (amount < 1) {
            showNotification('Amount must be at least ₹1', 'error');
            return;
        }

        // Save to local storage
        const transaction = {
            orderId,
            name,
            mobile,
            email,
            amount: parseFloat(amount),
            purpose,
            upiId: CONFIG.UPI_ID,
            date: new Date().toISOString(),
            status: 'initiated'
        };

        saveTransaction(transaction);

        // Generate UPI link
        const upiLink = generateUPILink(amount, orderId, purpose);
        
        // Update progress
        updateProgress(50);

        // Open UPI app
        window.location.href = upiLink;

        // Store for success page
        sessionStorage.setItem('currentTransaction', JSON.stringify(transaction));

        // Redirect to success page after delay
        setTimeout(() => {
            window.location.href = `success.html?order=${orderId}`;
        }, 2000);

        showNotification('Redirecting to UPI app...', 'success');
    });

    // Show QR Code
    document.getElementById('showQR').addEventListener('click', function() {
        const amount = document.getElementById('amount').value;
        const orderId = orderIdInput.value;

        if (!amount || amount < 1) {
            showNotification('Please enter a valid amount first', 'error');
            return;
        }

        document.getElementById('qrAmount').textContent = amount;
        qrSection.classList.remove('hidden');

        // Generate QR
        const upiLink = generateUPILink(amount, orderId);
        generateQR(upiLink);

        updateProgress(30);
        showNotification('QR Code generated successfully', 'success');
    });

    // Copy UPI ID
    document.getElementById('copyUPI').addEventListener('click', function() {
        navigator.clipboard.writeText(CONFIG.UPI_ID).then(() => {
            showNotification('UPI ID copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = CONFIG.UPI_ID;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            showNotification('UPI ID copied!', 'success');
        });
    });

    // Copy QR UPI ID
    document.getElementById('copyQRUPI')?.addEventListener('click', function() {
        navigator.clipboard.writeText(CONFIG.UPI_ID).then(() => {
            showNotification('UPI ID copied!', 'success');
        });
    });

    // Reset form
    document.querySelector('.btn-cancel').addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel this payment?')) {
            form.reset();
            orderIdInput.value = generateOrderId();
            qrSection.classList.add('hidden');
            updateProgress(0);
            showNotification('Payment cancelled', 'error');
        }
    });

    // Auto-generate new order ID on page load
    orderIdInput.value = generateOrderId();

    // Dark mode toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = '🌙';
    toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    document.body.appendChild(toggleBtn);

    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        toggleBtn.innerHTML = '☀️';
    }

    // Loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1000);
});
