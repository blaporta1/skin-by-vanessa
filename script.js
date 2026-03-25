/**
 * Skin by Vanessa — script.js
 * Handles: Lucide icons, sticky header, mobile menu, scroll reveals,
 *           active nav, back-to-top, contact form, footer year.
 */

'use strict';

/* ── Lucide Icons ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initHeader();
  initMobileMenu();
  initScrollReveal();
  initActiveNav();
  initBackToTop();
  initContactForm();
  setFooterYear();
});

/* ── Header: scroll class ────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 60;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ── Mobile Menu ─────────────────────────────────────────────── */
function initMobileMenu() {
  const btn   = document.getElementById('hamburger-btn');
  const menu  = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  function toggle() {
    const isOpen = menu.classList.toggle('is-open');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function close() {
    menu.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', toggle);

  // Close on nav link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && !btn.contains(e.target)) {
      close();
    }
  });
}

/* ── Scroll Reveal (IntersectionObserver) ────────────────────── */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Instantly show everything
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Active Nav Link ─────────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(section => observer.observe(section));
}

/* ── Back to Top ─────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const SHOW_THRESHOLD = 500;

  function onScroll() {
    btn.classList.toggle('is-visible', window.scrollY > SHOW_THRESHOLD);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Contact Form ────────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  // Validate a single field
  function validateField(field) {
    const errorEl = document.getElementById(`${field.id.replace('form-', '')}-error`);
    let message = '';

    if (field.required && !field.value.trim()) {
      message = 'This field is required.';
    } else if (field.type === 'email' && field.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(field.value.trim())) {
        message = 'Please enter a valid email address.';
      }
    }

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.toggle('is-visible', !!message);
    }
    field.classList.toggle('has-error', !!message);
    return !message;
  }

  // Validate on blur
  ['form-name', 'form-email', 'form-message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('has-error')) validateField(field);
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all required fields
    const fields  = ['form-name', 'form-email', 'form-message'];
    let allValid  = true;

    fields.forEach(id => {
      const field = document.getElementById(id);
      if (field && !validateField(field)) {
        allValid = false;
      }
    });

    if (!allValid) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('.has-error');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate submission
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 1400));

    submitBtn.classList.remove('is-loading');
    submitBtn.disabled = false;

    // Show success
    form.querySelectorAll('.form-group').forEach(g => g.style.display = 'none');
    form.querySelector('.form-row').style.display = 'none';
    submitBtn.style.display = 'none';
    successMsg.classList.add('is-visible');
    successMsg.removeAttribute('aria-hidden');

    // Re-init Lucide icons for the new check-circle icon
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });
}

/* ── Footer Year ─────────────────────────────────────────────── */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Smooth scroll for all hash links ───────────────────────── */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;

  e.preventDefault();

  const headerHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '76',
    10
  );

  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
});
