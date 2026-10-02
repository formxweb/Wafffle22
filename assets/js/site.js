/*
  Waffle Mina — interaction layer.
  Every motion here is tied to the product:
    · drizzle  — zigzag chocolate lines, drawn in a recipe's own sauce colours
    · kare     — images arrive square by square, like pockets filling
    · pour     — drips lengthen when a sauce is chosen
    · katman   — the magnolia jar builds itself layer by layer
  Everything degrades to a fully readable static page without JS or with reduced motion.
*/
import { IMG, SAUCES, FORMATS, TARIFS, TATLILAR, MAGS, MAG_ORDER } from './data.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = (n) => String(n).padStart(2, '0');
const mq = (q) => window.matchMedia(q);
const reduce = mq('(prefers-reduced-motion: reduce)');
const finePointer = mq('(hover: hover) and (pointer: fine)');
const wide = mq('(min-width: 900px)');

document.documentElement.classList.add('js');

const ALL = [...TARIFS, ...TATLILAR];
const byId = Object.fromEntries(ALL.map((t) => [t.id, t]));
const imgSrc = (name) => `assets/img/${name}.webp`;
const imgSet = (name) => {
  const m = IMG[name];
  return m.s
    ? `assets/img/${name}-480.webp 480w, assets/img/${name}.webp ${m.w}w`
    : `assets/img/${name}-240.webp 240w, assets/img/${name}.webp ${m.w}w`;
};

/* ───────────── "kare kare" reveal (needs a registered custom property) ───────────── */
let KARE = false;
if (window.CSS && 'registerProperty' in CSS) {
  try { CSS.registerProperty({ name: '--k', syntax: '<percentage>', inherits: false, initialValue: '100%' }); } catch { /* already registered */ }
  KARE = true;
}
function kare(el) {
  if (!KARE || reduce.matches) return;
  el.classList.remove('kare-in');
  void el.offsetWidth;
  el.classList.add('kare-in');
  const done = () => el.classList.remove('kare-in');
  el.addEventListener('animationend', done, { once: true });
  setTimeout(done, 1200);
}

