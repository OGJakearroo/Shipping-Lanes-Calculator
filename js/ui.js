// -- ONBOARDING MODAL --
function showStartBalanceModal() {
  obGoto(0);
  ['modal-balance','ob-current-ship','ob-current-sale','ob-current-profit-nm','ob-target-ship','ob-target-price','ob-target-profit-nm','ob-sell-point'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('ob-sellpoint-field').style.display = 'none';
  document.getElementById('modal-error').style.display = 'none';
  document.getElementById('modal-backdrop').classList.remove('hidden');
  setTimeout(() => document.getElementById('modal-balance').focus(), 100);
}

function obGoto(step) {
  [0,1,2].forEach(i => {
    document.getElementById('ob-pane-' + i).classList.toggle('visible', i === step);
    const dot = document.getElementById('ob-dot-' + i);
    dot.classList.toggle('active', i === step);
    dot.classList.toggle('done', i < step);
  });
}

function obNext(step) {
  if (step === 0) {
    const errEl = document.getElementById('modal-error');
    const val = pn(document.getElementById('modal-balance').value);
    if (isNaN(val) || val <= 0) {
      errEl.textContent = 'Please enter your current in-game balance.';
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';
  }
  obGoto(step + 1);
  setTimeout(() => {
    const focusIds = ['ob-current-ship', 'ob-target-ship'];
    const el = document.getElementById(focusIds[step]);
    if (el) el.focus();
  }, 50);
}

function obBack(step) { obGoto(step - 1); }

function obSkip(step) {
  if (step >= 2) { obFinish(); } else { obGoto(step + 1); }
}

function obUpdateSellPoint() {
  const sale  = pn(document.getElementById('ob-current-sale').value);
  const price = pn(document.getElementById('ob-target-price').value);
  const field = document.getElementById('ob-sellpoint-field');
  if (!isNaN(price) && price > 0) {
    const sp = Math.max(0, price - (isNaN(sale) ? 0 : sale));
    document.getElementById('ob-sell-point').value = Math.round(sp).toLocaleString();
    field.style.display = 'block';
  } else {
    field.style.display = 'none';
  }
}

function obFinish() {
  const val              = pn(document.getElementById('modal-balance').value);
  const currentShip      = document.getElementById('ob-current-ship').value.trim();
  const currentSale      = pn(document.getElementById('ob-current-sale').value);
  const currentProfitNM  = pn(document.getElementById('ob-current-profit-nm').value);
  const targetShip       = document.getElementById('ob-target-ship').value.trim();
  const targetPrice      = pn(document.getElementById('ob-target-price').value);
  const targetProfitNM   = pn(document.getElementById('ob-target-profit-nm').value);

  runs = [{
    id: Date.now(),
    run: 'Start',
    balance: val,
    fuel: 0,
    gross: 0,
    net: 0,
    duration: null,
    timestamp: new Date().toISOString()
  }];
  settings.startBalance = val;
  if (currentShip) {
    settings.currentShip = currentShip;
    const ship = findShip(currentShip);
    if (ship) {
      settings.currentSale = ship.resale;
      if (!currentProfitNM || isNaN(currentProfitNM)) settings.profitNM = ship.profitNM;
      settings.cargo = ship.cargo;
    }
  }
  if (!isNaN(currentSale) && currentSale > 0) settings.currentSale = currentSale;
  if (!isNaN(currentProfitNM) && currentProfitNM > 0) settings.profitNM = currentProfitNM;
  if (targetShip) {
    settings.targetShip = targetShip;
    const ship = findShip(targetShip);
    if (ship) {
      settings.targetPrice = ship.price;
      if (!targetProfitNM || isNaN(targetProfitNM)) settings.targetProfitNM = ship.profitNM;
    }
  }
  if (!isNaN(targetProfitNM) && targetProfitNM > 0) settings.targetProfitNM = targetProfitNM;
  if (!isNaN(targetPrice) && targetPrice > 0) settings.targetPrice = targetPrice;

  // Calculate sell point
  const sp = settings.targetPrice - (settings.currentSale || 0);
  if (sp > 0) settings.sellPoint = sp;

  save();
  document.getElementById('modal-backdrop').classList.add('hidden');
  loadSettingsToForm();
  render();
}

// -- SHIP SELECTOR COMPONENT --
function initShipSelector(inputId, opts = {}) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const wrap = document.createElement('div');
  wrap.className = 'ship-select-wrap';
  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(input);

  const dropdown = document.createElement('div');
  dropdown.className = 'ship-dropdown';
  wrap.appendChild(dropdown);

  let highlighted = -1;
  let filteredShips = [];

  function renderDropdown(filter) {
    const q = (filter || '').toLowerCase().trim();
    const groups = {};

    SHIP_DATABASE.forEach(ship => {
      if (q && !ship.name.toLowerCase().includes(q) && !ship.cargo.toLowerCase().includes(q)) return;
      if (!groups[ship.cargo]) groups[ship.cargo] = [];
      groups[ship.cargo].push(ship);
    });

    filteredShips = [];
    let html = '';
    for (const [cargo, ships] of Object.entries(groups)) {
      html += '<div class="ship-dropdown-group">' + esc(cargo) + '</div>';
      ships.forEach(ship => {
        const idx = filteredShips.length;
        filteredShips.push(ship);
        const priceStr = ship.price === 0 ? 'Free' : fmts(ship.price);
        const profitStr = fmtf(ship.profitNM) + '/NM';
        html += '<div class="ship-dropdown-item" data-idx="' + idx + '">'
          + '<span class="ship-name">' + esc(ship.name) + '</span>'
          + '<span class="ship-price">' + priceStr + ' &middot; ' + profitStr + '</span>'
          + '</div>';
      });
    }

    if (filteredShips.length === 0) {
      html = '<div style="padding:12px;color:var(--muted);font-size:0.78rem;text-align:center">No ships found</div>';
    }

    dropdown.innerHTML = html;
    dropdown.classList.add('open');
    highlighted = -1;
  }

  function selectShip(ship) {
    input.value = ship.name;
    dropdown.classList.remove('open');
    if (opts.onSelect) opts.onSelect(ship);
  }

  function highlightItem(idx) {
    dropdown.querySelectorAll('.ship-dropdown-item').forEach(el => el.classList.remove('highlighted'));
    if (idx >= 0 && idx < filteredShips.length) {
      const el = dropdown.querySelector('[data-idx="' + idx + '"]');
      if (el) { el.classList.add('highlighted'); el.scrollIntoView({ block: 'nearest' }); }
    }
    highlighted = idx;
  }

  input.addEventListener('focus', () => renderDropdown(input.value));
  input.addEventListener('input', () => renderDropdown(input.value));

  input.addEventListener('keydown', (e) => {
    if (!dropdown.classList.contains('open')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); highlightItem(Math.min(highlighted + 1, filteredShips.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); highlightItem(Math.max(highlighted - 1, 0)); }
    else if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); selectShip(filteredShips[highlighted]); }
    else if (e.key === 'Escape') { dropdown.classList.remove('open'); }
  });

  dropdown.addEventListener('mousedown', (e) => {
    e.preventDefault(); // prevent blur
    const item = e.target.closest('.ship-dropdown-item');
    if (item) {
      const idx = parseInt(item.dataset.idx);
      if (!isNaN(idx) && filteredShips[idx]) selectShip(filteredShips[idx]);
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) dropdown.classList.remove('open');
  });
}

