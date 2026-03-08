// -- MAIN RENDER --
function render() {
  if (runs.length === 0) return;

  const latest = runs[runs.length - 1];
  const { completed, avgNet, timed, avgDur } = stats();
  const { sellPoint, currentSale, targetPrice, currentShip, targetShip } = settings;

  // Header
  document.getElementById('hdr-current-ship').textContent = currentShip || '\u2014';
  document.getElementById('hdr-target-ship').textContent  = targetShip  || '\u2014';

  // Progress bar
  const pct = sellPoint > 0 ? Math.min(100, (latest.balance / sellPoint) * 100) : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('prog-current').textContent = fmt(latest.balance) + ' current';
  document.getElementById('prog-pct').textContent     = pct.toFixed(1) + '%';
  document.getElementById('prog-target').textContent  = sellPoint > 0 ? fmt(sellPoint) + ' sell point' : 'Set sell point in Settings';

  // Dashboard empty state
  const hasRuns = completed.length > 0;
  document.getElementById('dashboard-empty').style.display    = hasRuns ? 'none' : 'block';
  document.getElementById('dashboard-content').style.display  = hasRuns ? 'block' : 'none';

  if (!hasRuns) return;

  // Stats
  const stillToSell = Math.max(0, sellPoint - latest.balance);
  const tripsToSell = avgNet > 0 ? Math.ceil(stillToSell / avgNet) : 0;
  const minsToSell  = tripsToSell * avgDur;

  const incomePerHour = timed.length > 0 ? (avgNet / avgDur) * 60 : 0;
  document.getElementById('stat-balance').textContent    = fmt(latest.balance);
  document.getElementById('stat-needed').textContent     = sellPoint > 0 ? fmt(stillToSell) : '\u2014';
  document.getElementById('stat-income-hr').textContent  = incomePerHour > 0 ? fmts(incomePerHour) : '\u2014';
  document.getElementById('stat-time').textContent       = avgNet > 0 ? '~' + (minsToSell / 60).toFixed(1) + ' hrs' : '\u2014';

  // Prediction
  const afterSaleNow  = latest.balance + currentSale;
  const stillAfterNow = Math.max(0, targetPrice - afterSaleNow);
  const tripsAfter    = avgNet > 0 ? Math.max(0, Math.ceil(stillAfterNow / avgNet)) : 0;
  const balAfterSell      = sellPoint + currentSale;
  const stillForTarget    = Math.max(0, targetPrice - balAfterSell);
  const tripsForTarget    = avgNet > 0 ? Math.ceil(stillForTarget / avgNet) : 0;
  const totalTrips        = tripsToSell + tripsForTarget;
  const totalHours        = (totalTrips * avgDur) / 60;
  const durLabel          = timed.length < 2 ? ' (est.)' : '';

  document.getElementById('pred-label').textContent =
    'SMART PREDICTION \u00B7 ' + completed.length + ' runs, avg ' + avgDur.toFixed(0) + ' min/trip';
  document.getElementById('pred-avg-net').textContent      = fmts(avgNet);
  document.getElementById('pred-avg-dur').textContent      = avgDur.toFixed(0) + ' min' + durLabel;
  document.getElementById('pred-current-ship').textContent  = (currentShip || 'CURRENT SHIP').toUpperCase();
  document.getElementById('pred-sale-val').textContent     = currentSale > 0 ? fmt(currentSale) : '\u2014';
  document.getElementById('pred-after-trips').textContent  = avgNet > 0 ? '~' + tripsAfter + ' more trips' : '\u2014';
  document.getElementById('pred-target-ship-label').textContent = (targetShip || 'TARGET SHIP').toUpperCase();
  document.getElementById('pred-total').textContent = avgNet > 0
    ? '~' + totalTrips + ' trips \u00B7 ~' + totalHours.toFixed(1) + ' hrs estimated'
    : 'Log more runs for a prediction';

  // Log hint
  const logHint = document.getElementById('log-hint');
  logHint.style.display = 'inline-flex';
  logHint.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0"><circle cx="6" cy="6" r="5.5" stroke="currentColor"/><text x="6" y="9" text-anchor="middle" font-size="8" font-family="sans-serif" fill="currentColor">i</text></svg> Gross = (New Balance \u2212 ' + fmtf(latest.balance) + ') + Fuel Cost';
  document.getElementById('log-btn').textContent = '+ LOG RUN ' + (completed.length + 1);

  // History table
  const tbody = document.getElementById('history-tbody');
  tbody.innerHTML = runs.map((r, idx) => {
    const nm = (r.odoEnd && r.odoStart && (r.odoEnd - r.odoStart) > 0) ? r.odoEnd - r.odoStart : null;
    const perNM = nm ? r.net / nm : null;
    const perMin = (r.duration && r.duration > 0) ? r.net / r.duration : null;
    return '<tr>'
      + '<td class="left" style="color:var(--cyan);cursor:pointer" title="Click to edit" onclick="editCell(event,' + idx + ',\'run\')">' + esc(r.run) + '</td>'
      + '<td class="right" style="cursor:pointer" title="Click to edit" onclick="editCell(event,' + idx + ',\'balance\')">' + fmt(r.balance) + '</td>'
      + '<td class="right" style="color:var(--red);cursor:pointer" title="Click to edit" onclick="editCell(event,' + idx + ',\'fuel\')">' + (r.fuel ? '-' + fmt(r.fuel) : '\u2014') + '</td>'
      + '<td class="right">' + (r.gross ? fmt(r.gross) : '\u2014') + '</td>'
      + '<td class="right" style="color:' + (r.net > 0 ? 'var(--green)' : 'var(--red)') + '">' + (r.net ? (r.net > 0 ? '+' : '') + fmt(r.net) : '\u2014') + '</td>'
      + '<td class="right" style="color:#f9a825;cursor:pointer" title="Click to edit" onclick="editCell(event,' + idx + ',\'odoStart\')">' + (r.odoStart ? Math.round(r.odoStart).toLocaleString() : '\u2014') + '</td>'
      + '<td class="right" style="color:#f9a825;cursor:pointer" title="Click to edit" onclick="editCell(event,' + idx + ',\'odoEnd\')">' + (r.odoEnd ? Math.round(r.odoEnd).toLocaleString() : '\u2014') + '</td>'
      + '<td class="right" style="color:#f9a825">' + (nm ? Math.round(nm).toLocaleString() + ' NM' : '\u2014') + '</td>'
      + '<td class="right" style="color:var(--purple);cursor:pointer" title="Click to edit" onclick="editCell(event,' + idx + ',\'duration\')">' + (r.duration ? r.duration + 'm' : '\u2014') + '</td>'
      + '<td class="right" style="color:var(--cyan)">' + (perNM ? fmtf(perNM) : '\u2014') + '</td>'
      + '<td class="right" style="color:var(--green)">' + (perMin ? fmtf(perMin) : '\u2014') + '</td>'
      + '<td class="right">' + (idx > 0 ? '<button onclick="deleteRun(' + idx + ')" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.85rem;padding:0 4px" title="Delete run">&times;</button>' : '') + '</td>'
      + '</tr>';
  }).join('');

  document.getElementById('hist-label').textContent = 'RUN HISTORY \u00B7 ' + completed.length + ' runs logged';
  if (completed.length > 0) {
    document.getElementById('totals-row').style.display = 'grid';
    document.getElementById('tot-earned').textContent = fmt(latest.balance - runs[0].balance);
    document.getElementById('tot-fuel').textContent   = '-' + fmt(completed.reduce((a, r) => a + r.fuel, 0));
    document.getElementById('tot-time').textContent   = timed.reduce((a, r) => a + r.duration, 0) + 'm';
  }

  drawChart(tripsToSell, avgNet, sellPoint, targetPrice);
  renderEfficiency();
}

