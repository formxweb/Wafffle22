/*
  Waffle Mina — menu data
  Source of truth: the official QR menu (wafflemina.adisyonqr.com).
  Names and ingredients are copied verbatim (only spacing/capitalisation normalised).
  Prices are deliberately NOT stored here: they change and differ per branch,
  so the site always links to the QR menu for current prices.
*/

/* Images: square crops in assets/img. `w` = width of the largest file,
   `s` = whether a 480px variant exists. */
export const IMG = {
  'mina-tabak': { w: 450 }, 'berry-tabak': { w: 450 }, 'senior-tabak': { w: 450 },
  'sweet-tabak': { w: 591, s: 1 }, 'pinky-tabak': { w: 450 }, 'verynutty-tabak': { w: 450 },
  'dark-tabak': { w: 450 }, 'only-tabak': { w: 807, s: 1 }, 'white-tabak': { w: 450 },
  'stroop-tabak': { w: 450 }, 'city-tabak': { w: 450 },
  'mina-cup': { w: 533, s: 1 }, 'berry-cup': { w: 959, s: 1 }, 'yummygum-cup': { w: 584, s: 1 },
  'mina-bardak': { w: 666, s: 1 }, 'berry-bardak': { w: 666, s: 1 }, 'senior-bardak': { w: 400 },
  'white-bardak': { w: 666, s: 1 }, 'city-bardak': { w: 400 }, 'dark-bardak': { w: 400 },
  'stroop-bardak': { w: 960, s: 1 }, 'pinky-bardak': { w: 400 },
  'tatli-muz': { w: 666, s: 1 }, 'tatli-cilek': { w: 400 }, 'tatli-muzcilek': { w: 666, s: 1 },
  'armoni': { w: 400 }, 'sekiz-sos': { w: 960, s: 1 }, 'duvar': { w: 900, s: 1 },
};

/* The eight chocolates on the menu. Colours sampled from the brand's own photos. */
export const SAUCES = {
  sutlu:    { name: 'Sütlü çikolata',          short: 'Sütlü',         color: '#6A3418' },
  beyaz:    { name: 'Beyaz çikolata',          short: 'Beyaz',         color: '#F5ECDA' },
  bitter:   { name: 'Bitter çikolata',         short: 'Bitter',        color: '#2A120A' },
  fistik:   { name: 'Antep fıstığı çikolata',  short: 'Antep fıstığı', color: '#9DB54C' },
  cilek:    { name: 'Özel çilek çikolata',     short: 'Özel çilek',    color: '#E2607A' },
  karamel:  { name: 'Karamel çikolata',        short: 'Karamel',       color: '#C98A2E' },
  frambuaz: { name: 'Frambuaz çikolata',       short: 'Frambuaz',      color: '#D93A86' },
  bubble:   { name: 'Bubble gum çikolata',     short: 'Bubble gum',    color: '#22BCE0' },
};

/* Format labels. On the menu: WAFFLES / WAFFLE CUPS / BARDAKTA WAFFLE. */
export const FORMATS = { tabak: 'Tabakta', cup: 'Cup', bardak: 'Bardakta' };

const BARDAK = 'özel Belçika küp waffle parçaları, ';
const CUP_SIZES = ['Küçük boy', 'Büyük boy'];

