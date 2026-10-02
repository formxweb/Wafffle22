#!/usr/bin/env node
/*
  Renders the data-driven parts of index.html from assets/js/data.js,
  so the static HTML (SEO, no-JS) and the interactive layer share one source.

  Usage:  npm run render   (or: node tools/build.mjs)
  Not named "build" on purpose: Vercel would run it and look for a /public output.
  It rewrites the blocks between <!-- build:NAME --> and <!-- /build:NAME --> in place.
*/
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { IMG, SAUCES, FORMATS, TARIFS, MAGS, QR_MENU } from '../assets/js/data.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'index.html');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');

/* Mobile list gets two large editorial moments; everything else is compact. */
const FEATURE = new Set(['sweet-moment', 'only']);

function thumb(t) {
  const v = t.variants[0];
  const meta = IMG[v.img];
  if (FEATURE.has(t.id) && meta.s) {
    return `<img src="assets/img/${v.img}-480.webp" srcset="assets/img/${v.img}-480.webp 480w, assets/img/${v.img}.webp ${meta.w}w" sizes="(max-width: 899px) calc(100vw - 32px), 1px" width="480" height="480" alt="" loading="lazy" decoding="async">`;
  }
  return `<img src="assets/img/${v.img}-240.webp" width="240" height="240" alt="" loading="lazy" decoding="async">`;
}

function dots(sauces, label = 'Çikolata') {
  const names = sauces.map((k) => SAUCES[k].short.toLocaleLowerCase('tr')).join(', ');
  const is = sauces.map((k) => `<i style="--c:${SAUCES[k].color}"></i>`).join('');
  return `<span class="dots" role="img" aria-label="${esc(label)}: ${esc(names)}">${is}</span>`;
}

function row(t, i) {
  const v = t.variants[0];
  const formats = t.variants.map((x) => `<span>${FORMATS[x.key]}</span>`).join('');
  return `
          <li class="row${FEATURE.has(t.id) ? ' row--feature' : ''}" data-id="${t.id}" data-sauces="${t.sauces.join(' ')}">
            <span class="row__no" aria-hidden="true">${pad(i + 1)}</span>
            <span class="row__thumb kare">${thumb(t)}</span>
            <h3 class="row__name"${t.lang === 'en' ? ' lang="en"' : ''}><button type="button" class="row__btn" data-open="${t.id}">${esc(t.name)}</button></h3>
            ${dots(t.sauces)}
            <p class="row__desc">${esc(v.desc)}</p>
            <p class="row__formats">${formats}</p>
          </li>`;
}

/* Drip lengths are fixed (not random) so the rail reads as hand-poured but stays stable. */
const LENGTHS = [1.15, 0.8, 1.35, 0.95, 1.2, 0.75, 1.05, 0.9];

function sauces() {
  return Object.entries(SAUCES).map(([k, s], i) => {
    const n = TARIFS.filter((t) => t.sauces.includes(k)).length;
    return `
        <button type="button" class="drip" aria-pressed="false" data-sauce="${k}" style="--c:${s.color};--len:${LENGTHS[i]}">
          <span class="drip__body" aria-hidden="true"></span>
          <span class="drip__label">${esc(s.short)} <small>${n} tarif</small></span>
        </button>`;
  }).join('');
}

const BRANCHES = [
  { key: 'maltepe', name: 'Waffle Mina Maltepe', street: 'Altıntepe Mah. Galipbey Cad. No:11/F', locality: 'Maltepe', postal: null, tel: '+90 545 761 53 43', map: 'https://maps.app.goo.gl/n3JVC8Z9jvhkWi5J9' },
  { key: 'halicioglu', name: 'Waffle Mina Halıcıoğlu', street: 'Halıcıoğlu, Tütüncü Abbas Sk. No: 3/A', locality: 'Beyoğlu', postal: '34445', tel: '+90 533 899 37 00' },
  { key: 'umraniye', name: 'Waffle Mina Ümraniye', street: 'Çakmak, Bağcı Sk. No:9/A', locality: 'Ümraniye', postal: '34774', tel: '+90 543 733 13 82' },
  { key: 'kadikoy', name: 'Waffle Mina Kadıköy', street: 'Eğitim Mah. Nahit Bey Sk. No:48/B', locality: 'Kadıköy', postal: null, tel: '+90 507 343 56 00' },
  { key: 'atasehir', name: 'Waffle Mina Ataşehir', street: 'İçerenköy Mah. Sonbahar Sk. No:23/E', locality: 'Ataşehir', postal: null, tel: '+90 539 635 33 04' },
];

function jsonld() {
  const site = 'https://wafflemina.com/';
  const org = {
    '@type': 'Organization',
    '@id': site + '#marka',
    name: 'Waffle Mina',
    url: site,
    logo: site + 'assets/brand/logo.png',
    email: 'info@wafflemina.com',
    telephone: '+90 545 761 53 43',
    sameAs: ['https://www.instagram.com/waffle_mina/'],
  };
  const shops = BRANCHES.map((b) => ({
    '@type': 'CafeOrCoffeeShop',
    '@id': `${site}#sube-${b.key}`,
    name: b.name,
    parentOrganization: { '@id': site + '#marka' },
    image: site + 'assets/img/og-waffle-mina.jpg',
    url: site + '#subeler',
    telephone: b.tel,
    servesCuisine: ['Waffle', 'Tatlı', 'Kahve'],
    hasMenu: QR_MENU,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.street,
      addressLocality: b.locality,
      addressRegion: 'İstanbul',
      ...(b.postal ? { postalCode: b.postal } : {}),
      addressCountry: 'TR',
    },
    ...(b.map ? { hasMap: b.map } : {}),
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '14:00',
      closes: '23:59',
    }],
  }));
  const data = { '@context': 'https://schema.org', '@graph': [org, ...shops] };
  return `\n  <script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n  </script>`;
}

/* Replaces everything between the markers; running it twice gives the same file. */
function inject(html, name, content) {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?\\n([ \\t]*)(<!-- /build:${name} -->)`);
  if (!re.test(html)) throw new Error(`marker build:${name} not found`);
  return html.replace(re, (_, start, indent, end) => `${start}${content.replace(/\s+$/, '')}\n${indent}${end}`);
}

let html = await readFile(file, 'utf8');
html = inject(html, 'tarifler', TARIFS.map(row).join(''));
html = inject(html, 'sauces', sauces());
html = inject(html, 'jsonld', jsonld());
html = inject(html, 'mags', '\n            ' + Object.values(MAGS).map((m) => esc(m.name)).join(' · '));
await writeFile(file, html);
console.log(`index.html: ${TARIFS.length} tarif, ${Object.keys(SAUCES).length} sos, ${BRANCHES.length} şube`);