// -- EFFICIENCY TAB --
function renderEfficiency() {
  if (runs.length === 0) return;
  const completed = runs.slice(1);
  const hasRuns = completed.length > 0;
  document.getElementById('eff2-empty').style.display   = hasRuns ? 'none'  : 'block';
  document.getElementById('eff2-content').style.display = hasRuns ? 'block' : 'none';
  if (!hasRuns) return;

  const nmRuns    = completed.filter(r => r.odoEnd && r.odoStart && (r.odoEnd - r.odoStart) > 0);
  const timedRuns = completed.filter(r => r.duration && r.duration > 0);

  const nmData  = nmRuns.map(r => ({ run: r.run, nm: r.odoEnd - r.odoStart, perNM: r.net / (r.odoEnd - r.odoStart) }));
  const minData = timedRuns.map(r => ({ run: r.run, perMin: r.net / r.duration }));

  const avgNM   = nmData.length  ? nmData.reduce((a, d) => a + d.perNM, 0) / nmData.length  : 0;
  const bestNM  = nmData.length  ? Math.max(...nmData.map(d => d.perNM))                    : 0;
  const avgMin  = minData.length ? minData.reduce((a, d) => a + d.perMin, 0) / minData.length : 0;
  const bestMin = minData.length ? Math.max(...minData.map(d => d.perMin))                   : 0;
  const totalNM  = nmRuns.reduce((a, r) => a + (r.odoEnd - r.odoStart), 0);
  const totalMin = timedRuns.reduce((a, r) => a + r.duration, 0);

  document.getElementById('eff2-avg-nm').textContent   = avgNM  > 0 ? fmtf(avgNM)  + '/NM'  : '\u2014';
  document.getElementById('eff2-best-nm').textContent  = bestNM > 0 ? fmtf(bestNM) + '/NM'  : '\u2014';
  document.getElementById('eff2-avg-min').textContent  = avgMin  > 0 ? fmtf(avgMin)  + '/min' : '\u2014';
  document.getElementById('eff2-best-min').textContent = bestMin > 0 ? fmtf(bestMin) + '/min' : '\u2014';
  document.getElementById('eff2-total-nm').textContent   = totalNM  > 0 ? Math.round(totalNM).toLocaleString() + ' NM' : '\u2014';
  document.getElementById('eff2-total-time').textContent = totalMin > 0 ? (totalMin >= 60 ? (totalMin / 60).toFixed(1) + ' hrs' : totalMin + ' min') : '\u2014';

  const adv = settings.profitNM;
  const tgt = settings.targetProfitNM;
  document.getElementById('eff2-advertised-nm').textContent = adv > 0 ? fmtf(adv) + '/NM' : '\u2014';
  document.getElementById('eff2-actual-nm').textContent     = avgNM  > 0 ? fmtf(avgNM)  + '/NM' : '\u2014';
  document.getElementById('eff2-target-nm').textContent     = tgt > 0 ? fmtf(tgt) + '/NM' : '\u2014';

  const vsAdvEl = document.getElementById('eff2-vs-adv');
  if (adv > 0 && avgNM > 0) {
    const vsAdv = (avgNM - adv) / adv * 100;
    vsAdvEl.textContent = (vsAdv >= 0 ? '+' : '') + vsAdv.toFixed(1) + '%';
    vsAdvEl.style.color = vsAdv >= 0 ? 'var(--green)' : 'var(--red)';
  } else { vsAdvEl.textContent = '\u2014'; vsAdvEl.style.color = ''; }

  const gainEl = document.getElementById('eff2-gain');
  if (tgt > 0 && avgNM > 0) {
    const gain = (tgt - avgNM) / avgNM * 100;
    gainEl.textContent = (gain >= 0 ? '+' : '') + gain.toFixed(1) + '% earnings boost on upgrade';
    gainEl.style.color = gain > 0 ? 'var(--green)' : 'var(--red)';
  } else { gainEl.textContent = '\u2014'; gainEl.style.color = ''; }

  document.getElementById('eff2-table-label').textContent = 'PER-RUN EFFICIENCY \u00B7 ' + completed.length + ' runs';
  const effTbody = document.getElementById('eff2-tbody');
  effTbody.innerHTML = completed.map(r => {
    const nm     = (r.odoEnd && r.odoStart && r.odoEnd - r.odoStart > 0) ? r.odoEnd - r.odoStart : null;
    const perNM  = nm !== null ? r.net / nm : null;
    const perMin = (r.duration && r.duration > 0) ? r.net / r.duration : null;
    const vsAvg  = (perNM !== null && avgNM > 0) ? (perNM - avgNM) / avgNM * 100 : null;
    return '<tr>'
      + '<td class="left" style="color:var(--cyan)">' + esc(r.run) + '</td>'
      + '<td class="right" style="color:#f9a825">' + (nm !== null ? Math.round(nm).toLocaleString() + ' NM' : '\u2014') + '</td>'
      + '<td class="right" style="color:var(--cyan)">' + (perNM !== null ? fmtf(perNM) : '\u2014') + '</td>'
      + '<td class="right" style="color:var(--green)">' + (perMin !== null ? fmtf(perMin) : '\u2014') + '</td>'
      + '<td class="right" style="color:' + (vsAvg !== null ? (vsAvg >= 0 ? 'var(--green)' : 'var(--red)') : 'var(--muted)') + '">' + (vsAvg !== null ? (vsAvg >= 0 ? '+' : '') + vsAvg.toFixed(1) + '%' : '\u2014') + '</td>'
      + '</tr>';
  }).join('');

  if (nmData.length > 0 || minData.length > 0) {
    document.getElementById('eff2-totals-row').style.display = 'grid';
    document.getElementById('eff2-tot-nm-row').textContent   = totalNM  > 0 ? Math.round(totalNM).toLocaleString() + ' NM' : '\u2014';
    document.getElementById('eff2-tot-avg-nm').textContent   = avgNM  > 0 ? fmtf(avgNM)  + '/NM'  : '\u2014';
    document.getElementById('eff2-tot-avg-min').textContent  = avgMin  > 0 ? fmtf(avgMin)  + '/min' : '\u2014';
  }

  drawEfficiencyChart(nmData);
}

