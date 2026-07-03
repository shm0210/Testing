function generateInvoiceHTML(transaction) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Invoice #${transaction.orderId}</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; }
            .invoice-header { border-bottom: 2px solid #667eea; padding-bottom: 20px; margin-bottom: 20px; }
            .invoice-title { font-size: 28px; color: #2d3748; }
            .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .invoice-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .total { font-size: 20px; font-weight: bold; color: #48bb78; }
            .disclaimer { margin-top: 30px; padding: 15px; background: #fef5e7; border-radius: 5px; font-size: 14px; }
            .footer { margin-top: 40px; text-align: center; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            .badge { background: #48bb78; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="invoice-header">
            <h1 class="invoice-title">Payment Receipt</h1>
            <p><span class="badge">PAID</span></p>
        </div>

        <div class="invoice-details">
            <div>
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${transaction.orderId}</p>
                <p><strong>Date:</strong> ${new Date(transaction.date).toLocaleString()}</p>
                <p><strong>Purpose:</strong> ${transaction.purpose || 'Payment'}</p>
            </div>
            <div>
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> ${transaction.name}</p>
                <p><strong>Mobile:</strong> ${transaction.mobile}</p>
                <p><strong>Email:</strong> ${transaction.email}</p>
            </div>
        </div>

        <h3>Payment Information</h3>
        <div class="invoice-row">
            <span>Amount</span>
            <span class="total">₹${transaction.amount}</span>
        </div>
        <div class="invoice-row">
            <span>UPI ID</span>
            <span>${transaction.upiId}</span>
        </div>
        <div class="invoice-row">
            <span>Transaction ID</span>
            <span>${transaction.transactionId || 'Pending'}</span>
        </div>

        <div class="disclaimer">
            <strong>⚠️ Important:</strong> This receipt is customer-generated and not verified by the bank.
            Please verify the transaction with your bank before confirming.
        </div>

        <div class="footer">
            <p>Thank you for your payment!</p>
            <p>${transaction.merchantName || 'SecurePay'}</p>
        </div>
    </body>
    </html>
    `;
}
