// -- STATE MANAGEMENT --
const BUILD_DATE   = '2026-03-08 15:20';
const STORAGE_KEY  = 'shipping-grind-v2';
const SETTINGS_KEY = 'shipping-grind-settings-v2';
const THEME_KEY    = 'shipping-grind-theme';
const LOG_FORM_KEY = 'shipping-log-form-v1';
const SEASONS_KEY  = 'shipping-seasons-v1';

const DEFAULT_SETTINGS = {
  currentShip: '',
  currentSale: 0,
  sellPoint: 0,
  profitNM: 0,
  targetShip: '',
  targetPrice: 0,
  targetProfitNM: 0,
  cargo: '',
  startBalance: 0,
};

let runs = [];
let settings = { ...DEFAULT_SETTINGS };
let seasons = [];  // archived seasons for multi-ship history

function load() {
  try {
    const sr = localStorage.getItem(STORAGE_KEY);
    runs = sr ? JSON.parse(sr) : [];
  } catch { runs = []; }
  try {
    const ss = localStorage.getItem(SETTINGS_KEY);
    if (ss) settings = { ...DEFAULT_SETTINGS, ...JSON.parse(ss) };
  } catch {}
  try {
    const sv = localStorage.getItem(SEASONS_KEY);
    seasons = sv ? JSON.parse(sv) : [];
  } catch { seasons = []; }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem(SEASONS_KEY, JSON.stringify(seasons));
    const b = document.getElementById('save-badge');
    b.classList.add('show');
    setTimeout(() => b.classList.remove('show'), 1500);
  } catch {}
}

// -- THEME --
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = isLight ? '\u263D' : '\u2600';
  if (runs.length > 0) render();
}

function loadTheme() {
  const t = localStorage.getItem(THEME_KEY);
  if (t === 'light') {
    document.body.classList.add('light');
    document.getElementById('theme-btn').textContent = '\u263D';
  }
}

// -- HELPERS --
const pn   = s => parseFloat(String(s).replace(/,/g, ''));
const fmt  = v => '$' + (v / 1e6).toFixed(2) + 'M';
const fmts = v => '$' + (v / 1e6).toFixed(1) + 'M';
const fmtf = v => '$' + Math.round(v).toLocaleString();
const fmtNum = v => (v && !isNaN(v) && Number(v) > 0) ? Math.round(Number(v)).toLocaleString() : '';

function formatInput(el) {
  const v = pn(el.value);
  if (!isNaN(v) && v > 0) el.value = Math.round(v).toLocaleString();
}

function calcDuration(s, e) {
  if (!s || !e) return null;
  const [sh, sm] = s.split(':').map(Number);
  const [eh, em] = e.split(':').map(Number);
  let m = (eh * 60 + em) - (sh * 60 + sm);
  if (m < 0) m += 1440;
  return m > 0 ? m : null;
}

function stats() {
  const completed = runs.slice(1);
  const avgNet = completed.length
    ? completed.reduce((a, r) => a + r.net, 0) / completed.length
    : 0;
  const timed = completed.filter(r => r.duration);
  const avgDur = timed.length
    ? timed.reduce((a, r) => a + r.duration, 0) / timed.length
    : 45;
  return { completed, avgNet, timed, avgDur };
}

// -- SANITIZE TEXT for safe DOM insertion --
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
