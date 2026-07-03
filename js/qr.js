function generateQR(upiLink) {
    // Using a free QR code API
    const qrContainer = document.getElementById('qrCode');
    if (!qrContainer) return;

    // Clear previous QR
    qrContainer.innerHTML = '';

    // Create QR code image
    const img = document.createElement('img');
    // Using qrserver.com API (free, no registration required)
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}&bgcolor=ffffff&color=000000&margin=10`;
    img.alt = 'UPI QR Code';
    img.style.width = '250px';
    img.style.height = '250px';
    img.style.borderRadius = '10px';

    // Add loading state
    img.onload = function() {
        showNotification('QR Code loaded successfully', 'success');
    };

    img.onerror = function() {
        // Fallback to generating QR with another service
        img.src = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(upiLink)}`;
    };

    qrContainer.appendChild(img);

    // Add countdown timer
    const timerDiv = document.createElement('div');
    timerDiv.className = 'qr-timer';
    let seconds = 60;
    timerDiv.textContent = `QR expires in: ${seconds}s`;
    qrContainer.appendChild(timerDiv);

    const timer = setInterval(() => {
        seconds--;
        timerDiv.textContent = `QR expires in: ${seconds}s`;
        if (seconds <= 0) {
            clearInterval(timer);
            timerDiv.textContent = 'QR expired. Please regenerate.';
            timerDiv.style.color = 'red';
            qrContainer.style.opacity = '0.5';
        }
    }, 1000);

    // Store timer reference
    qrContainer.dataset.timer = timer;
}