/* ───────────── Drizzle: a zigzag of chocolate, as it is poured on the waffles ───────────── */
const NS = 'http://www.w3.org/2000/svg';
function rng(seed) { let s = seed % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

/* Straight runs with tight rounded turns — not a sine wave.
   Turns land at uneven spacing and depth, strokes lean (slant), and the whole pass can
   rise across the surface (tilt), the way a spoon of chocolate is flicked over a waffle. */
function zigzag(w, h, { step = 24, slant = 9, seed = 7, vertical = false, band = .8, tilt = 0, jitter = .35 } = {}) {
  const r = rng(seed);
  const len = vertical ? h : w, cross = vertical ? w : h;
  const pts = [];
  let a = -step * 1.5, up = r() > .5;
  while (a < len + step * 1.5) {
    const t = a / len;
    const mid = cross / 2 + tilt * (t - .5) * cross;
    const half = (cross * band / 2) * (1 - jitter / 2 + r() * jitter);
    const b = Math.min(cross - 2, Math.max(2, mid + (up ? -half : half)));
    pts.push([a + (up ? slant : 0), b]);
    a += step * (1 - jitter / 1.5 + r() * jitter * 1.4);
    up = !up;
  }
  const P = vertical ? pts.map(([x, y]) => [y, x]) : pts;
  const f = (n) => n.toFixed(1);
  let d = `M${f(P[0][0])} ${f(P[0][1])}`;
  for (let i = 1; i < P.length - 1; i++) {
    const [px, py] = P[i - 1], [x, y] = P[i], [nx, ny] = P[i + 1];
    const k = .14;
    d += ` L${f(x + (px - x) * k)} ${f(y + (py - y) * k)} Q${f(x)} ${f(y)} ${f(x + (nx - x) * k)} ${f(y + (ny - y) * k)}`;
  }
  const last = P[P.length - 1];
  return d + ` L${f(last[0])} ${f(last[1])}`;
}

/* strands: [{ color, width }]. Returns { draw(), undraw() }. */
function drizzle(svg, strands, opts = {}) {
  const { width: w, height: h } = svg.getBoundingClientRect();
  if (!w || !h) return { draw() {}, undraw() {} };
  svg.setAttribute('viewBox', `0 0 ${w.toFixed(0)} ${h.toFixed(0)}`);
  svg.replaceChildren();
  const paths = [];
  strands.forEach((s, i) => {
    const d = zigzag(w, h, { ...opts, seed: (opts.seed || 3) + i * 97, slant: (opts.slant ?? 9) + i * 3, step: (opts.step || 24) + i * 2.5 });
    const light = s.color.toUpperCase() === SAUCES.beyaz.color;
    if (light) { // white chocolate needs a hairline of shadow to read on cream
      const under = document.createElementNS(NS, 'path');
      under.setAttribute('d', d);
      under.setAttribute('stroke', 'rgba(28,15,8,.2)');
      under.setAttribute('stroke-width', s.width + 2.2);
      svg.append(under); paths.push(under);
    }
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('stroke', s.color);
    p.setAttribute('stroke-width', s.width);
    svg.append(p); paths.push(p);
  });
  const lens = paths.map((p) => p.getTotalLength());
  const still = reduce.matches || opts.instant;
  paths.forEach((p, i) => {
    p.style.strokeDasharray = `${lens[i]} ${lens[i]}`;
    p.style.strokeDashoffset = still ? 0 : lens[i];
  });
  let anims = [];
  const run = (to, dur, ease) => {
    anims.forEach((a) => a.cancel());
    anims = paths.map((p, i) => {
      const from = getComputedStyle(p).strokeDashoffset;
      const target = to ? 0 : lens[i];
      p.style.strokeDashoffset = target;
      if (reduce.matches) return { cancel() {} };
      return p.animate([{ strokeDashoffset: from }, { strokeDashoffset: target }],
        { duration: dur, delay: to ? Math.floor(i / 2) * 90 : 0, easing: ease, fill: 'backwards' });
    });
  };
  return {
    draw: (dur = opts.duration || 900) => run(true, dur, 'cubic-bezier(.45,0,.2,1)'),
    undraw: (dur = 260) => run(false, dur, 'cubic-bezier(.6,0,.9,.4)'),
  };
}
const strandsFor = (keys, width) => keys.slice(0, 3).map((k) => ({ color: SAUCES[k].color, width }));

/* ───────────── Live status: hours are 14:00–00:00 every day, Istanbul time ───────────── */
const OPEN_AT = 14 * 60;
function istanbulMinutes() {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const get = (t) => Number(parts.find((p) => p.type === t).value);
    return get('hour') * 60 + get('minute');
  } catch { return null; }
}
const span = (m) => { const h = Math.floor(m / 60), mm = m % 60; return h ? `${h} sa ${mm} dk` : `${mm} dk`; };
function updateStatus() {
  const t = istanbulMinutes();
  if (t === null) return;
  const open = t >= OPEN_AT;
  $$('[data-status]').forEach((el) => el.classList.toggle('is-open', open));
  $$('[data-status-text]').forEach((el) => { el.textContent = open ? 'Açık · 00:00’a kadar' : 'Kapalı · 14:00’te açılır'; });
  $$('[data-status-long]').forEach((el) => {
    el.textContent = open
      ? `Şimdi açık. Beş şube de gece yarısına kadar; kapanışa ${span(1440 - t)}.`
      : `Şimdi kapalı. Beş şube de 14:00’te açılıyor; ${span(OPEN_AT - t)} sonra.`;
  });
}
updateStatus();
setInterval(updateStatus, 30_000);

/* ───────────── Header logo, tones, section rail, dock ───────────── */
const topBar = $('[data-top]');
const rail = $('[data-rail]');
const dock = $('.dock');
const heroLogo = $('.pocket--logo');