// -- ROUTE CALCULATOR --
function renderRouteCalculator() {
  const container = document.getElementById('route-result');
  if (!container) return;

  const shipName = document.getElementById('route-ship')?.value;
  const loadPort = document.getElementById('route-load')?.value;
  const unloadPort = document.getElementById('route-unload')?.value;
  const distance = pn(document.getElementById('route-distance')?.value);

  if (!shipName || !loadPort || !unloadPort) {
    container.innerHTML = '';
    return;
  }

  const ship = findShip(shipName);
  if (!ship) {
    container.innerHTML = '<div style="color:var(--muted);font-size:0.78rem;padding:12px">Select a ship to see calculations.</div>';
    return;
  }

  const lp = PORT_DATABASE.find(p => p.name === loadPort);
  const up = PORT_DATABASE.find(p => p.name === unloadPort);
  const multi = getCargoMultiplier(ship.cargo, loadPort, unloadPort);
  const effectiveNM = Math.round(ship.profitNM * multi);
  const canDockLoad = !lp || canDock(ship, lp);
  const canDockUnload = !up || canDock(ship, up);
  const estProfit = distance > 0 ? Math.round(effectiveNM * distance) : null;

  let html = '<div class="card" style="border-color:var(--cyan-dim)">';
  html += '<div class="card-label">ROUTE ESTIMATE</div>';

  if (!canDockLoad || !canDockUnload) {
    html += '<div style="color:var(--red);font-size:0.82rem;margin-bottom:12px">';
    if (!canDockLoad) html += 'Warning: ' + esc(ship.name) + ' (' + ship.dwt.toLocaleString() + ' DWT) exceeds ' + esc(loadPort) + ' limit (' + (lp?.dwtLimit || 0).toLocaleString() + ' DWT)<br>';
    if (!canDockUnload) html += 'Warning: ' + esc(ship.name) + ' (' + ship.dwt.toLocaleString() + ' DWT) exceeds ' + esc(unloadPort) + ' limit (' + (up?.dwtLimit || 0).toLocaleString() + ' DWT)';
    html += '</div>';
  }

  html += '<div class="prediction-grid">';
  html += '<div><div class="pred-label">SHIP</div><div class="pred-val" style="color:var(--cyan)">' + esc(ship.name) + '</div></div>';
  html += '<div><div class="pred-label">CARGO TYPE</div><div class="pred-val" style="color:' + (CARGO_COLORS[ship.cargo] || 'var(--text)') + '">' + esc(ship.cargo) + '</div></div>';
  html += '<div><div class="pred-label">BASE $/NM</div><div class="pred-val">' + fmtf(ship.profitNM) + '</div></div>';
  html += '<div><div class="pred-label">PORT MULTIPLIER</div><div class="pred-val" style="color:' + (multi > 1 ? 'var(--green)' : multi < 1 ? 'var(--red)' : 'var(--text)') + '">' + multi.toFixed(2) + 'x</div></div>';
  html += '<div><div class="pred-label">EFFECTIVE $/NM</div><div class="pred-val" style="color:var(--green)">' + fmtf(effectiveNM) + '</div></div>';
  if (estProfit !== null) {
    html += '<div><div class="pred-label">EST. PROFIT (' + Math.round(distance) + ' NM)</div><div class="pred-val" style="color:var(--green)">' + fmt(estProfit) + '</div></div>';
  } else {
    html += '<div><div class="pred-label">DISTANCE</div><div class="pred-val" style="color:var(--muted)">Enter distance above</div></div>';
  }
  html += '</div></div>';

  container.innerHTML = html;
}
function clearRouteCalculator() {
  const ship = document.getElementById('route-ship');
  const load = document.getElementById('route-load');
  const unload = document.getElementById('route-unload');
  const dist = document.getElementById('route-distance');
  if (ship) ship.value = '';
  if (load) load.value = '';
  if (unload) unload.value = '';
  if (dist) dist.value = '';
  document.getElementById('route-result').innerHTML = '';
}