/* Twelve waffle recipes. A recipe is a flavour; it may exist in up to three formats. */
export const TARIFS = [
  {
    id: 'waffle-mina', name: 'Waffle Mina', lang: 'en', sauces: ['sutlu', 'beyaz'],
    variants: [
      { key: 'tabak', title: 'Waffle Mina', img: 'mina-tabak', desc: 'sütlü çikolata, beyaz çikolata, muz, çilek, fındık' },
      { key: 'cup', title: 'Waffle Mina Cup', img: 'mina-cup', sizes: CUP_SIZES, desc: 'sütlü çikolata, beyaz çikolata, muz, çilek, fındık' },
      { key: 'bardak', title: 'Bardakta Mina', img: 'mina-bardak', desc: BARDAK + 'sütlü çikolata, beyaz çikolata, muz, çilek, fındık' },
    ],
  },
  {
    id: 'berry-combo', name: 'Berry Combo', lang: 'en', sauces: ['sutlu', 'beyaz'],
    variants: [
      { key: 'tabak', title: 'Waffle Berry Combo', img: 'berry-tabak', desc: 'sütlü çikolata, beyaz çikolata, çilek, frambuaz, böğürtlen, dağ çileği, yaban mersini, fındık' },
      { key: 'cup', title: 'Berry Combo Cup', img: 'berry-cup', sizes: CUP_SIZES, desc: 'sütlü çikolata, beyaz çikolata, çilek, frambuaz, böğürtlen, dağ çileği, yaban mersini, fındık' },
      { key: 'bardak', title: 'Bardakta Berry Combo', img: 'berry-bardak', desc: BARDAK + 'sütlü çikolata, beyaz çikolata, çilek, orman meyveleri, fındık' },
    ],
  },
  {
    id: 'senior', name: 'Senior Waffle', lang: 'en', sauces: ['sutlu'],
    variants: [
      { key: 'tabak', title: 'Senior Waffle', img: 'senior-tabak', desc: 'sütlü çikolata, muz, çilek, fındık' },
      { key: 'bardak', title: 'Bardakta Senior', img: 'senior-bardak', desc: BARDAK + 'sütlü çikolata, muz, çilek, fındık' },
    ],
  },
  {
    id: 'sweet-moment', name: 'Sweet Moment', lang: 'en', sauces: ['sutlu', 'beyaz', 'fistik'],
    variants: [
      { key: 'tabak', title: 'Waffle Sweet Moment', img: 'sweet-tabak', desc: 'sütlü çikolata, beyaz çikolata, antep fıstığı çikolata, muz, çilek, orman meyveleri, fındık' },
    ],
  },
  {
    id: 'pinky', name: 'Pinky Waffle', lang: 'en', sauces: ['sutlu', 'cilek'],
    variants: [
      { key: 'tabak', title: 'Pinky Waffle', img: 'pinky-tabak', desc: 'sütlü çikolata, özel çilek çikolata, çilek, fındık' },
      { key: 'bardak', title: 'Bardakta Pinky', img: 'pinky-bardak', desc: BARDAK + 'sütlü çikolata, özel çilek çikolata, çilek, fındık' },
    ],
  },
  {
    id: 'verynutty', name: 'Verynutty', lang: 'en', sauces: ['fistik', 'beyaz'],
    variants: [
      { key: 'tabak', title: 'Verynutty Waffle', img: 'verynutty-tabak', desc: 'antep fıstığı çikolata, beyaz çikolata, muz, çilek, fındık' },
    ],
  },
  {
    id: 'dark', name: 'Waffle Dark', lang: 'en', sauces: ['bitter'],
    variants: [
      { key: 'tabak', title: 'Waffle Dark', img: 'dark-tabak', desc: 'bitter çikolata, muz, çilek, fındık' },
      { key: 'bardak', title: 'Bardakta Dark', img: 'dark-bardak', desc: BARDAK + 'bitter çikolata, muz, çilek, fındık' },
    ],
  },
  {
    id: 'only', name: 'Waffle Only', lang: 'en', sauces: ['sutlu'],
    variants: [
      { key: 'tabak', title: 'Waffle Only', img: 'only-tabak', desc: 'sütlü çikolata, muz, fındık' },
    ],
  },
  {
    id: 'white', name: 'Waffle White', lang: 'en', sauces: ['beyaz'],
    variants: [
      { key: 'tabak', title: 'Waffle White', img: 'white-tabak', desc: 'beyaz çikolata, muz, çilek, fındık' },
      { key: 'bardak', title: 'Bardakta White', img: 'white-bardak', desc: BARDAK + 'beyaz çikolata, muz, çilek, fındık' },
    ],
  },
  {
    id: 'stroop', name: 'Stroop Waffle', lang: 'en', sauces: ['karamel', 'beyaz'],
    variants: [
      { key: 'tabak', title: 'Stroop Waffle', img: 'stroop-tabak', desc: 'karamel çikolata, beyaz çikolata, muz, çilek, fındık' },
      { key: 'bardak', title: 'Bardakta Stroop', img: 'stroop-bardak', desc: BARDAK + 'beyaz çikolata, karamel çikolata, muz, çilek, fındık' },
    ],
  },
  {
    id: 'city', name: 'Waffle City', lang: 'en', sauces: ['frambuaz', 'beyaz'],
    variants: [
      { key: 'tabak', title: 'Waffle City', img: 'city-tabak', desc: 'frambuaz çikolata, beyaz çikolata, muz, çilek, fındık' },
      { key: 'bardak', title: 'Bardakta City', img: 'city-bardak', desc: BARDAK + 'beyaz çikolata, frambuaz çikolata, muz, çilek, fındık' },
    ],
  },
  {
    id: 'yummygum', name: 'Yummygum', lang: 'en', sauces: ['bubble', 'beyaz'],
    variants: [
      { key: 'cup', title: 'Waffle Yummygum Cup', img: 'yummygum-cup', sizes: CUP_SIZES, desc: 'bubble gum çikolata, beyaz çikolata, muz, çilek, fındık' },
    ],
  },
];

