document.addEventListener('DOMContentLoaded', function() {
    // Get transaction from URL or session
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    
    let transaction = null;
    
    if (orderId) {
        transaction = getTransaction(orderId);
    } else {
        // Try to get from session
        const stored = sessionStorage.getItem('currentTransaction');
        if (stored) {
            transaction = JSON.parse(stored);
        }
    }

    if (!transaction) {
        // Create a sample transaction for demo
        transaction = {
            orderId: 'ORD-DEMO-1234',
            name: 'Demo User',
            mobile: '9876543210',
            email: 'demo@example.com',
            amount: 500,
            purpose: 'Demo Payment',
            upiId: 'paytmqr281005050101whg6sa9wkmnz@paytm',
            date: new Date().toISOString(),
            status: 'completed'
        };
    }

    // Populate receipt
    document.getElementById('receiptOrderId').textContent = transaction.orderId || '-';
    document.getElementById('receiptAmount').textContent = `₹${transaction.amount || 0}`;
    document.getElementById('receiptUPI').textContent = transaction.upiId || '-';
    document.getElementById('receiptCustomer').textContent = transaction.name || '-';
    document.getElementById('receiptDate').textContent = transaction.date ? 
        new Date(transaction.date).toLocaleString() : '-';

    // Transaction ID input handler
    document.getElementById('verifyTx').addEventListener('click', function() {
        const txId = document.getElementById('transactionId').value.trim();
        if (!txId) {
            showNotification('Please enter a transaction ID', 'error');
            return;
        }

        // In a real app, this would verify with bank API
        // For static site, just store it
        updateTransaction(transaction.orderId, {
            transactionId: txId,
            status: 'verified_by_user'
        });

        // Update receipt
        const row = document.createElement('div');
        row.className = 'receipt-row';
        row.innerHTML = `
            <span>Transaction ID:</span>
            <span style="color: #48bb78; font-weight: bold;">${txId}</span>
        `;
        document.querySelector('.receipt').appendChild(row);

        showNotification('Transaction ID saved! Please verify with your bank.', 'success');
    });

    // Store for download
    window.currentTransaction = transaction;
});
