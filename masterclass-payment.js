// Masterclass Payment Page JavaScript - Skip9to5

document.addEventListener('DOMContentLoaded', function () {

    const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
    let selectedMethod = null;

    // Crypto network config — replace wallet addresses with real ones
    const cryptoNetworks = {
        'USDT (BEP20)': {
            network: 'BEP20 (BSC)',
            address: 'YOUR_BEP20_WALLET_ADDRESS',
            color:   '#F0B90B',
            badge:   'BNB Smart Chain',
            note:    'Send USDT on BEP20 (BSC) network only'
        },
        'USDT (ERC20)': {
            network: 'ERC20 (Ethereum)',
            address: 'YOUR_ERC20_WALLET_ADDRESS',
            color:   '#627EEA',
            badge:   'Ethereum Network',
            note:    'Send USDT on ERC20 (Ethereum) network only'
        },
        'USDT (TRC20)': {
            network: 'TRC20 (TRON)',
            address: 'YOUR_TRC20_WALLET_ADDRESS',
            color:   '#EF0027',
            badge:   'TRON Network',
            note:    'Send USDT on TRC20 (TRON) network only'
        }
    };

    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.querySelector('#paymentModal .modal-overlay').addEventListener('click', closeModal);
    function closeModal() { document.getElementById('paymentModal').classList.remove('active'); }

    // Payment method buttons
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

            if (selectedMethod === 'crypto') {
                showCryptoNetworkPicker();
            } else {
                const labels = { gpay: 'Google Pay', phonepe: 'PhonePe' };
                showUPIModal(labels[selectedMethod] || selectedMethod);
            }
        });
    });

    // ── UPI / GPay / PhonePe QR ──────────────────────────────────────
    function showUPIModal(methodLabel) {
        const modal     = document.getElementById('paymentModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <h3 class="modal-title">${methodLabel} Payment</h3>
            <div class="qr-container">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=skip9to5@upi%26pn=Skip9to5%26am=0.90%26cu=USD"
                     alt="UPI QR Code" style="width:200px;height:200px;display:block;" />
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

    // ── Crypto: step 1 — network picker ─────────────────────────────
    function showCryptoNetworkPicker() {
        const modal     = document.getElementById('paymentModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <h3 class="modal-title">Select Crypto Network</h3>
            <p class="modal-note" style="margin-bottom:20px">Choose the USDT network you want to pay with</p>
            <div class="crypto-network-list">
                ${Object.entries(cryptoNetworks).map(([name, cfg]) => `
                    <button class="crypto-network-btn" data-network="${name}">
                        <div class="cn-dot" style="background:${cfg.color}"></div>
                        <div class="cn-info">
                            <strong>${name}</strong>
                            <span>${cfg.badge}</span>
                        </div>
                        <div class="cn-arrow">›</div>
                    </button>
                `).join('')}
            </div>
        `;

        modal.classList.add('active');

        modalBody.querySelectorAll('.crypto-network-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                showCryptoQR(this.dataset.network);
            });
        });
    }

    // ── Crypto: step 2 — QR + address ───────────────────────────────
    function showCryptoQR(networkName) {
        const modalBody = document.getElementById('modalBody');
        const cfg       = cryptoNetworks[networkName];

        selectedMethod = `Crypto — ${networkName}`;

        modalBody.innerHTML = `
            <button class="crypto-back-btn" id="cryptoBack">‹ Back</button>
            <h3 class="modal-title">${networkName} Payment</h3>
            <div class="crypto-network-badge" style="background:${cfg.color}20;border-color:${cfg.color}60;color:${cfg.color}">
                ${cfg.badge}
            </div>
            <div class="qr-container">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(cfg.address)}"
                     alt="${networkName} QR" style="width:200px;height:200px;display:block;" />
            </div>
            <div class="upi-info">
                <p class="upi-label">Wallet Address</p>
                <div class="upi-id crypto-addr">
                    <span id="cryptoAddrText" style="font-size:11px;word-break:break-all">${cfg.address}</span>
                    <button class="copy-btn" id="copyAddrBtn">📋 Copy</button>
                </div>
                <p class="scan-note" style="color:#e8a020;font-size:12px;margin-top:8px">
                    ⚠️ ${cfg.note}
                </p>
                <p class="scan-note">Amount: <strong style="color:#d9a441">₹81 ($0.90)</strong> &nbsp;|&nbsp; Masterclass — Standard</p>
            </div>
            <div class="modal-footer">
                <p class="modal-note">After sending, click below and enter your transaction hash</p>
                <button class="complete-payment-btn" id="completedBtn">I've Completed the Payment</button>
            </div>
        `;

        document.getElementById('cryptoBack').addEventListener('click', showCryptoNetworkPicker);
        document.getElementById('copyAddrBtn').addEventListener('click', function () {
            navigator.clipboard.writeText(cfg.address).then(() => {
                this.textContent = '✓ Copied!';
                setTimeout(() => this.textContent = '📋 Copy', 1500);
            });
        });
        document.getElementById('completedBtn').addEventListener('click', confirmPayment);
    }

    // ── Transaction ID / Hash form ───────────────────────────────────
    function confirmPayment() {
        const modalBody  = document.getElementById('modalBody');
        const isCrypto   = selectedMethod && selectedMethod.startsWith('Crypto');
        const idLabel    = isCrypto ? 'Transaction Hash (TxID) *' : 'Transaction / UTR ID *';
        const idNote     = isCrypto ? 'Find this in your crypto wallet after sending' : 'Find this in your UPI app after payment';
        const idPlaceholder = isCrypto ? 'Enter transaction hash' : 'Enter your transaction ID';

        modalBody.innerHTML = `
            <h3 class="modal-title">Enter Transaction Details</h3>
            <form id="transactionForm" class="transaction-form">
                <div class="form-group">
                    <label for="transactionId">${idLabel}</label>
                    <input type="text" id="transactionId" name="transactionId"
                           placeholder="${idPlaceholder}" required />
                    <p class="form-note">${idNote}</p>
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
                paymentMethod: selectedMethod,
                transactionId: transactionId
            };

            submitToSheet(payload);
        });
    }

    // ── Sheet submission ─────────────────────────────────────────────
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwAZ5fuUTDqyUKMmpOMTJRNegrKZA231-qbkX6cAcCph6aa6Asw-C2ogMoKsN478k8Q/exec';

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
