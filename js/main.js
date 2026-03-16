/* =============================================
   Wang Zixuan Portfolio — main.js
   Scroll animations, nav highlight, mobile menu
   ============================================= */

(function () {
  'use strict';

  // ─── Scroll Animations (Intersection Observer) ───
  const animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .fade-scale');

  if (animEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || '0');
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    // Stagger animation delay within groups of siblings
    animEls.forEach((el, i) => {
      if (!el.dataset.delay) {
        // Find siblings with same parent to stagger
        const siblings = Array.from(el.parentElement.children).filter(
          (c) => c.classList.contains('fade-up') || c.classList.contains('fade-left') || c.classList.contains('fade-right') || c.classList.contains('fade-scale')
        );
        const idx = siblings.indexOf(el);
        el.dataset.delay = idx >= 0 ? idx * 110 : 0;
      }
      observer.observe(el);
    });
  }

  // ─── Navbar: scroll shadow ───
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── Active nav link ───
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ─── Mobile hamburger menu ───
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ─── Smooth page transitions ───
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    // Only internal html links, not anchors or external
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      href.endsWith('.html')
    ) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const wrapper = document.querySelector('.page-wrapper');
        if (wrapper) {
          wrapper.style.opacity = '0';
          wrapper.style.transform = 'translateY(8px)';
          wrapper.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        }
        setTimeout(() => {
          window.location.href = href;
        }, 250);
      });
    }
  });

})();
