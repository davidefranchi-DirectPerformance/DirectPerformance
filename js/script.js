/* ============================================
   MAGELLANO.AI — JavaScript v2
   Ecosistema + Control Tower animations
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

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });

  /* ---------- CONTROL TOWER — ANIMATED PARTICLES ---------- */
  const towerHub = document.getElementById('towerHub');
  if (towerHub) {
    const hubLines = towerHub.querySelector('.hub-lines');
    const paths = hubLines.querySelectorAll('.hub-line');
    const particles = hubLines.querySelectorAll('.data-particle');

    // Animate particles along paths using offset-path or manual animation
    function animateParticles() {
      paths.forEach((path, i) => {
        const particle = particles[i];
        if (!particle || !path) return;

        const length = path.getTotalLength();
        let progress = 0;
        const speed = 0.003 + (i * 0.001); // Slightly different speeds
        const delay = i * 1300;

        function step() {
          progress += speed;
          if (progress > 1) progress = 0;

          const point = path.getPointAtLength(progress * length);
          particle.setAttribute('cx', point.x);
          particle.setAttribute('cy', point.y);

          // Fade in/out at ends
          let opacity = 1;
          if (progress < 0.1) opacity = progress / 0.1;
          if (progress > 0.9) opacity = (1 - progress) / 0.1;
          particle.setAttribute('opacity', opacity);

          requestAnimationFrame(step);
        }

        // Start with delay
        setTimeout(() => {
          requestAnimationFrame(step);
        }, delay);
      });
    }

    animateParticles();

    // Hub nodes — click to scroll to area
    towerHub.querySelectorAll('.hub-node').forEach(node => {
      node.addEventListener('click', function () {
        const area = this.dataset.area;
        const target = document.getElementById('area-' + area);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the card briefly
          target.style.borderColor = '#06c7b2';
          setTimeout(() => { target.style.borderColor = ''; }, 2000);
        }
      });
    });

    // Interactive hover: highlight corresponding line
    towerHub.querySelectorAll('.hub-node').forEach((node, i) => {
      node.addEventListener('mouseenter', () => {
        if (paths[i]) {
          paths[i].style.opacity = '1';
          paths[i].style.strokeWidth = '2.5';
        }
        if (particles[i]) {
          particles[i].setAttribute('r', '5');
        }
      });
      node.addEventListener('mouseleave', () => {
        if (paths[i]) {
          paths[i].style.opacity = '';
          paths[i].style.strokeWidth = '';
        }
        if (particles[i]) {
          particles[i].setAttribute('r', '3');
        }
      });
    });
  }

  /* ---------- SCROLL FADE-IN ANIMATIONS ---------- */
  const fadeEls = document.querySelectorAll(
    'section h2, .pillar, .feature, .area-card, .settore-card, .case-card, .section-intro, .tower-hub'
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
