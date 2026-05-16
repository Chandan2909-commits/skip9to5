// Replace with your Google Apps Script Web App URL
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyJgAUq0oYF2Wa82sxyrCv5Be7I6g4nO8U-TaAZ-Gm5nYwMWy63SYwrMkUcbBUibS1jdg/exec';

document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('formStatus');
    const form = e.target;

    const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
    };

    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    try {
        await fetch(SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        status.textContent = '✓ Message sent successfully!';
        form.reset();
    } catch {
        status.textContent = 'Something went wrong. Please try again.';
        status.classList.add('error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
    }
});
