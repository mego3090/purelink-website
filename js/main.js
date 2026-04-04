/**
 * PureLink Chemicals - Main JavaScript
 * Sticky header, mobile nav, scroll animations, counter animation, back-to-top
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initCounters();
    initBackToTop();
    initSmoothScroll();
  });

  // --- Sticky Header ---
  function initStickyHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    var lastScroll = 0;
    window.addEventListener('scroll', function() {
      var currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- Mobile Navigation ---
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function() {
      toggle.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    var links = nav.querySelectorAll('.nav__link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() {
        toggle.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Scroll Reveal ---
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function(el) { observer.observe(el); });
  }

  // --- Counter Animation ---
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) { observer.observe(counter); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2000;
    var startTime = null;

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // --- Back to Top ---
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Smooth Scroll for anchor links ---
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function(a) {
      a.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

})();
