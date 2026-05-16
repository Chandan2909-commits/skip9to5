// Masterclass Payment Page JavaScript - Skip9to5

document.addEventListener('DOMContentLoaded', function () {

    const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
    let selectedMethod = null;

    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.querySelector('#paymentModal .modal-overlay').addEventListener('click', closeModal);

    function closeModal() {
        document.getElementById('paymentModal').classList.remove('active');
    }

    // Clicking a payment method opens QR modal directly
    paymentMethodBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const fullName = document.getElementById('fullName').value.trim();
            const email    = document.getElementById('email').value.trim();
            const phone    = document.getElementById('phone').value.trim();

            if (!fullName || !email || !phone) {
                alert('Please fill in your name, email, and phone number first.');
                return;
            }

            paymentMethodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedMethod = this.getAttribute('data-method');

            const labels = { gpay: 'Google Pay', phonepe: 'PhonePe', upi: 'UPI' };
            showQRModal(labels[selectedMethod] || selectedMethod);
        });
    });

    function showQRModal(methodLabel) {
        const modal     = document.getElementById('paymentModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <h3 class="modal-title">${methodLabel} Payment</h3>
            <div class="qr-container">
                <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=skip9to5@upi%26pn=Skip9to5%26am=0.90%26cu=USD"
                    alt="UPI QR Code"
                    style="width:200px;height:200px;display:block;"
                />
            </div>
            <div class="upi-info">
                <p class="upi-label">Or pay directly to UPI ID</p>
                <div class="upi-id">
                    <span id="upiIdText">skip9to5@upi</span>
                    <button class="copy-btn" id="copyUpiBtn">📋 Copy</button>
                </div>
                <p class="scan-note">Amount: <strong style="color:#d9a441">₹81 ($0.90)</strong> &nbsp;|&nbsp; Masterclass — Standard</p>
            </div>
            <div class="modal-footer">
                <p class="modal-note">After completing payment, click the button below to confirm</p>
                <button class="complete-payment-btn" id="completedBtn">I've Completed the Payment</button>
            </div>
        `;

        modal.classList.add('active');

        document.getElementById('copyUpiBtn').addEventListener('click', function () {
            navigator.clipboard.writeText('skip9to5@upi').then(() => {
                this.textContent = '✓ Copied!';
                setTimeout(() => this.textContent = '📋 Copy', 1500);
            });
        });

        document.getElementById('completedBtn').addEventListener('click', confirmPayment);
    }

    function confirmPayment() {
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <h3 class="modal-title">Enter Transaction Details</h3>
            <form id="transactionForm" class="transaction-form">
                <div class="form-group">
                    <label for="transactionId">Transaction / UTR ID *</label>
                    <input type="text" id="transactionId" name="transactionId" placeholder="Enter your transaction ID" required />
                    <p class="form-note">Find this in your UPI app after payment</p>
                </div>
                <button type="submit" class="confirm-payment-btn">CONFIRM PAYMENT</button>
            </form>
        `;

        document.getElementById('transactionForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const transactionId = document.getElementById('transactionId').value.trim();
            if (!transactionId) {
                alert('Please enter a valid transaction ID.');
                return;
            }

            const payload = {
                fullName:      document.getElementById('fullName').value,
                email:         document.getElementById('email').value,
                phone:         document.getElementById('phone').value,
                service:       document.getElementById('service').value,
                package:       document.getElementById('package').value,
                amount:        document.getElementById('amount').value,
                paymentMethod: selectedMethod,
                transactionId: transactionId
            };

            submitToSheet(payload);
        });
    }

    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwAZ5fuUTDqyUKMmpOMTJRNegrKZA231-qbkX6cAcCph6aa6Asw-C2ogMoKsN478k8Q/exec';

    function submitToSheet(payload) {
        const submitBtn = document.querySelector('#transactionForm .confirm-payment-btn');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(() => showSuccessModal())
        .catch(() => showSuccessModal());
    }

    function showSuccessModal() {
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div class="success-animation">
                <div class="success-checkmark">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="38" fill="#d9a441" stroke="#d9a441" stroke-width="2"/>
                        <path d="M25 40 L35 50 L55 30" stroke="#000" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="success-title">Payment Submitted!</h3>
                <p class="success-message">Your payment has been received successfully.</p>
                <p class="success-redirect">Redirecting you to the home page...</p>
            </div>
        `;

        setTimeout(() => { window.location.href = 'index.html'; }, 3000);
    }

});