// -- TABS --
function switchTab(name) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(el => {
    if (el.dataset.tab === name) el.classList.add('active');
  });
  if (name === 'dashboard' && runs.length > 0) {
    const { avgNet } = stats();
    drawChart(
      avgNet > 0 ? Math.ceil(Math.max(0, settings.sellPoint - runs[runs.length - 1].balance) / avgNet) : 0,
      avgNet, settings.sellPoint, settings.targetPrice
    );
  }
  if (name === 'efficiency' && runs.length > 0) {
    renderEfficiency();
  }
  if (name === 'routes') {
    renderRouteCalculator();
  }
}

// -- LOG RUN --
function updatePreview() {
  const b    = pn(document.getElementById('inp-balance').value);
  const f    = pn(document.getElementById('inp-fuel').value);
  const prev = document.getElementById('run-preview');
  if (isNaN(b) || isNaN(f)) { prev.style.display = 'none'; return; }
  const latest = runs[runs.length - 1];
  const net    = b - latest.balance;
  const gross  = net + f;
  prev.style.display = 'block';
  document.getElementById('prev-gross').textContent = fmt(gross);
  document.getElementById('prev-gross').style.color = gross > 0 ? 'var(--text)' : 'var(--red)';
  document.getElementById('prev-fuel').textContent  = '-' + fmt(f);
  document.getElementById('prev-net').textContent   = (net > 0 ? '+' : '') + fmt(net);
  document.getElementById('prev-net').style.color   = net > 0 ? 'var(--green)' : 'var(--red)';
}