topBar.dataset.logo = 'hidden';
new IntersectionObserver(([e]) => { topBar.dataset.logo = e.isIntersecting ? 'hidden' : 'shown'; }, { rootMargin: '-70px 0px 0px 0px' }).observe(heroLogo);

const sections = $$('main > section, body > footer');
const toneOf = (el) => (el.dataset.tone === 'dark' ? 'dark' : 'light');
const topIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) topBar.dataset.tone = toneOf(e.target); });
}, { rootMargin: '0px 0px -94% 0px' });
sections.forEach((s) => topIO.observe(s));

const railLinks = $$('[data-rail-link]');
const railIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    rail.dataset.tone = toneOf(e.target);
    const id = e.target.id === 'son' ? 'subeler' : e.target.id;
    railLinks.forEach((a) => a.setAttribute('aria-current', String(a.dataset.railLink === id)));
  });
}, { rootMargin: '-50% 0px -50% 0px' });
sections.forEach((s) => railIO.observe(s));

new IntersectionObserver(([e]) => dock.classList.toggle('is-away', e.isIntersecting), { threshold: .12 }).observe($('#son'));

/* ───────────── Hero: the ridges melt as you leave ───────────── */
const hero = $('#kapi');
const windowEl = $('[data-window]');
if (!reduce.matches) {
  let ticking = false;
  const melt = () => {
    ticking = false;
    const p = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * .6)));
    windowEl.style.setProperty('--melt', p.toFixed(3));
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(melt); } }, { passive: true });
  melt();
}

/* ───────────── Seams: Waffle Mina's own two chocolates tie section to section ───────────── */
const mina = byId['waffle-mina'];
const seams = $$('[data-drizzle^="seam"]').map((svg, i) => ({ svg, dz: null, seed: 11 + i * 40, tilt: i ? .5 : -.55 }));
function buildSeam(sm, instant) {
  const big = wide.matches;
  sm.dz = drizzle(sm.svg, strandsFor(mina.sauces, big ? 5.5 : 4.2), { step: big ? 48 : 34, slant: big ? 32 : 20, band: .5, tilt: sm.tilt, jitter: .6, seed: sm.seed, instant });
}
const seamIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    seamIO.unobserve(e.target);
    const sm = seams.find((x) => x.svg === e.target);
    buildSeam(sm, false);
    sm.dz.draw(reduce.matches ? 0 : 1700);
  });
}, { threshold: .2 });
seams.forEach((sm) => seamIO.observe(sm.svg));

/* ───────────── Section-entry reveals for key photographs ───────────── */
const kareIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { kareIO.unobserve(e.target); kare(e.target.querySelector('img')); } });
}, { threshold: .35 });
$$('[data-kare]').forEach((el) => kareIO.observe(el));

/* ───────────── Tarifler: sauce filter, index, stage ───────────── */
const rows = $$('.row');
const rowById = Object.fromEntries(rows.map((r) => [r.dataset.id, r]));
const drips = $$('.drip');
const sauceRail = $('[data-sauces]');
const statusEl = $('[data-filter-status]');
const stageFrame = $('[data-stage-frame]');
const stageCap = $('[data-stage-cap]');
let activeSauce = null;
let stageId = 'waffle-mina';
let hovering = false;

/* Drips pour in once, when the rail reaches the viewport. */
new IntersectionObserver(([e], io) => {
  if (!e.isIntersecting) return;
  io.disconnect();
  if (reduce.matches) { sauceRail.classList.add('is-poured'); return; }
  drips.forEach((d, i) => { d.querySelector('.drip__body').style.transitionDelay = `${i * 70}ms`; });
  requestAnimationFrame(() => sauceRail.classList.add('is-poured'));
  setTimeout(() => drips.forEach((d) => { d.querySelector('.drip__body').style.transitionDelay = ''; }), 1400);
}, { threshold: .3 }).observe(sauceRail);

