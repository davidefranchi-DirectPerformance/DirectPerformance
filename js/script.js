/* ============================================
   MAGELLANO.AI — JavaScript v3
   Canvas-based Control Tower animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
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

  /* ===========================================
     CONTROL TOWER — CANVAS ANIMATION (Hub View)
     =========================================== */
  const hubCanvas = document.getElementById('hubCanvas');
  if (hubCanvas) {
    const ctx = hubCanvas.getContext('2d');
    let W, H, dpr;
    const TEAL = '#06c7b2';
    const AMBER = '#f0a030';  // Return flow color

    function resizeCanvas() {
      const rect = hubCanvas.parentElement.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      W = rect.width;
      H = rect.height;
      hubCanvas.width = W * dpr;
      hubCanvas.height = H * dpr;
      hubCanvas.style.width = W + 'px';
      hubCanvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Node positions (relative to canvas, matching CSS positions)
    function getPositions() {
      const cx = W / 2, cy = H / 2;
      // Areas (middle ring)
      const lead    = { x: W * 0.18, y: H * 0.50 };
      const adv     = { x: W * 0.50, y: H * 0.12 };
      const organic = { x: W * 0.82, y: H * 0.50 };
      // Channels (outer ring)
      const channels = {
        lead: [
          { x: W * 0.03, y: H * 0.11 },
          { x: W * 0.03, y: H * 0.31 },
          { x: W * 0.03, y: H * 0.65 },
          { x: W * 0.03, y: H * 0.85 },
        ],
        adv: [
          { x: W * 0.20, y: H * 0.02 },
          { x: W * 0.38, y: H * 0.02 },
          { x: W * 0.62, y: H * 0.02 },
          { x: W * 0.80, y: H * 0.02 },
        ],
        organic: [
          { x: W * 0.97, y: H * 0.11 },
          { x: W * 0.97, y: H * 0.31 },
          { x: W * 0.97, y: H * 0.65 },
          { x: W * 0.97, y: H * 0.85 },
        ]
      };
      return { cx, cy, lead, adv, organic, channels };
    }

    // Bezier curve helper (quadratic)
    function quadBezier(p0, cp, p1, t) {
      const u = 1 - t;
      return {
        x: u * u * p0.x + 2 * u * t * cp.x + t * t * p1.x,
        y: u * u * p0.y + 2 * u * t * cp.y + t * t * p1.y,
      };
    }

    // Calculate control point for a nice curve
    function ctrlPt(a, b, bend) {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      return { x: mx - dy * bend, y: my + dx * bend };
    }

    // Draw a dashed curve
    function drawCurve(p0, cp, p1, color, width, alpha, dashLen) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      if (dashLen) ctx.setLineDash(dashLen);
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(cp.x, cp.y, p1.x, p1.y);
      ctx.stroke();
      ctx.restore();
    }

    // Particle class
    class Particle {
      constructor(from, cp, to, color, radius, speed, delay) {
        this.from = from;
        this.cp = cp;
        this.to = to;
        this.color = color;
        this.radius = radius;
        this.speed = speed;
        this.delay = delay;
        this.t = -delay; // negative = waiting
      }
      update(dt) {
        this.t += dt * this.speed;
        if (this.t > 1) this.t = -this.delay * 0.3; // loop with small pause
      }
      draw() {
        if (this.t < 0) return;
        const pos = quadBezier(this.from, this.cp, this.to, this.t);
        // Fade in/out at edges
        let alpha = 1;
        if (this.t < 0.1) alpha = this.t / 0.1;
        if (this.t > 0.85) alpha = (1 - this.t) / 0.15;
        // Glow
        ctx.save();
        ctx.globalAlpha = alpha * 0.4;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        // Solid dot
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Build all paths and particles
    let particles = [];

    function buildScene() {
      particles = [];
      const p = getPositions();
      const center = { x: p.cx, y: p.cy };

      // --- OUTGOING FLOW (teal): Center → Area → Channels ---
      const areas = [
        { node: p.lead, channels: p.channels.lead, bendOut: 0.15 },
        { node: p.adv,  channels: p.channels.adv,  bendOut: -0.1 },
        { node: p.organic, channels: p.channels.organic, bendOut: -0.15 },
      ];

      areas.forEach((area, ai) => {
        // Center → Area: multiple particles
        const cp1 = ctrlPt(center, area.node, area.bendOut);
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(
            center, cp1, area.node,
            TEAL, 3, 0.25 + Math.random() * 0.1, Math.random() * 2
          ));
        }

        // Area → each Channel
        area.channels.forEach((ch, ci) => {
          const cpOuter = ctrlPt(area.node, ch, (ci % 2 === 0 ? 0.1 : -0.1));
          // Draw path + particle
          particles.push(new Particle(
            area.node, cpOuter, ch,
            TEAL, 2, 0.2 + Math.random() * 0.08, Math.random() * 3
          ));
        });
      });

      // --- RETURN FLOW (amber): Channels → Area → Center ---
      areas.forEach((area, ai) => {
        // Some channels send data back
        area.channels.forEach((ch, ci) => {
          if (ci % 2 === 0) { // Every other channel for less clutter
            const cpBack = ctrlPt(ch, area.node, (ci % 2 === 0 ? -0.12 : 0.12));
            particles.push(new Particle(
              ch, cpBack, area.node,
              AMBER, 2, 0.15 + Math.random() * 0.05, Math.random() * 4
            ));
          }
        });

        // Area → Center return
        const cpReturn = ctrlPt(area.node, center, -area.bendOut * 0.8);
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(
            area.node, cpReturn, center,
            AMBER, 2.5, 0.18 + Math.random() * 0.08, Math.random() * 3 + 1
          ));
        }
      });
    }
    buildScene();
    window.addEventListener('resize', buildScene);

    // Animation loop
    let lastTime = performance.now();
    function animate(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, W, H);
      const p = getPositions();
      const center = { x: p.cx, y: p.cy };

      // Draw static connection lines
      const areas = [
        { node: p.lead, channels: p.channels.lead, bendOut: 0.15 },
        { node: p.adv,  channels: p.channels.adv,  bendOut: -0.1 },
        { node: p.organic, channels: p.channels.organic, bendOut: -0.15 },
      ];

      areas.forEach(area => {
        // Center → Area lines (teal)
        const cp1 = ctrlPt(center, area.node, area.bendOut);
        drawCurve(center, cp1, area.node, TEAL, 1.2, 0.25, [6, 4]);
        // Area → Channels lines (teal, thinner)
        area.channels.forEach((ch, ci) => {
          const cpO = ctrlPt(area.node, ch, (ci % 2 === 0 ? 0.1 : -0.1));
          drawCurve(area.node, cpO, ch, TEAL, 0.7, 0.15, [3, 4]);
        });
        // Return lines (amber, offset)
        const cpR = ctrlPt(area.node, center, -area.bendOut * 0.8);
        drawCurve(area.node, cpR, center, AMBER, 0.8, 0.12, [4, 6]);
      });

      // Update & draw particles
      particles.forEach(p => {
        p.update(dt);
        p.draw();
      });

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    /* ---------- MAGIC LIGHT (follows mouse) ---------- */
    const magicLight = document.getElementById('magicLight');
    const hubContainer = document.getElementById('towerHub');

    if (magicLight && hubContainer) {
      hubContainer.addEventListener('mousemove', (e) => {
        const rect = hubContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        magicLight.style.left = x + 'px';
        magicLight.style.top = y + 'px';
      });
    }

    // Hub node hover: highlight channels (no movement)
    document.querySelectorAll('.hub-node').forEach(node => {
      node.addEventListener('mouseenter', () => {
        // Intensify own glow
        const dot = node.querySelector('.node-dot');
        if (dot) dot.style.boxShadow = '0 0 32px rgba(6,199,178,0.5)';
        const label = node.querySelector('span');
        if (label) label.style.color = '#ffffff';
        // Highlight matching channels
        const area = node.dataset.area;
        const cls = 'ch-' + (area === 'leadgen' ? 'lead' : area);
        document.querySelectorAll('.ch-label').forEach(ch => {
          if (ch.classList.contains(cls)) {
            ch.style.opacity = '1';
            ch.style.background = 'rgba(6,199,178,0.2)';
          }
        });
      });
      node.addEventListener('mouseleave', () => {
        const dot = node.querySelector('.node-dot');
        if (dot) dot.style.boxShadow = '';
        const label = node.querySelector('span');
        if (label) label.style.color = '';
        document.querySelectorAll('.ch-label').forEach(ch => {
          ch.style.opacity = '';
          ch.style.background = '';
        });
      });
      // Click to scroll
      node.addEventListener('click', () => {
        const target = document.getElementById('area-' + node.dataset.area);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.style.borderColor = '#06c7b2';
          setTimeout(() => { target.style.borderColor = ''; }, 2000);
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