function updateDurPreview() {
  const s  = document.getElementById('inp-start').value;
  const e  = document.getElementById('inp-end').value;
  const d  = calcDuration(s, e);
  const el = document.getElementById('dur-preview');
  const { avgDur } = stats();
  if (d !== null) {
    el.style.display = 'block';
    el.textContent = '\u23F1 ' + d + ' min trip \u00B7 avg is ' + avgDur.toFixed(0) + ' min';
  } else { el.style.display = 'none'; }
}

function logRun() {
  const errEl = document.getElementById('log-error');
  errEl.style.display = 'none';
  if (runs.length === 0) { showStartBalanceModal(); return; }
  const bal  = pn(document.getElementById('inp-balance').value);
  const fuel = pn(document.getElementById('inp-fuel').value);
  const odoStart = pn(document.getElementById('inp-odo-start').value);
  const odoEnd   = pn(document.getElementById('inp-odo-end').value);
  const dur  = calcDuration(
    document.getElementById('inp-start').value,
    document.getElementById('inp-end').value
  );
  if (isNaN(bal) || isNaN(fuel)) {
    errEl.textContent = 'Balance and fuel cost are required.';
    errEl.style.display = 'block'; return;
  }
  const prev  = runs[runs.length - 1];
  const net   = bal - prev.balance;
  const gross = net + fuel;
  const { completed } = stats();
  runs.push({
    id: Date.now(),
    run: 'Run ' + (completed.length + 1),
    balance: bal,
    fuel,
    gross,
    net,
    odoStart: (!isNaN(odoStart) && odoStart > 0) ? odoStart : null,
    odoEnd:   (!isNaN(odoEnd)   && odoEnd   > 0) ? odoEnd   : null,
    duration: dur,
    timestamp: new Date().toISOString()
  });
  document.getElementById('inp-balance').value   = '';
  document.getElementById('inp-fuel').value      = '';
  document.getElementById('inp-odo-start').value = '';
  document.getElementById('inp-odo-end').value   = '';
  document.getElementById('inp-start').value     = '';
  document.getElementById('inp-end').value       = '';
  document.getElementById('run-preview').style.display  = 'none';
  document.getElementById('dur-preview').style.display  = 'none';
  clearLogForm();
  save(); render();
  switchTab('dashboard');
}

function undoLast() {
  if (runs.length > 1) { runs.pop(); save(); render(); }
}

function deleteRun(idx) {
  if (idx === 0 || idx >= runs.length) return;
  runs.splice(idx, 1);
  recalcRuns();
  save(); render();
}

// -- HISTORY EDITING --
function recalcRuns() {
  for (let i = 1; i < runs.length; i++) {
    runs[i].net   = runs[i].balance - runs[i - 1].balance;
    runs[i].gross = runs[i].net + runs[i].fuel;
  }
}

function editCell(e, idx, field) {
  const td = e.currentTarget;
  if (td.querySelector('input')) return;
  const r = runs[idx];
  let rawVal = '';
  if (field === 'balance')  rawVal = r.balance  || '';
  if (field === 'fuel')     rawVal = r.fuel     || '';
  if (field === 'odoStart') rawVal = r.odoStart || '';
  if (field === 'odoEnd')   rawVal = r.odoEnd   || '';
  if (field === 'duration') rawVal = r.duration || '';
  if (field === 'run')      rawVal = r.run;

  const inp = document.createElement('input');
  inp.type  = 'text';
  inp.value = rawVal;
  inp.style.cssText = 'width:100%;min-width:80px;background:var(--input-bg);border:1px solid var(--cyan);border-radius:3px;padding:3px 6px;color:var(--text);font-family:var(--mono);font-size:0.78rem;text-align:' + (field === 'run' ? 'left' : 'right') + ';outline:none;';
  inp.onblur    = () => saveCell(idx, field, inp.value);
  inp.onkeydown = ev => {
    if (ev.key === 'Enter') inp.blur();
    if (ev.key === 'Escape') render();
  };
  td.textContent = '';
  td.appendChild(inp);
  inp.focus();
  inp.select();
}