function setStage(id) {
  if (id === stageId || !stageFrame) return;
  stageId = id;
  const t = byId[id];
  const v = t.variants[0];
  const i = TARIFS.indexOf(t);
  rows.forEach((r) => r.classList.toggle('is-active', r.dataset.id === id));
  stageCap.innerHTML = `<span>${pad(i + 1)}</span> ${v.title} — ${FORMATS[v.key].toLocaleLowerCase('tr')}`;
  const img = new Image();
  img.className = 'stage__img';
  img.alt = '';
  img.width = img.height = IMG[v.img].w;
  img.src = imgSrc(v.img);
  const show = () => {
    if (stageId !== id) return;
    stageFrame.append(img);
    kare(img);
    const old = $$('.stage__img', stageFrame).slice(0, -1);
    setTimeout(() => old.forEach((o) => o.remove()), KARE && !reduce.matches ? 800 : 0);
  };
  (img.decode ? img.decode() : Promise.resolve()).then(show, show);
}

/* Per-row drizzle, lazily built. */
const rowDz = new Map();
function rowDrizzle(row, keys) {
  let svg = row.querySelector('.drizzle');
  if (!svg) {
    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'drizzle');
    svg.setAttribute('aria-hidden', 'true');
    row.append(svg);
  }
  const name = row.querySelector('.row__btn');
  // a short zigzag of sauce just under the name, never over the letters
  Object.assign(svg.style, {
    left: `${name.offsetLeft}px`, top: `${name.offsetTop + name.offsetHeight + 1}px`,
    width: `${name.offsetWidth}px`, height: '10px',
  });
  const dz = drizzle(svg, strandsFor(keys, 2.6), { step: 11, slant: 4, seed: row.dataset.id.length * 13, band: .9, jitter: .3 });
  rowDz.set(row, dz);
  return dz;
}

if (finePointer.matches) {
  rows.forEach((row) => {
    row.addEventListener('pointerenter', () => {
      hovering = true;
      if (row.classList.contains('is-dim')) return;
      setStage(row.dataset.id);
      if (!activeSauce) rowDrizzle(row, byId[row.dataset.id].sauces).draw(560);
    });
    row.addEventListener('pointerleave', () => {
      hovering = false;
      if (!activeSauce) rowDz.get(row)?.undraw();
    });
  });
}

/* On wide screens the stage follows reading position. */
const spyIO = new IntersectionObserver((entries) => {
  if (hovering || !wide.matches) return;
  entries.forEach((e) => { if (e.isIntersecting && !e.target.classList.contains('is-dim')) setStage(e.target.dataset.id); });
}, { rootMargin: '-46% 0px -46% 0px' });
rows.forEach((r) => spyIO.observe(r));

function applyFilter() {
  drips.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sauce === activeSauce)));
  sauceRail.classList.toggle('is-filtering', !!activeSauce);
  let n = 0, first = null;
  rows.forEach((r) => {
    const on = !activeSauce || r.dataset.sauces.split(' ').includes(activeSauce);
    r.classList.toggle('is-dim', !on);
    if (activeSauce && on) {
      n++; first = first || r;
      rowDrizzle(r, [activeSauce]).draw(700 + n * 60);
    } else {
      rowDz.get(r)?.undraw(200);
    }
  });
  statusEl.replaceChildren();
  if (activeSauce) {
    const msg = document.createElement('span');
    msg.textContent = `${SAUCES[activeSauce].name}: ${n} tarif.`;
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'sauces__reset';
    reset.textContent = 'Tümünü göster ×';
    reset.addEventListener('click', () => {
      const pressed = drips.find((d) => d.dataset.sauce === activeSauce);
      activeSauce = null; applyFilter(); pressed?.focus();
    });
    statusEl.append(msg, reset);
    if (first) setStage(first.dataset.id);
  }
}
drips.forEach((b) => b.addEventListener('click', () => {
  activeSauce = activeSauce === b.dataset.sauce ? null : b.dataset.sauce;
  applyFilter();
}));
stageFrame?.addEventListener('click', () => openTarif(stageId));

/* Warm the stage cache on idle so swaps are instant on desktop. */
if (wide.matches) {
  const warm = () => TARIFS.forEach((t) => { const i = new Image(); i.src = imgSrc(t.variants[0].img); });
  ('requestIdleCallback' in window) ? requestIdleCallback(warm, { timeout: 4000 }) : setTimeout(warm, 2500);
}