function clearJobComparison() {
  document.getElementById('jc-rows').innerHTML = '';
  document.getElementById('jc-result').innerHTML = '';
  _jcRowId = 0;
  _jcLastShip = null;
  _appendJobRow(); _appendJobRow(); _appendJobRow();
  renderJobComparison();
}

// -- JOB COMPARISON --
let _jcRowId = 0;
let _jcLastShip = null;

function _appendJobRow(labelVal, distVal, payVal) {
  _jcRowId++;
  const wrap = document.getElementById('jc-rows');
  if (!wrap) return;
  const row = document.createElement('div');
  row.className = 'jc-row';
  row.innerHTML =
    '<input type="text" placeholder="Route name (optional)" value="' + (labelVal || '') + '" oninput="renderJobComparison()">' +
    '<input type="number" placeholder="NM" value="' + (distVal || '') + '" min="0" oninput="renderJobComparison()">' +
    '<input type="text" placeholder="Payout ($)" value="' + (payVal || '') + '" oninput="renderJobComparison()" onblur="formatInput(this)">' +
    '<button class="jc-remove" onclick="this.closest(\'.jc-row\').remove();renderJobComparison()" title="Remove">&times;</button>';
  wrap.appendChild(row);
}

function addJobRow(labelVal, distVal, payVal) {
  _appendJobRow(labelVal, distVal, payVal);
  renderJobComparison();
}

