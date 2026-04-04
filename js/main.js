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
    initMarqueeDrag();
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

  // --- Marquee Drag/Swipe ---
  function initMarqueeDrag() {
    var marquee = document.querySelector('.marquee');
    var inner = document.querySelector('.marquee__inner');
    if (!marquee || !inner) return;

    var isDragging = false;
    var startX = 0;
    var currentTranslate = 0;
    var resumeTimer = null;

    function getAnimationTranslateX() {
      var style = window.getComputedStyle(inner);
      var matrix = style.transform;
      if (matrix && matrix !== 'none') {
        var values = matrix.match(/matrix.*\((.+)\)/);
        if (values) {
          var parts = values[1].split(', ');
          return parseFloat(parts[4]) || 0;
        }
      }
      return 0;
    }

    function onDragStart(e) {
      isDragging = true;
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      currentTranslate = getAnimationTranslateX();

      inner.classList.add('marquee__inner--paused');
      inner.style.transform = 'translateX(' + currentTranslate + 'px)';
      marquee.classList.add('marquee--dragging');

      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    }

    function onDragMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      var x = (e.touches ? e.touches[0].clientX : e.clientX);
      var diff = x - startX;
      var newX = currentTranslate + diff;

      // Wrap position so the ribbon never runs out of content
      var halfWidth = inner.scrollWidth / 2;
      if (halfWidth > 0) {
        // Keep translateX in the range [0, -halfWidth) for seamless wrapping
        newX = newX % halfWidth;
        if (newX > 0) newX -= halfWidth;
      }

      inner.style.transform = 'translateX(' + newX + 'px)';
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      marquee.classList.remove('marquee--dragging');

      // Resume auto-scroll after 2 seconds
      resumeTimer = setTimeout(function() {
        inner.style.transform = '';
        inner.classList.remove('marquee__inner--paused');
      }, 2000);
    }

    // Mouse events
    marquee.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);

    // Touch events
    marquee.addEventListener('touchstart', onDragStart, { passive: true });
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
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
