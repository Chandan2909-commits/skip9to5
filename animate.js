/* animate.js — scroll-triggered reveal + torch cursor for all pages (both directions) */
(function () {
  'use strict';

  /* ── TORCH CURSOR ─────────────────────────────────────────── */
  function initTorch() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ring = document.createElement('div');
    ring.id = 'torchRing';
    document.body.appendChild(ring);

    let mx = -400, my = -400;
    let rx = -400, ry = -400;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      rx = lerp(rx, mx, 0.10);
      ry = lerp(ry, my, 0.10);
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      requestAnimationFrame(tick);
    }
    tick();

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      document.body.classList.remove('cursor-out');
    });

    document.addEventListener('mouseleave', () => document.body.classList.add('cursor-out'));
    document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-out'));

    // Hover state — ring shrinks and brightens over interactive elements
    const hoverTargets = 'a, button, [role="button"], input, textarea, select, label, .program-option, .payment-method-btn, .crypto-network-btn, .mentor-item, .s-card, .at-row, .t-card, .gm-mode-card, .mc-mode-card';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
    });
  }

  /* ── SCROLL ANIMATIONS ────────────────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  );

  function init() {
    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });
    initTorch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
