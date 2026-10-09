// Portfolio de Salaou Sobour — animations et navigation
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---------- Menu mobile ----------
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const closeMenu = () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-container')) closeMenu();
  });

  // ---------- Barre de navigation + progression de lecture ----------
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('progress');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    navbar.classList.toggle('scrolled', y > 20);
    // Cache la barre en descendant, la montre en remontant
    const menuOpen = navMenu.classList.contains('active');
    navbar.classList.toggle('hidden', !menuOpen && y > 400 && y > lastY);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Lien actif selon la section visible ----------
  const links = [...document.querySelectorAll('.nav-link')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id], main header[id]').forEach(s => sectionObserver.observe(s));

  // ---------- Compteurs animés ----------
  const countUp = el => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const format = n => n.toLocaleString('fr-FR') + suffix;
    if (reduceMotion) { el.textContent = format(target); return; }
    const duration = 1600;
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ---------- Apparition au défilement ----------
  const phoneTotal = document.getElementById('phoneTotal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      el.querySelectorAll('[data-count]').forEach(countUp);
      if (el.classList.contains('phone-wrap')) {
        phoneTotal.dataset.count = '23750';
        countUp(phoneTotal);
      }
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ---------- Texte « machine à écrire » ----------
  const typed = document.getElementById('typed');
  const roles = ['Spécialiste QHSE', 'Étudiant en mathématiques', 'Développeur Python · C · R', 'Développeur web', 'Créateur de Gère Crédit'];
  if (!reduceMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;
    const step = () => {
      const word = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typed.textContent = word.slice(0, charIndex);
      let delay = deleting ? 40 : 80;
      if (!deleting && charIndex === word.length) { deleting = true; delay = 1800; }
      else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 300;
      }
      setTimeout(step, delay);
    };
    setTimeout(step, 2400);
  }

  // ---------- Effets réservés à la souris ----------
  if (finePointer && !reduceMotion) {
    // Halo qui suit le curseur
    const glow = document.getElementById('cursorGlow');
    let gx = -999, gy = -999, tx = -999, ty = -999;
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const loop = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    // Inclinaison 3D des cartes
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateY(-4px)`;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });

    // Boutons « aimantés »
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });

    // Parallaxe légère des formes du hero
    const blobs = document.querySelectorAll('.blob');
    const hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', e => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      blobs.forEach((b, i) => {
        const k = (i + 1) * 18;
        b.style.translate = `${x * k}px ${y * k}px`;
      });
    });
  }

  // ---------- Année du pied de page ----------
  document.getElementById('year').textContent = new Date().getFullYear();
});