function saveCell(idx, field, rawValue) {
  const r = runs[idx];
  if (field === 'run') {
    const v = rawValue.trim();
    if (v) r.run = v;
  } else if (field === 'balance') {
    const v = pn(rawValue);
    if (!isNaN(v) && v >= 0) { r.balance = v; recalcRuns(); }
  } else if (field === 'fuel') {
    const v = pn(rawValue);
    if (!isNaN(v) && v >= 0) {
      r.fuel  = v;
      r.net   = r.balance - (runs[idx - 1]?.balance ?? r.balance);
      r.gross = r.net + r.fuel;
    }
  } else if (field === 'odoStart') {
    const v = pn(rawValue);
    r.odoStart = (!isNaN(v) && v > 0) ? v : null;
  } else if (field === 'odoEnd') {
    const v = pn(rawValue);
    r.odoEnd = (!isNaN(v) && v > 0) ? v : null;
  } else if (field === 'duration') {
    const v = parseInt(rawValue);
    r.duration = (!isNaN(v) && v > 0) ? v : null;
  }
  save();
  render();
}

function resetAll() {
  if (!confirm('Reset everything?\n\nThis will clear your run history AND all ship settings.\n\nOK = Reset everything\nCancel = Do nothing')) return;
  runs = [];
  settings = { ...DEFAULT_SETTINGS };
  loadSettingsToForm();
  save();
  render();
  showStartBalanceModal();
}

// -- SELL POINT CALC --
function calcSellPoint() {
  const sale  = pn(document.getElementById('set-current-sale').value);
  const price = pn(document.getElementById('set-target-price').value);
  if (!isNaN(sale) && !isNaN(price) && sale >= 0 && price > 0) {
    const sp = Math.max(0, price - sale);
    document.getElementById('set-sell-point').value = Math.round(sp).toLocaleString();
  }
  saveSettings();
}

// -- SETTINGS --
function loadSettingsToForm() {
  document.getElementById('set-current-ship').value     = settings.currentShip    || '';
  document.getElementById('set-current-sale').value     = fmtNum(settings.currentSale)    || '';
  document.getElementById('set-sell-point').value       = fmtNum(settings.sellPoint)      || '';
  document.getElementById('set-profit-nm').value        = fmtNum(settings.profitNM)       || '';
  document.getElementById('set-target-ship').value      = settings.targetShip     || '';
  document.getElementById('set-target-price').value     = fmtNum(settings.targetPrice)    || '';
  document.getElementById('set-target-profit-nm').value = fmtNum(settings.targetProfitNM) || '';
  document.getElementById('set-cargo').value            = settings.cargo          || '';
  document.getElementById('set-start-balance').value    = fmtNum(settings.startBalance)   || '';
  if (settings.sellPoint) {
    document.getElementById('set-sell-point').value = Math.round(settings.sellPoint).toLocaleString();
  } else {
    const sale  = settings.currentSale  || 0;
    const price = settings.targetPrice  || 0;
    if (price > 0) document.getElementById('set-sell-point').value = Math.round(Math.max(0, price - sale)).toLocaleString();
  }
}

function saveSettings() {
  applySettings(true);
}

function applySettings(silent) {
  if (silent === undefined) silent = false;
  const g  = id => pn(document.getElementById(id).value);
  const gs = id => document.getElementById(id).value.trim();

  if (gs('set-current-ship'))    settings.currentShip    = gs('set-current-ship');
  if (!isNaN(g('set-current-sale')) && g('set-current-sale') >= 0) settings.currentSale = g('set-current-sale');
  if (!isNaN(g('set-sell-point'))   && g('set-sell-point')   >= 0) settings.sellPoint   = g('set-sell-point');
  if (!isNaN(g('set-profit-nm'))    && g('set-profit-nm')    >= 0) settings.profitNM    = g('set-profit-nm');
  if (gs('set-target-ship'))     settings.targetShip     = gs('set-target-ship');
  if (!isNaN(g('set-target-price'))     && g('set-target-price')     >= 0) settings.targetPrice     = g('set-target-price');
  if (!isNaN(g('set-target-profit-nm')) && g('set-target-profit-nm') >= 0) settings.targetProfitNM = g('set-target-profit-nm');
  if (gs('set-cargo'))           settings.cargo          = gs('set-cargo');

  const newStartBal = g('set-start-balance');
  if (!isNaN(newStartBal) && newStartBal >= 0 && newStartBal !== settings.startBalance) {
    settings.startBalance = newStartBal;
    if (runs.length > 0) {
      runs[0].balance = newStartBal;
    }
  }

  save();
  if (runs.length > 0) render();
  renderJobComparison();
  if (!silent) {
    const el = document.getElementById('settings-saved');
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 2000);
  }
}

