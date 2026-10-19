/* ============================================================
   AMINA ABDI — PORTFOLIO
   Interaction layer: page transitions, cursor, hero assembly,
   work previews, clock, reveals.
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. FROST CURTAIN — page transitions ---------- */
(function pageTransitions() {
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  document.body.appendChild(curtain);

  // Lift the curtain on arrival.
  requestAnimationFrame(() => {
    curtain.classList.add('in');
    requestAnimationFrame(() => {
      curtain.classList.remove('in');
      curtain.classList.add('out');
    });
  });

  if (reduceMotion) return;

  // Drop the curtain before leaving, so pages hand off instead of snapping.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const url = link.getAttribute('href');
    if (!url || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) return;
    if (link.target === '_blank' || link.hostname !== window.location.hostname) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();
    curtain.classList.remove('out');
    curtain.classList.add('in');
    setTimeout(() => { window.location.href = url; }, 480);
  });

  // Returning via the back button should not land on a dropped curtain.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      curtain.classList.remove('in');
      curtain.classList.add('out');
    }
  });
})();

/* ---------- 2. CURSOR ---------- */
(function cursor() {
  if (reduceMotion || window.matchMedia('(hover: none)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor';
  document.body.appendChild(dot);

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });

  (function loop() {
    x += (tx - x) * 0.2;
    y += (ty - y) * 0.2;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .work-row, .photo').forEach((el) => {
    el.addEventListener('mouseenter', () => dot.classList.add('wide'));
    el.addEventListener('mouseleave', () => dot.classList.remove('wide'));
  });
})();

