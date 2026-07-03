// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('SecurePay Payment Gateway initialized');

    // Check for browser compatibility
    if (!window.Promise || !window.localStorage) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Browser Not Supported</h2>
                <p>Please use a modern browser to access this payment gateway.</p>
            </div>
        `;
        return;
    }

    // Enable HTTPS-only if available
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        console.warn('Page is not served over HTTPS. Some features may not work.');
    }

    // Service Worker registration for PWA support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker registered successfully');
            })
            .catch(function(err) {
                console.log('Service Worker registration failed:', err);
            });
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+D: Toggle dark mode
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            const toggle = document.querySelector('.theme-toggle');
            if (toggle) toggle.click();
        }
    });

    // Track page view
    if (window.gtag) {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }

    console.log('✅ SecurePay is ready!');
});
