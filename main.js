// ============================================
// PROMUD — main.js
// ============================================

(function () {
  'use strict';

  // ---- HEADER SCROLL BEHAVIOR ----
  const header = document.getElementById('site-header');

  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  // ---- SCROLL REVEAL ----
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el, i) {
      // Stagger children in same parent
      const siblings = el.parentElement.querySelectorAll('.reveal');
      if (siblings.length > 1) {
        const idx = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = (idx * 0.1) + 's';
      }
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---- PILLAR KEYBOARD ACCESSIBILITY ----
  document.querySelectorAll('.pillar').forEach(function (pillar) {
    pillar.setAttribute('tabindex', '0');
    pillar.setAttribute('role', 'button');
    pillar.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const onclick = this.getAttribute('onclick');
        if (onclick) {
          const match = onclick.match(/location\.href='(.+?)'/);
          if (match) window.location.href = match[1];
        }
      }
    });
  });

})();
