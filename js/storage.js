function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push({
        ...transaction,
        timestamp: new Date().toISOString()
    });
    // Keep only last 50 transactions
    if (transactions.length > 50) {
        transactions = transactions.slice(-50);
    }
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
}

function getTransaction(orderId) {
    const transactions = getTransactions();
    return transactions.find(t => t.orderId === orderId);
}

function updateTransaction(orderId, updates) {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.orderId === orderId);
    if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updates };
        localStorage.setItem('transactions', JSON.stringify(transactions));
        return true;
    }
    return false;
}

function clearTransactions() {
    if (confirm('Are you sure you want to clear all transaction history?')) {
        localStorage.removeItem('transactions');
        showNotification('Transaction history cleared', 'info');
        return true;
    }
    return false;
}

// Auto-clear old transactions (30 days)
function cleanupOldTransactions() {
    const transactions = getTransactions();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filtered = transactions.filter(t => {
        return new Date(t.timestamp) > thirtyDaysAgo;
    });
    
    if (filtered.length !== transactions.length) {
        localStorage.setItem('transactions', JSON.stringify(filtered));
    }
}

// Run cleanup on load
cleanupOldTransactions();