/* ───────────── Dialogs ───────────── */
function closeDialog(d) {
  if (!d.open || d.classList.contains('is-closing')) return;
  if (reduce.matches) { d.close(); return; }
  d.classList.add('is-closing');
  let done = false;
  const end = () => { if (done) return; done = true; d.classList.remove('is-closing'); d.close(); };
  d.addEventListener('animationend', end, { once: true });
  setTimeout(end, 420);
}

/* Index: a waffle of links */
const dizin = $('[data-dizin]');
$$('.dizin__p', dizin).forEach((p, i) => p.style.setProperty('--i', [0, 1, 2, 1, 2, 3, 2, 3, 4][i] ?? i));
$$('[data-open-index]').forEach((b) => b.addEventListener('click', () => dizin.showModal()));
dizin.addEventListener('cancel', (e) => { e.preventDefault(); closeDialog(dizin); });
dizin.addEventListener('click', (e) => {
  const el = e.target.closest('[data-close]');
  if (!el) return;
  if (el.tagName === 'A') { dizin.close(); return; } // let the anchor navigate
  closeDialog(dizin);
});

/* Recipe detail */
const dlg = $('[data-tarif]');
const tFrame = $('[data-t-frame]');
const tImg = $('[data-t-img]');
const tNo = $('[data-t-no]');
const tTitle = $('[data-t-title]');
const tSeg = $('[data-t-seg]');
const tSauces = $('[data-t-sauces]');
const tSizesRow = $('[data-t-sizes-row]');
const tSizes = $('[data-t-sizes]');
const tDesc = $('[data-t-desc]');
const tDrizzleSvg = $('[data-drizzle="tarif"]');
let cur = null, curVar = 0;

const groupOf = (t) => (TARIFS.includes(t) ? TARIFS : TATLILAR);

function renderTarif() {
  const t = cur, v = t.variants[curVar], group = groupOf(t), i = group.indexOf(t);
  tNo.textContent = group === TARIFS ? `Tarif ${pad(i + 1)} / ${pad(TARIFS.length)}` : 'Tatlı';
  tTitle.textContent = v.title;
  tTitle.lang = t.lang === 'en' ? 'en' : 'tr';
  tSeg.replaceChildren();
  if (t.variants.length > 1) {
    t.variants.forEach((x, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = FORMATS[x.key] || x.label;
      b.setAttribute('aria-pressed', String(k === curVar));
      b.addEventListener('click', () => { if (k !== curVar) { curVar = k; renderTarif(); swapPhoto(); syncHash(); } });
      tSeg.append(b);
    });
  }
  tSauces.replaceChildren(...t.sauces.map((k) => {
    const s = document.createElement('span');
    s.innerHTML = `<i class="dot" style="--c:${SAUCES[k].color}"></i>`;
    s.append(SAUCES[k].name);
    return s;
  }));
  tSizesRow.hidden = !v.sizes;
  tSizes.textContent = v.sizes ? v.sizes.join(' · ') : '';
  tDesc.textContent = v.desc;
}
function swapPhoto() {
  const v = cur.variants[curVar];
  const next = new Image();
  next.alt = `${v.title}: ${v.desc}`;
  next.width = next.height = IMG[v.img].w;
  next.srcset = imgSet(v.img);
  next.sizes = '(max-width: 759px) 100vw, 560px';
  next.src = imgSrc(v.img);
  const show = () => {
    tFrame.append(next);
    kare(next);
    const old = $$('img', tFrame).slice(0, -1);
    setTimeout(() => old.forEach((o) => o.remove()), KARE && !reduce.matches ? 800 : 0);
  };
  (next.decode ? next.decode() : Promise.resolve()).then(show, show);
}
function syncHash() {
  const hash = `#tarif/${cur.id}`;
  if (location.hash !== hash) history.replaceState(history.state, '', hash);
}

