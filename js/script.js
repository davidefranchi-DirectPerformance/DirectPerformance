/* ============================================
   MAGELLANO.AI — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ---------- HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate hamburger → X
    hamburger.querySelectorAll('span').forEach((s, i) => {
      if (isOpen) {
        if (i === 0) s.style.transform = 'translateY(7px) rotate(45deg)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });

  /* ---------- TOOL CARD ACCORDION ---------- */
  document.querySelectorAll('.tool-header').forEach(header => {
    header.addEventListener('click', function () {
      const card = this.closest('.tool-card');
      const isOpen = card.classList.contains('open');

      // Close all cards in the same grid
      const grid = card.closest('.tools-grid');
      if (grid) {
        grid.querySelectorAll('.tool-card.open').forEach(c => {
          if (c !== card) c.classList.remove('open');
        });
      }

      // Toggle clicked card
      card.classList.toggle('open', !isOpen);
    });
  });

  /* ---------- AREA TABS ---------- */
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(t => t.classList.remove('active'));

      this.classList.add('active');
      const content = document.getElementById('tab-' + target);
      if (content) content.classList.add('active');
    });
  });

  /* ---------- SCROLL FADE-IN ANIMATIONS ---------- */
  const fadeEls = document.querySelectorAll(
    'section h2, .tool-card, .ecosystem-card, .settore-card, .case-card, .area-header, .section-intro, .section-footnote'
  );
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  fadeEls.forEach(el => observer.observe(el));

  /* ---------- CONTACT FORM (placeholder) ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      btn.textContent = 'Messaggio inviato ✓';
      btn.style.background = '#05a596';
      setTimeout(() => {
        btn.textContent = "Richiedi un'analisi gratuita";
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

});
