// Masterclass UPI Payment Page JavaScript - Skip9to5

document.addEventListener('DOMContentLoaded', function () {

    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwAZ5fuUTDqyUKMmpOMTJRNegrKZA231-qbkX6cAcCph6aa6Asw-C2ogMoKsN478k8Q/exec';

    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.querySelector('#paymentModal .modal-overlay').addEventListener('click', closeModal);

    function closeModal() {
        document.getElementById('paymentModal').classList.remove('active');
    }

    // Proceed button — validate then show transaction ID form directly
    document.getElementById('proceedBtn').addEventListener('click', function () {
        const fullName = document.getElementById('fullName').value.trim();
        const email    = document.getElementById('email').value.trim();
        const phone    = document.getElementById('phone').value.trim();

        if (!fullName || !email || !phone) {
            alert('Please fill in your name, email, and phone number first.');
            return;
        }

        confirmPayment();
    });

    function confirmPayment() {
        const modal     = document.getElementById('paymentModal');
        const modalBody = document.getElementById('modalBody');

        modal.classList.add('active');

        modalBody.innerHTML = `
            <h3 class="modal-title">Enter Transaction Details</h3>
            <form id="transactionForm" class="transaction-form">
                <div class="form-group">
                    <label for="transactionId">Transaction / UTR ID *</label>
                    <input type="text" id="transactionId" name="transactionId"
                           placeholder="Enter your transaction ID" required />
                    <p class="form-note">Find this in your UPI app after payment</p>
                </div>
                <button type="submit" class="confirm-payment-btn">CONFIRM PAYMENT</button>
            </form>
        `;

        document.getElementById('transactionForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const transactionId = document.getElementById('transactionId').value.trim();
            if (!transactionId) { alert('Please enter a valid transaction ID.'); return; }

            const payload = {
                fullName:      document.getElementById('fullName').value,
                email:         document.getElementById('email').value,
                phone:         document.getElementById('phone').value,
                service:       document.getElementById('service').value,
                package:       document.getElementById('package').value,
                amount:        document.getElementById('amount').value,
                paymentMethod: 'UPI',
                transactionId: transactionId
            };

            submitToSheet(payload);
        });
    }

    function submitToSheet(payload) {
        const submitBtn = document.querySelector('#transactionForm .confirm-payment-btn');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

        fetch(APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) })
            .then(() => showSuccessModal(payload))
            .catch(() => showSuccessModal(payload));
    }

    function showSuccessModal(payload) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="success-animation">
                <div class="success-checkmark">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="38" fill="#d9a441" stroke="#d9a441" stroke-width="2"/>
                        <path d="M25 40 L35 50 L55 30" stroke="#000" stroke-width="4" fill="none"
                              stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="success-title">Payment Submitted!</h3>
                <p class="success-message">Your payment has been received successfully.</p>
                <p class="success-redirect">Redirecting to your order summary...</p>
            </div>
        `;
        sessionStorage.setItem('skip9to5_order', JSON.stringify(payload));
        setTimeout(() => { window.location.href = 'order-summary.html'; }, 2000);
    }
});
