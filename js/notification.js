class NotificationManager {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 350px;
            width: 100%;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            padding: 15px 20px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        `;

        // Set colors based on type
        const colors = {
            success: 'linear-gradient(135deg, #48bb78, #38a169)',
            error: 'linear-gradient(135deg, #fc8181, #e53e3e)',
            warning: 'linear-gradient(135deg, #ed8936, #dd6b20)',
            info: 'linear-gradient(135deg, #4299e1, #3182ce)'
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        this.container.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 400);
            }, duration);
        }

        return notification;
    }

    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 3000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}

// Global notification instance
const notifier = new NotificationManager();

// Override existing showNotification function
window.showNotification = function(message, type = 'info') {
    notifier.show(message, type);
};

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        animation: notificationSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    @keyframes notificationSlideIn {
        from {
            opacity: 0;
            transform: translateX(120%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }
    
    .notification-container {
        pointer-events: none;
    }
    
    .notification {
        pointer-events: auto;
        cursor: pointer;
    }
    
    .notification:hover {
        transform: scale(1.02) !important;
    }
`;
document.head.appendChild(notificationStyles);
