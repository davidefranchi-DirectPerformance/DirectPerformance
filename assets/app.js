/* =====================================================================
   Clicca Lavoro 2026 — App script
   - Active TOC highlighting on scroll
   - Lazy-loaded Giscus discussion per chapter
   ===================================================================== */

(function () {
  // -------- Active TOC highlighting --------
  const tocLinks = document.querySelectorAll('#toc a');
  const sections = document.querySelectorAll('section.chapter, section.premise');
  const linkById = {};
  tocLinks.forEach(a => { linkById[a.getAttribute('href').slice(1)] = a; });

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const link = linkById[entry.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(s => obs.observe(s));
  }
})();

(function () {
  // -------- Per-chapter Giscus loader (lazy) --------
  const cfg = window.GISCUS_CONFIG || {};
  const isConfigured =
    cfg.repo && !cfg.repo.includes('TUO-UTENTE') &&
    cfg.repoId && !cfg.repoId.includes('PLACEHOLDER');

  document.querySelectorAll('.discussion').forEach(block => {
    const term = block.dataset.term;
    const btn = block.querySelector('.discuss-btn');
    const mount = block.querySelector('.giscus-mount');
    if (!btn || !mount) return;

    btn.addEventListener('click', () => {
      if (mount.dataset.loaded) return;
      mount.dataset.loaded = '1';
      btn.style.display = 'none';

      if (!isConfigured) {
        mount.innerHTML = `
          <div class="giscus-warning">
            <strong>Configurazione richiesta.</strong>
            Per attivare i commenti su questo e tutti gli altri capitoli devi:
            (1) caricare questo progetto in un repo GitHub pubblico,
            (2) abilitare le <code>Discussions</code> in Settings → General → Features,
            (3) installare l'app <a href="https://github.com/apps/giscus" target="_blank" rel="noopener">github.com/apps/giscus</a>,
            (4) andare su <a href="https://giscus.app" target="_blank" rel="noopener">giscus.app</a> e generare i 4 valori,
            (5) aprire il file <code>assets/giscus.config.js</code> e sostituire i 4 placeholder.
            Una volta sostituiti, tutti e 12 i capitoli avranno la loro discussione separata.
          </div>
        `;
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-repo', cfg.repo);
      script.setAttribute('data-repo-id', cfg.repoId);
      script.setAttribute('data-category', cfg.category);
      script.setAttribute('data-category-id', cfg.categoryId);
      script.setAttribute('data-mapping', 'specific');
      script.setAttribute('data-term', term);
      script.setAttribute('data-strict', '0');
      script.setAttribute('data-reactions-enabled', '1');
      script.setAttribute('data-emit-metadata', '0');
      script.setAttribute('data-input-position', 'top');
      script.setAttribute('data-theme', cfg.theme || 'light');
      script.setAttribute('data-lang', cfg.lang || 'it');
      mount.appendChild(script);
    });
  });
})();