/* ---------- 3. HERO — the name assembles from ice fragments ---------- */
/* The single orchestrated motion on the page. Everything else stays still. */
(function heroAssembly() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  const words = name.textContent.trim().split(/\s+/);
  name.textContent = '';
  name.setAttribute('aria-label', words.join(' '));

  words.forEach((word, wi) => {
    const wordEl = document.createElement('span');
    wordEl.style.display = 'inline-block';
    wordEl.style.whiteSpace = 'nowrap';
    wordEl.setAttribute('aria-hidden', 'true');

    [...word].forEach((char) => {
      const shard = document.createElement('span');
      shard.className = 'shard';
      shard.textContent = char;
      wordEl.appendChild(shard);
    });

    name.appendChild(wordEl);
    if (wi < words.length - 1) name.appendChild(document.createTextNode(' '));
  });

  const shards = name.querySelectorAll('.shard');
  if (reduceMotion) return;

  shards.forEach((shard, i) => {
    const dx = (Math.random() - 0.5) * 160;
    const dy = (Math.random() - 0.5) * 120 - 40;
    const rot = (Math.random() - 0.5) * 50;

    shard.style.opacity = '0';
    shard.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.4)`;
    shard.style.filter = 'blur(10px)';

    setTimeout(() => {
      shard.style.transition =
        'transform 1.05s cubic-bezier(0.16,1,0.3,1), opacity .65s ease, filter .8s ease';
      shard.style.opacity = '1';
      shard.style.transform = 'none';
      shard.style.filter = 'none';
    }, 260 + i * 38);
  });
})();

/* ---------- 4. WORK PREVIEWS ---------- */
(function workPreviews() {
  const rows = document.querySelectorAll('.work-row[data-preview]');
  if (!rows.length || reduceMotion) return;
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  const box = document.createElement('div');
  box.className = 'preview';
  const img = document.createElement('img');
  img.alt = '';
  box.appendChild(img);
  document.body.appendChild(box);

  let px = 0, py = 0, cx = 0, cy = 0, active = false;

  window.addEventListener('mousemove', (e) => { px = e.clientX + 180; py = e.clientY; });

  (function loop() {
    cx += (px - cx) * 0.12;
    cy += (py - cy) * 0.12;
    if (active) box.style.left = `${cx}px`, box.style.top = `${cy}px`;
    requestAnimationFrame(loop);
  })();

  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      const src = row.dataset.preview;
      if (!src) return;
      img.src = src;
      active = true;
      cx = px; cy = py;
      box.classList.add('show');
    });
    row.addEventListener('mouseleave', () => {
      active = false;
      box.classList.remove('show');
    });
  });
})();

/* ---------- 5. CLOCK — local time ---------- */
(function clock() {
  const el = document.querySelector('.clock');
  if (!el) return;

  const tick = () => {
    const now = new Date().toLocaleTimeString('en-CA', {
      timeZone: 'America/Edmonton',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    el.textContent = now;
  };

  tick();
  setInterval(tick, 1000);
})();

/* ---------- 6. NAV STATE ---------- */
(function navState() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('stuck', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ---------- 7. REVEALS — section headings only ---------- */
(function reveals() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('seen'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('seen');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  items.forEach((el) => io.observe(el));
})();

/* ---------- 8. LIQUID GLASS SIGILS ---------- */
/* Each project gets an abstract glass mark drawn from its own subject:
   stacked discs for a database, overlapping credits, rising bars, a board,
   a stack of documents. Shared gradients and the refraction filter are
   injected once. */
(function glassMarks() {
  const marks = document.querySelectorAll('.glass-mark');
  if (!marks.length) return;

  const SHAPES = {
    database: `
      <ellipse cx="100" cy="56" rx="56" ry="21"/>
      <path d="M44 56 V140 a56 21 0 0 0 112 0 V56 a56 21 0 0 1 -112 0 Z"/>
      <ellipse cx="100" cy="98" rx="56" ry="21"/>`,
    credits: `
      <circle cx="72" cy="80" r="40"/>
      <circle cx="128" cy="80" r="40"/>
      <circle cx="100" cy="128" r="40"/>`,
    bars: `
      <rect x="30"  y="112" width="28" height="56"  rx="13"/>
      <rect x="68"  y="84"  width="28" height="84"  rx="13"/>
      <rect x="106" y="56"  width="28" height="112" rx="13"/>
      <rect x="144" y="30"  width="28" height="138" rx="13"/>`,
    board: `
      <rect x="34" y="34" width="132" height="132" rx="30"/>
      <rect x="62" y="62" width="32" height="32" rx="10"/>
      <rect x="106" y="62" width="32" height="32" rx="10"/>
      <rect x="62" y="106" width="32" height="32" rx="10"/>
      <rect x="106" y="106" width="32" height="32" rx="10"/>`,
    document: `
      <rect x="38" y="30" width="104" height="132" rx="20"/>
      <rect x="58" y="56" width="104" height="132" rx="20"/>`,
    orbit: `
      <circle cx="100" cy="100" r="52"/>
      <circle cx="100" cy="30"  r="15"/>
      <circle cx="162" cy="138" r="13"/>
      <circle cx="38"  cy="138" r="13"/>`,
  };

  // Shared defs, injected once.
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.setAttribute('aria-hidden', 'true');
  defs.setAttribute('width', '0');
  defs.setAttribute('height', '0');
  defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  defs.innerHTML = `
    <defs>
      <linearGradient id="lgBody" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.92"/>
        <stop offset="45%"  stop-color="#8FBAD4" stop-opacity="0.58"/>
        <stop offset="100%" stop-color="#9FB4C0" stop-opacity="0.34"/>
      </linearGradient>
      <linearGradient id="lgEdge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.95"/>
        <stop offset="50%"  stop-color="#8FBAD4" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.45"/>
      </linearGradient>
      <linearGradient id="lgSheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="50%"  stop-color="#ffffff" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="lgCore" cx="0.42" cy="0.3" r="0.72">
        <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <filter id="lgWobble" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.013 0.021"
                      numOctaves="2" seed="9" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="7"
                           xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="lgSoft"><feGaussianBlur stdDeviation="7"/></filter>
    </defs>`;
  document.body.appendChild(defs);

  marks.forEach((el, i) => {
    const shape = SHAPES[el.dataset.shape] || SHAPES.board;
    const clip = `lgClip${i}`;
    el.innerHTML = `
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <defs><clipPath id="${clip}">${shape}</clipPath></defs>
        <g filter="url(#lgWobble)">
          <g fill="url(#lgBody)" stroke="url(#lgEdge)" stroke-width="1.6">${shape}</g>
          <g clip-path="url(#${clip})">
            <rect x="0" y="0" width="200" height="200" fill="url(#lgCore)" filter="url(#lgSoft)"/>
            <g transform="rotate(16 100 100)">
              <rect class="glass-sheen" x="-50" y="-40" width="54" height="280" fill="url(#lgSheen)"/>
            </g>
          </g>
        </g>
      </svg>`;
  });
})();

/* ---------- 9. CAROUSEL ---------- */
/* Centre-focus carousel: the active photo sits in the middle at full size,
   its neighbours sit back. Driven only by the viewer — no autoplay. */
(function carousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const viewport = root.querySelector('.car-viewport');
  const track    = root.querySelector('.car-track');
  const slides   = [...root.querySelectorAll('.car-slide')];
  const caption  = root.querySelector('.car-caption');
  const dotsWrap = root.querySelector('.car-dots');
  const prev     = root.querySelector('.car-prev');
  const next     = root.querySelector('.car-next');
  if (!slides.length) return;

  let index = 0;

  // Dots
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'car-dot';
    b.setAttribute('aria-label', `Photo ${i + 1} of ${slides.length}`);
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function layout() {
    const slide = slides[index];
    if (!slide) return;
    const offset = slide.offsetLeft + slide.offsetWidth / 2 - viewport.clientWidth / 2;
    track.style.transform = `translateX(${-offset}px)`;

    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));

    const img = slide.querySelector('img');
    if (caption && img) caption.textContent = img.dataset.caption || '';
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    layout();
  }

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  // Keyboard
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });

  // Click a neighbour to bring it to the centre
  slides.forEach((s, i) => s.addEventListener('click', () => { if (i !== index) go(i); }));

  // Touch swipe
  let x0 = null;
  viewport.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  // Images load at different times and change the measurements.
  let settled = 0;
  slides.forEach((s) => {
    const img = s.querySelector('img');
    if (!img) return;
    if (img.complete) { settled++; return; }
    img.addEventListener('load', layout, { once: true });
    img.addEventListener('error', layout, { once: true });
  });

  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  layout();
})();

/* ---------- 10. PORTRAIT FALLBACK ---------- */
/* If no headshot has been dropped in yet, show the instruction instead. */
(function portraitFallback() {
  document.querySelectorAll('.portrait img').forEach((img) => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
    if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
  });
})();