function openTarif(id, variantKey, { push = true } = {}) {
  const t = byId[id];
  if (!t) return;
  const wasOpen = dlg.open;
  cur = t;
  curVar = Math.max(0, t.variants.findIndex((v) => v.key === variantKey));
  renderTarif();
  swapPhoto();
  if (!wasOpen) {
    dlg.showModal();
    $('.tarif__close', dlg).focus({ preventScroll: true });
    if (push) history.pushState({ tarif: id }, '', `#tarif/${id}`);
  } else {
    history.replaceState({ tarif: id }, '', `#tarif/${id}`);
  }
  requestAnimationFrame(() => {
    const vertical = window.innerWidth >= 760;
    drizzle(tDrizzleSvg, strandsFor(t.sauces, 4.5), { vertical, step: vertical ? 40 : 30, slant: vertical ? 22 : 16, seed: id.length * 7, band: .7, jitter: .55 }).draw(1000);
  });
}
function step(dir) {
  const g = groupOf(cur);
  const i = (g.indexOf(cur) + dir + g.length) % g.length;
  openTarif(g[i].id);
}
function requestClose(thenHash) {
  pendingHash = thenHash || null;
  if (history.state && history.state.tarif) history.back(); // popstate closes it
  else { closeDialog(dlg); history.replaceState(null, '', location.pathname + location.search); goPending(); }
}
let pendingHash = null;
function goPending() {
  if (!pendingHash) return;
  const target = $(pendingHash);
  pendingHash = null;
  if (target) setTimeout(() => target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' }), 60);
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-open]');
  if (b) openTarif(b.dataset.open, b.dataset.variant);
});
$('[data-t-prev]').addEventListener('click', () => step(-1));
$('[data-t-next]').addEventListener('click', () => step(1));
dlg.addEventListener('cancel', (e) => { e.preventDefault(); requestClose(); });
dlg.addEventListener('click', (e) => {
  if (e.target === dlg) { requestClose(); return; } // backdrop
  const c = e.target.closest('[data-close]');
  if (!c) return;
  e.preventDefault();
  requestClose(c.getAttribute('href'));
});
dlg.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'ArrowLeft') step(-1);
});
window.addEventListener('popstate', () => {
  const m = location.hash.match(/^#tarif\/([\w-]+)$/);
  if (m && byId[m[1]]) openTarif(m[1], null, { push: false });
  else if (dlg.open) { closeDialog(dlg); goPending(); }
});
{
  const m = location.hash.match(/^#tarif\/([\w-]+)$/);
  if (m && byId[m[1]]) openTarif(m[1], null, { push: false });
}

/* ───────────── Katman katman: the magnolia jar ───────────── */
const jar = $('[data-jar]');
const jarLabels = $('[data-jar-labels]');
const chips = $$('[data-fill]');
const magName = $('[data-mag-name]');
const magDesc = $('[data-mag-desc]');
const fills = new Set(chips.filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.dataset.fill));
const FILL_LABEL = { cikolata: 'sütlü çikolata', cilek: 'çilek', muz: 'muz' };
const WEIGHT = { krema: 1, fill: .9, biskuvi: 1.3 };

/* Fixed slots, bottom → top. Unused slots collapse to zero, so changes animate. */
const SLOTS = ['krema', 'f0', 'krema', 'f1', 'krema', 'f2', 'krema', 'biskuvi'];
const slotEls = SLOTS.map((s) => {
  const el = document.createElement('div');
  el.className = `layer layer--${s === 'biskuvi' ? 'biskuvi' : 'krema'}`;
  jar.append(el);
  return el;
});
const labelEls = {};
['biskuvi', 'krema', 'cikolata', 'cilek', 'muz'].forEach((k) => {
  const li = document.createElement('li');
  li.textContent = { biskuvi: 'toz cici bebe bisküvisi', krema: 'özel mag kreması' }[k] || FILL_LABEL[k];
  jarLabels.append(li);
  labelEls[k] = li;
});

function plan() {
  const f = MAG_ORDER.filter((k) => fills.has(k));
  // one filling shows twice, like the jars in the shop; three fillings use every slot
  const assign = f.length === 1 ? [f[0], f[0], null] : f.length === 2 ? [f[0], f[1], null] : f;
  return SLOTS.map((s, i) => {
    if (s === 'biskuvi') return 'biskuvi';
    if (s === 'krema') return (i === 6 && !assign[2]) ? null : 'krema';
    return assign[Number(s[1])] || null;
  });
}

let jarReady = false;
function renderJar(stagger) {
  const p = plan();
  const total = p.reduce((a, t) => a + (t ? WEIGHT[t === 'krema' || t === 'biskuvi' ? t : 'fill'] : 0), 0);
  let acc = 0;
  const firstAt = {};
  p.forEach((type, i) => {
    const el = slotEls[i];
    const h = type ? (WEIGHT[type === 'krema' || type === 'biskuvi' ? type : 'fill'] / total) * 100 : 0;
    const want = `layer layer--${type || el.className.match(/layer--(\w+)/)[1]}`;
    const apply = () => { el.className = want; el.style.setProperty('--h', `${h}%`); };
    el.style.transitionDelay = stagger && !reduce.matches ? `${i * 110}ms` : '';
    if (type && el.className !== want && parseFloat(el.style.getPropertyValue('--h')) > 0 && !reduce.matches) {
      el.style.setProperty('--h', '0%'); // empty the slot, then refill with the new filling
      setTimeout(apply, 380);
    } else apply();
    if (type && firstAt[type] === undefined) firstAt[type] = acc + h / 2;
    acc += h;
  });
  // labels: biscuit at the top, cream at its second band, fillings at their first band
  const cremaY = (() => { let a = 0, seen = 0; for (let i = 0; i < p.length; i++) { const h = p[i] ? (WEIGHT[p[i] === 'krema' || p[i] === 'biskuvi' ? p[i] : 'fill'] / total) * 100 : 0; if (p[i] === 'krema' && ++seen === 2) return a + h / 2; a += h; } return 50; })();
  Object.entries(labelEls).forEach(([k, li]) => {
    const y = k === 'krema' ? cremaY : firstAt[k];
    li.style.opacity = y === undefined ? '0' : '1';
    if (y !== undefined) li.style.setProperty('--y', `${y.toFixed(1)}%`);
  });
}

function updateMag() {
  const key = MAG_ORDER.filter((k) => fills.has(k)).join('+');
  chips.forEach((c) => c.setAttribute('aria-pressed', String(fills.has(c.dataset.fill))));
  magName.textContent = MAGS[key].name;
  magDesc.textContent = MAGS[key].desc.split(', ').join(' · ');
  if (jarReady) renderJar(false);
}
chips.forEach((c) => c.addEventListener('click', () => {
  const k = c.dataset.fill;
  if (fills.has(k)) {
    if (fills.size === 1) { c.classList.remove('is-nope'); void c.offsetWidth; c.classList.add('is-nope'); return; }
    fills.delete(k);
  } else fills.add(k);
  updateMag();
}));
updateMag();

/* The jar fills itself, bottom to top, the first time it is seen. */
Object.values(labelEls).forEach((li) => { li.style.opacity = '0'; });
new IntersectionObserver(([e], io) => {
  if (!e.isIntersecting) return;
  io.disconnect();
  jarReady = true;
  renderJar(true);
  setTimeout(() => slotEls.forEach((el) => { el.style.transitionDelay = ''; }), 1400);
}, { threshold: .35 }).observe($('[data-jar-wrap]'));

/* ───────────── Resize: rebuild drawn drizzles at the new size ───────────── */
let lastW = window.innerWidth;
window.addEventListener('resize', () => {
  if (Math.abs(window.innerWidth - lastW) < 40) return;
  lastW = window.innerWidth;
  seams.forEach((sm) => { if (sm.dz) buildSeam(sm, true); });
  rowDz.clear();
  $$('.row .drizzle').forEach((s) => s.remove());
  if (activeSauce) applyFilter();
}, { passive: true });