function renderJobComparison() {
  const settingsShip = findShip(settings.currentShip);
  const speedEl = document.getElementById('jc-speed');
  // Auto-fill speed only when ship changes; always allow manual edit
  if (speedEl && settingsShip && settingsShip.name !== _jcLastShip) {
    speedEl.value = settingsShip.speed;
    _jcLastShip = settingsShip.name;
  } else if (!settingsShip) {
    _jcLastShip = null;
  }
  const speed = speedEl ? (parseFloat(speedEl.value) || 0) : 0;

  const rows = document.querySelectorAll('#jc-rows .jc-row');

  // Auto-add blank row if last row is now filled
  if (rows.length > 0) {
    const lastInputs = rows[rows.length - 1].querySelectorAll('input');
    if ((parseFloat(lastInputs[1].value) || 0) > 0 && pn(lastInputs[2].value) > 0) {
      _appendJobRow();
    }
  }

  const jobs = [];
  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const label = inputs[0].value.trim() || ('Job ' + (jobs.length + 1));
    const dist  = parseFloat(inputs[1].value) || 0;
    const pay   = pn(inputs[2].value);
    if (dist > 0 && pay > 0 && speed > 0) {
      const timeMins = (dist / speed) * 60;
      const perMin   = pay / timeMins;
      jobs.push({ label, dist, pay, timeMins, perMin, perHr: perMin * 60 });
    }
  });

  const resultEl = document.getElementById('jc-result');
  if (!resultEl) return;
  if (jobs.length === 0) { resultEl.innerHTML = ''; return; }

  const bestPerMin = Math.max(...jobs.map(j => j.perMin));

  let html = '<div class="table-wrap" style="margin-top:16px"><table><thead><tr>'
    + '<th class="left">JOB</th>'
    + '<th class="right">DIST</th>'
    + '<th class="right">PAYOUT</th>'
    + '<th class="right">TIME</th>'
    + '<th class="right">$/MIN</th>'
    + '<th class="right">$/HR</th>'
    + '</tr></thead><tbody>';

  jobs.forEach(j => {
    const isBest = j.perMin === bestPerMin;
    const mins = Math.floor(j.timeMins);
    const secs = Math.round((j.timeMins - mins) * 60);
    const timeStr = mins + 'm ' + String(secs).padStart(2, '0') + 's';
    const rowStyle = isBest ? ' style="background:rgba(76,175,80,0.08)"' : '';
    html += '<tr' + rowStyle + '>'
      + '<td class="left">' + esc(j.label) + (isBest ? '<span class="jc-best-badge">&#9733; BEST</span>' : '') + '</td>'
      + '<td class="right" style="color:var(--muted)">' + Math.round(j.dist) + ' NM</td>'
      + '<td class="right">' + fmtf(j.pay) + '</td>'
      + '<td class="right" style="color:var(--muted)">' + timeStr + '</td>'
      + '<td class="right" style="color:' + (isBest ? 'var(--green)' : 'var(--text)') + ';font-weight:' + (isBest ? '600' : '400') + '">' + fmtf(Math.round(j.perMin)) + '</td>'
      + '<td class="right" style="color:' + (isBest ? 'var(--green)' : 'var(--text)') + '">' + fmt(Math.round(j.perHr)) + '</td>'
      + '</tr>';
  });

  html += '</tbody></table></div>';
  if (speed > 0) {
    const shipLabel = settingsShip ? settingsShip.name + ' (' + speed + ' kts)' : speed + ' kts';
    html += '<div style="font-size:0.68rem;color:var(--muted);margin-top:6px;font-family:var(--mono)">Speed: ' + esc(shipLabel) + '</div>';
  }

  resultEl.innerHTML = html;
}