// -- EXPORT / IMPORT --
function exportStamp() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5).replace(':', 'h') + 'm';
  const ship = (settings.currentShip || 'export').replace(/\s+/g, '-').toLowerCase();
  return ship + '_' + date + '_' + time;
}

function exportJSON() {
  const data = JSON.stringify({ runs, settings, seasons }, null, 2);
  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
  a.download = 'shipping-' + exportStamp() + '.json';
  a.click();
}

function exportCSV() {
  const rows = [['Run', 'Balance', 'Fuel', 'Gross', 'Net', 'Odo Start', 'Odo End', 'Distance', 'Duration (min)', 'Timestamp']];
  runs.forEach(r => {
    const dist = (r.odoEnd && r.odoStart) ? r.odoEnd - r.odoStart : '';
    rows.push([r.run, r.balance, r.fuel, r.gross, r.net, r.odoStart || '', r.odoEnd || '', dist, r.duration || '', r.timestamp]);
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'shipping-' + exportStamp() + '.csv';
  a.click();
}

function importJSON() {
  const errEl = document.getElementById('import-error');
  errEl.style.display = 'none';
  try {
    const data = JSON.parse(document.getElementById('import-area').value);
    if (!data.runs || !Array.isArray(data.runs)) throw new Error('Invalid format');
    runs = data.runs;
    if (data.settings) settings = { ...DEFAULT_SETTINGS, ...data.settings };
    if (data.seasons) seasons = data.seasons;
    save(); loadSettingsToForm(); render();
    document.getElementById('import-area').value = '';
    alert('Data imported successfully!');
  } catch (e) {
    errEl.textContent = 'Invalid JSON: ' + e.message;
    errEl.style.display = 'block';
  }
}

function copyShareURL() {
  const s = {
    b: settings.startBalance, cs: settings.currentShip, cr: settings.currentSale,
    sp: settings.sellPoint,   pn: settings.profitNM,    ts: settings.targetShip,
    tp: settings.targetPrice, tn: settings.targetProfitNM, cg: settings.cargo
  };
  let r = runs.map(run => [run.balance, run.fuel||0, run.odoStart||0, run.odoEnd||0, run.duration||0]);
  const prefix = location.href.split('?')[0] + '?data=';
  while (r.length > 1) {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify({ v: 2, s, r }))));
    if ((prefix + encoded).length <= 2000) break;
    r = [r[0], ...r.slice(2)];
  }
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify({ v: 2, s, r }))));
  const longUrl = prefix + encoded;
  const btn = document.getElementById('share-btn');
  const el  = document.getElementById('share-copied');

  btn.disabled = true;
  btn.textContent = 'Shortening\u2026';

  fetch('https://is.gd/create.php?format=simple&url=' + encodeURIComponent(longUrl))
    .then(res => res.ok ? res.text() : Promise.reject())
    .then(short => navigator.clipboard.writeText(short.trim()).then(() => {
      el.style.color = 'var(--green)';
      el.textContent = 'Short URL copied! ' + short.trim();
    }))
    .catch(() => navigator.clipboard.writeText(longUrl).then(() => {
      el.style.color = 'var(--muted)';
      el.textContent = 'Copied full URL (shortener unavailable)';
    }))
    .finally(() => {
      el.style.display = 'block';
      btn.disabled = false;
      btn.textContent = '\uD83D\uDD17 Copy Share URL';
      setTimeout(() => el.style.display = 'none', 4000);
    });
}

function loadFromURL() {
  const p = new URLSearchParams(location.search);
  if (!p.has('data')) return;
  try {
    let data;
    try {
      data = JSON.parse(decodeURIComponent(escape(atob(p.get('data')))));
    } catch {
      data = JSON.parse(decodeURIComponent(atob(p.get('data'))));
    }
    if (data.v === 2) {
      const s = data.s || {};
      settings = { ...DEFAULT_SETTINGS,
        startBalance: s.b||0, currentShip: s.cs||'', currentSale: s.cr||0,
        sellPoint: s.sp||0,   profitNM: s.pn||0,     targetShip: s.ts||'',
        targetPrice: s.tp||0, targetProfitNM: s.tn||0, cargo: s.cg||''
      };
      runs = (data.r || []).map((a, i) => ({
        balance: a[0], fuel: a[1]||0,
        odoStart: a[2]||null, odoEnd: a[3]||null, duration: a[4]||null,
        run: i === 0 ? 'Start' : 'Run ' + i, gross: 0, net: 0
      }));
      runs.forEach((r, i) => {
        if (i === 0) return;
        r.net = r.balance - runs[i-1].balance;
        r.gross = r.net + r.fuel;
      });
    } else {
      if (data.runs) runs = data.runs;
      if (data.settings) settings = { ...DEFAULT_SETTINGS, ...data.settings };
    }
  } catch {}
  history.replaceState(null, '', location.pathname);
}

