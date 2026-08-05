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

  // ---- FORMULÁRIO DA LISTA DE ESPERA ----
  // Envia para um Google Forms através de um iframe oculto, sem sair da página.
  // Os ids do formulário ficam no HTML (lista-espera.html).
  const waitlistForm = document.getElementById('waitlist-form');

  if (waitlistForm) {
    const sink = document.getElementById('waitlist-sink');
    const statusEl = document.getElementById('waitlist-status');
    const successEl = document.getElementById('waitlist-success');
    const submitBtn = document.getElementById('waitlist-submit');
    const nome = document.getElementById('wl-nome');
    const email = document.getElementById('wl-email');
    const telefone = document.getElementById('wl-telefone');

    // Se os ids do Google Forms não estiverem preenchidos, o envio fica bloqueado.
    const configured = waitlistForm.action.indexOf('SUBSTITUIR') === -1 &&
                       waitlistForm.querySelectorAll('[name^="entry.SUBSTITUIR"]').length === 0;

    let sending = false;
    let fallbackTimer = null;

    // Com JavaScript, o envio vai para o iframe oculto e a validação é a nossa.
    // Sem JavaScript, o formulário usa a validação nativa do navegador e envia
    // direto para a página de confirmação do Google.
    if (sink) waitlistForm.target = 'waitlist-sink';
    waitlistForm.noValidate = true;

    function setStatus(msg) {
      statusEl.textContent = msg || '';
    }

    function markInvalid(field, msg) {
      field.classList.add('invalid');
      setStatus(msg);
      field.focus();
    }

    function validate() {
      [nome, email, telefone].forEach(function (f) { f.classList.remove('invalid'); });
      setStatus('');

      if (nome.value.trim().length < 3) {
        markInvalid(nome, 'Informe seu nome completo.');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        markInvalid(email, 'Informe um e-mail válido — é por ele que entraremos em contato.');
        return false;
      }
      const digits = telefone.value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 13) {
        markInvalid(telefone, 'Informe um telefone com DDD, por exemplo (11) 90000-0000.');
        return false;
      }
      return true;
    }

    function showSuccess() {
      if (!sending) return;
      sending = false;
      clearTimeout(fallbackTimer);
      waitlistForm.hidden = true;
      successEl.hidden = false;
    }

    [nome, email, telefone].forEach(function (f) {
      f.addEventListener('input', function () {
        f.classList.remove('invalid');
        if (configured) setStatus('');
      });
    });

    if (!configured) {
      submitBtn.disabled = true;
      setStatus('O formulário está sendo configurado. Envie seu nome, e-mail e telefone para promud.ipq@hc.fm.usp.br e registraremos seu contato na lista de espera.');
    }

    waitlistForm.addEventListener('submit', function (e) {
      if (!configured || sending || !validate()) {
        e.preventDefault();
        return;
      }
      // Deixa o envio nativo seguir para o iframe oculto.
      sending = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';
      // O iframe é de outra origem: se o evento load não chegar, confirmamos assim mesmo.
      fallbackTimer = setTimeout(showSuccess, 6000);
    });

    if (sink) {
      sink.addEventListener('load', showSuccess);
    }
  }

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
