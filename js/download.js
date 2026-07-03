document.addEventListener('DOMContentLoaded', function() {
    // Download PDF
    document.getElementById('downloadReceipt')?.addEventListener('click', function() {
        const transaction = window.currentTransaction;
        if (!transaction) {
            showNotification('No transaction data available', 'error');
            return;
        }

        // Generate HTML invoice
        const html = generateInvoiceHTML(transaction);
        
        // Create blob and download
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${transaction.orderId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Receipt downloaded successfully!', 'success');
    });

    // Print receipt
    document.getElementById('printReceipt')?.addEventListener('click', function() {
        window.print();
    });

    // Export as JSON
    document.getElementById('exportJSON')?.addEventListener('click', function() {
        const transaction = window.currentTransaction;
        if (!transaction) return;

        const json = JSON.stringify(transaction, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Transaction_${transaction.orderId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});

// Print styles for better print output
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .btn-download, .btn-print, .btn-home, .btn-verify, .theme-toggle {
            display: none !important;
        }
        body {
            background: white !important;
        }
        .success-card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
        }
        .receipt {
            page-break-inside: avoid;
        }
        .disclaimer {
            background: #fef5e7 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    }
`;
document.head.appendChild(printStyles);