// -- LOG FORM PERSISTENCE --
function saveLogForm() {
  try {
    localStorage.setItem(LOG_FORM_KEY, JSON.stringify({
      balance:  document.getElementById('inp-balance').value,
      fuel:     document.getElementById('inp-fuel').value,
      odoStart: document.getElementById('inp-odo-start').value,
      odoEnd:   document.getElementById('inp-odo-end').value,
      start:    document.getElementById('inp-start').value,
      end:      document.getElementById('inp-end').value,
    }));
  } catch {}
}

function loadLogForm() {
  try {
    const raw = localStorage.getItem(LOG_FORM_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    const set = (id, val) => { if (val != null && val !== '') { const el = document.getElementById(id); el.value = val; formatInput(el); } };
    set('inp-balance',   d.balance);
    set('inp-fuel',      d.fuel);
    set('inp-odo-start', d.odoStart);
    set('inp-odo-end',   d.odoEnd);
    if (d.start) document.getElementById('inp-start').value = d.start;
    if (d.end)   document.getElementById('inp-end').value   = d.end;
    if (runs.length > 0) { updatePreview(); updateDurPreview(); }
  } catch {}
}

function clearLogForm() {
  localStorage.removeItem(LOG_FORM_KEY);
}

// -- SEASONS (Multi-ship history) --
function archiveSeason(newShipName) {
  if (runs.length <= 1) return;
  const { completed, avgNet } = stats();
  const latest = runs[runs.length - 1];
  seasons.push({
    id: Date.now(),
    ship: settings.currentShip || 'Unknown Ship',
    targetShip: settings.targetShip || '',
    runs: [...runs],
    settings: { ...settings },
    startDate: runs[0].timestamp,
    endDate: latest.timestamp,
    totalEarned: latest.balance - runs[0].balance,
    totalRuns: completed.length,
    avgNet: avgNet,
  });
  save();
}

function renderSeasons() {
  const container = document.getElementById('seasons-list');
  if (!container) return;
  if (seasons.length === 0) {
    container.innerHTML = '<div style="color:var(--muted);font-size:0.78rem;font-family:var(--mono);text-align:center;padding:20px">No archived seasons yet. When you upgrade ships, your current progress will be archived here.</div>';
    return;
  }
  container.innerHTML = seasons.map((s, i) => {
    const earned = fmt(s.totalEarned);
    const dateStr = new Date(s.startDate).toLocaleDateString();
    return '<div class="season-card">'
      + '<div class="season-header">'
      + '<span class="season-title">' + esc(s.ship) + ' \u2192 ' + esc(s.targetShip || '?') + '</span>'
      + '<span class="season-meta">' + dateStr + '</span>'
      + '</div>'
      + '<div class="season-stats">'
      + '<span>' + s.totalRuns + ' runs</span>'
      + '<span>Earned: ' + earned + '</span>'
      + '<span>Avg: ' + fmts(s.avgNet) + '/run</span>'
      + '</div>'
      + '</div>';
  }).join('');
}

function startNewSeason() {
  if (runs.length <= 1) { alert('No runs to archive.'); return; }
  if (!confirm('Archive current progress and start fresh?\n\nYour run history will be saved and you can view it later.')) return;
  archiveSeason();
  // Reset for new ship
  const latestBalance = runs[runs.length - 1].balance;
  runs = [{
    id: Date.now(),
    run: 'Start',
    balance: latestBalance,
    fuel: 0, gross: 0, net: 0, duration: null,
    timestamp: new Date().toISOString()
  }];
  settings.startBalance = latestBalance;
  // Keep target as new current
  if (settings.targetShip) {
    const ship = findShip(settings.targetShip);
    settings.currentShip = settings.targetShip;
    if (ship) {
      settings.currentSale = ship.resale;
      settings.profitNM = ship.profitNM;
      settings.cargo = ship.cargo;
    }
  }
  settings.targetShip = '';
  settings.targetPrice = 0;
  settings.targetProfitNM = 0;
  settings.sellPoint = 0;
  save();
  loadSettingsToForm();
  render();
  renderSeasons();
}
