const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const scrollTopBtn = document.getElementById("scrollTopBtn");

menuToggle?.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});

document.querySelectorAll(".slider-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const rail = document.getElementById(button.dataset.slider);
        const direction = button.classList.contains("next") ? 1 : -1;
        rail?.scrollBy({ left: direction * 420, behavior: "smooth" });
    });
});

document.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", () => {
        const id = card.dataset.video;
        if (!id || card.querySelector("iframe")) return;

        card.innerHTML = `
            <iframe
                src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
                title="Skip9to5 community video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;
    });
});

document.querySelectorAll(".accordion details").forEach((item) => {
    item.addEventListener("toggle", () => {
        if (!item.open) return;
        document.querySelectorAll(".accordion details").forEach((other) => {
            if (other !== item) other.removeAttribute("open");
        });
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
});

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const finalValue = Number(target.dataset.count || 0);
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            target.textContent = Math.floor(finalValue * eased).toLocaleString("en-IN");

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
        countObserver.unobserve(target);
    });
}, { threshold: 0.6 });

document.querySelectorAll("[data-count]").forEach((counter) => {
    countObserver.observe(counter);
});

scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