/* Desserts (menu: TATLILAR). Variants are fruit choices, not formats. */
export const TATLILAR = [
  {
    id: 'mina-tatlisi', name: 'Mina Tatlısı', lang: 'en', sauces: ['sutlu'],
    variants: [
      { key: 'muz', label: 'Muzlu', title: 'Mina Tatlısı (Muzlu)', img: 'tatli-muz', desc: 'cevizli çikolata kek parçaları, muz, sütlü çikolata, krep kırığı' },
      { key: 'cilek', label: 'Çilekli', title: 'Mina Tatlısı (Çilekli)', img: 'tatli-cilek', desc: 'cevizli çikolata kek parçaları, çilek, sütlü çikolata, krep kırığı' },
      { key: 'muzcilek', label: 'Muzlu çilekli', title: 'Mina Tatlısı (Muzlu Çilekli)', img: 'tatli-muzcilek', desc: 'cevizli çikolata kek parçaları, muz, çilek, sütlü çikolata, krep kırığı' },
    ],
  },
  {
    id: 'muzlu-armoni', name: 'Muzlu Armoni', lang: 'tr', sauces: ['sutlu', 'bitter'],
    variants: [
      { key: 'tek', title: 'Muzlu Armoni', img: 'armoni', desc: 'cevizli çikolatalı kek, özel Mina kreması, muz, sütlü çikolata ve bitter çikolata, üzerinde fındık' },
    ],
  },
];

/* Magnolia: every combination of three fillings is a product — 2³−1 = 7.
   Keys list fillings in a fixed order (cikolata, cilek, muz); descriptions are the menu's own. */
const MAG_BASE = 'özel mag kreması, toz cici bebe bisküvisi, ';
export const MAG_ORDER = ['cikolata', 'cilek', 'muz'];
export const MAGS = {
  'muz':                { name: 'Muzlu Mag',                        desc: MAG_BASE + 'muz' },
  'cilek':              { name: 'Çilekli Mag',                      desc: MAG_BASE + 'çilek' },
  'cikolata':           { name: 'Çikolatalı Mag',                   desc: MAG_BASE + 'sütlü çikolata' },
  'cikolata+cilek':     { name: 'Çikolatalı ve Çilekli Mag',        desc: MAG_BASE + 'sütlü çikolata, çilek' },
  'cikolata+muz':       { name: 'Çikolatalı ve Muzlu Mag',          desc: MAG_BASE + 'sütlü çikolata, muz' },
  'cilek+muz':          { name: 'Çilekli ve Muzlu Mag',             desc: MAG_BASE + 'çilek, muz' },
  'cikolata+cilek+muz': { name: 'Çikolatalı, Çilekli & Muzlu Mag',  desc: MAG_BASE + 'sütlü çikolata, muz, çilek' },
};

export const QR_MENU = 'https://wafflemina.adisyonqr.com/';
