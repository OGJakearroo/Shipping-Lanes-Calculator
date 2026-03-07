// -- CHARTS --
const chartLayers = { projection: true, duration: true, odometer: true, sell: true, target: true };

function toggleChartLayer(btn) {
  const layer = btn.dataset.layer;
  chartLayers[layer] = !chartLayers[layer];
  btn.classList.toggle('active', chartLayers[layer]);
  const { completed } = stats();
  const avgNet = completed.length > 1 ? completed.slice(1).reduce((a,r)=>a+r.net,0)/(completed.length-1) : 0;
  const sp = settings.sellPoint || 0;
  const tp = settings.targetPrice || 0;
  const tts = avgNet > 0 ? Math.ceil(Math.max(0, sp - runs[runs.length-1].balance) / avgNet) : 0;
  drawChart(tts, avgNet, sp, tp);
}

function drawChart(tripsToSell, avgNet, sellPoint, targetPrice) {
  const isLight = document.body.classList.contains('light');
  const container = document.getElementById('chart-container');
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
  }
  canvas.width  = container.clientWidth  || 600;
  canvas.height = container.clientHeight || 220;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const clrGrid   = isLight ? '#d0dce8' : '#0c1c2c';
  const clrLabel  = isLight ? '#4a6a84' : '#2a4a5e';
  const clrActual = isLight ? '#0277bd' : '#4fc3f7';
  const clrProj   = isLight ? '#0277bd66' : '#4fc3f744';
  const clrSell   = isLight ? '#bf5e00' : '#ffa726';
  const clrTarget = isLight ? '#2e7d32' : '#66bb6a';
  const clrDur    = isLight ? '#6a1b9a' : '#ab47bc';
  const clrOdo    = '#f9a825';

  const actual = runs.map((r, i) => ({ x: i, y: r.balance, label: r.run }));
  const proj   = [];
  let pb = runs[runs.length - 1].balance;
  const MAX_PROJ = avgNet > 0 ? Math.min(tripsToSell + 3, 25) : 0;
  for (let i = 1; i <= MAX_PROJ; i++) {
    pb = Math.min(pb + avgNet, Math.max(sellPoint, targetPrice));
    proj.push({ x: runs.length - 1 + i, y: pb });
  }

  const allY  = [...actual, ...proj].map(p => p.y);
  const minY  = 0;
  const maxY  = Math.max(...allY, targetPrice || 0, sellPoint || 0) * 1.05 || 1;
  const totalX = actual.length + proj.length - 1 || 1;

  const timedRuns = runs.filter(r => r.duration);
  const maxDur    = timedRuns.length ? Math.max(...timedRuns.map(r => r.duration)) : 0;
  const hasDur    = maxDur > 0 && chartLayers.duration;
  const PAD = { l: 60, r: hasDur ? 52 : 16, t: 14, b: 28 };
  const gW  = W - PAD.l - PAD.r;
  const gH  = H - PAD.t - PAD.b;

  const xOf = x => PAD.l + (x / totalX) * gW;
  const yOf = y => PAD.t + gH - ((y - minY) / (maxY - minY)) * gH;

  // Grid
  ctx.strokeStyle = clrGrid; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.t + (i / 4) * gH;
    ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W - PAD.r, y); ctx.stroke();
    const val = maxY - (i / 4) * (maxY - minY);
    ctx.fillStyle = clrLabel; ctx.font = '9px JetBrains Mono,monospace';
    ctx.textAlign = 'right';
    ctx.fillText('$' + (val / 1e6).toFixed(0) + 'M', PAD.l - 4, y + 3);
  }

  // Reference lines
  const drawRef = (val, color, label) => {
    if (!val) return;
    const y = yOf(val);
    if (y < PAD.t || y > PAD.t + gH) return;
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W - PAD.r, y); ctx.stroke();
    ctx.fillStyle = color; ctx.font = '9px JetBrains Mono,monospace'; ctx.textAlign = 'left';
    ctx.fillText(label, PAD.l + 3, y - 3);
    ctx.restore();
  };
  if (chartLayers.sell)   drawRef(sellPoint,   clrSell,   'SELL');
  if (chartLayers.target) drawRef(targetPrice, clrTarget, 'TARGET');

  // Projected line
  if (chartLayers.projection && proj.length > 0) {
    const projPts = [actual[actual.length - 1], ...proj];
    ctx.save();
    ctx.strokeStyle = clrProj; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath();
    projPts.forEach((p, i) => {
      const x = xOf(actual.length - 1 + i);
      const y = yOf(p.y);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke(); ctx.restore();
  }

  // Actual line
  ctx.save();
  ctx.strokeStyle = clrActual; ctx.lineWidth = 2; ctx.setLineDash([]);
  ctx.beginPath();
  actual.forEach((p, i) => {
    i === 0 ? ctx.moveTo(xOf(p.x), yOf(p.y)) : ctx.lineTo(xOf(p.x), yOf(p.y));
  });
  ctx.stroke();
  actual.forEach(p => {
    ctx.beginPath(); ctx.arc(xOf(p.x), yOf(p.y), 3, 0, Math.PI * 2);
    ctx.fillStyle = clrActual; ctx.fill();
  });
  ctx.restore();

  // Duration bars
  if (chartLayers.duration && hasDur) {
    const BAR_W  = Math.max(4, Math.min(10, gW / (runs.length * 2)));
    runs.forEach((r, i) => {
      if (!r.duration) return;
      const x    = xOf(i);
      const barH = (r.duration / maxDur) * gH;
      ctx.save();
      ctx.fillStyle = clrDur + '55';
      ctx.strokeStyle = clrDur + 'aa';
      ctx.lineWidth = 1;
      ctx.fillRect(x - BAR_W / 2, PAD.t + gH - barH, BAR_W, barH);
      ctx.strokeRect(x - BAR_W / 2, PAD.t + gH - barH, BAR_W, barH);
      ctx.restore();
    });

    ctx.fillStyle = clrDur; ctx.font = '9px JetBrains Mono,monospace'; ctx.textAlign = 'left';
    for (let i = 0; i <= 4; i++) {
      const d = maxDur * (1 - i / 4);
      const y = PAD.t + (i / 4) * gH;
      ctx.fillText(Math.round(d) + 'm', W - PAD.r + 4, y + 3);
    }
  }

  // Odometer line
  const odoRuns = runs.map((r, i) => ({ x: i, v: r.odoEnd ?? r.odoStart ?? null })).filter(p => p.v != null);
  if (chartLayers.odometer && odoRuns.length > 1) {
    const minOdo = Math.min(...odoRuns.map(p => p.v));
    const maxOdo = Math.max(...odoRuns.map(p => p.v));
    const yOfOdo = v => maxOdo === minOdo ? PAD.t + gH / 2 : PAD.t + gH - ((v - minOdo) / (maxOdo - minOdo)) * gH;
    ctx.save();
    ctx.strokeStyle = clrOdo; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath();
    odoRuns.forEach((p, i) => {
      i === 0 ? ctx.moveTo(xOf(p.x), yOfOdo(p.v)) : ctx.lineTo(xOf(p.x), yOfOdo(p.v));
    });
    ctx.stroke();
    odoRuns.forEach(p => {
      ctx.beginPath(); ctx.arc(xOf(p.x), yOfOdo(p.v), 2, 0, Math.PI * 2);
      ctx.fillStyle = clrOdo; ctx.fill();
    });
    ctx.restore();
  }

  // X labels
  ctx.fillStyle = clrLabel; ctx.font = '8px JetBrains Mono,monospace'; ctx.textAlign = 'center';
  actual.forEach(p => ctx.fillText(p.label.replace('Run ', 'R'), xOf(p.x), H - PAD.b + 12));
}

// -- EFFICIENCY CHART --
function drawEfficiencyChart(nmData) {
  const isLight = document.body.classList.contains('light');
  const container = document.getElementById('eff2-chart-container');
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.style.width = '100%'; canvas.style.height = '100%';
    container.appendChild(canvas);
  }
  canvas.width  = container.clientWidth  || 600;
  canvas.height = container.clientHeight || 220;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const clrLabel = isLight ? '#4a6a84' : '#6a8fa8';
  if (nmData.length < 2) {
    ctx.fillStyle = clrLabel; ctx.font = '11px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText('Log odometer readings on 2+ runs to see $/NM trend', W / 2, H / 2);
    return;
  }

  const clrGrid = isLight ? '#d0dce8' : '#0c1c2c';
  const clrNM   = isLight ? '#0277bd' : '#4fc3f7';
  const clrAdv  = isLight ? '#bf5e00' : '#ffa726';
  const clrTgt  = isLight ? '#6a1b9a' : '#ab47bc';
  const adv = settings.profitNM;
  const tgt = settings.targetProfitNM;

  const allVals = [...nmData.map(d => d.perNM), adv > 0 ? adv : 0, tgt > 0 ? tgt : 0].filter(v => v > 0);
  const dataMin = Math.min(...nmData.map(d => d.perNM));
  const dataMax = Math.max(...allVals);
  const pad = (dataMax - dataMin) * 0.18 || dataMax * 0.12 || 1;
  const minVal = Math.max(0, dataMin - pad);
  const maxVal = dataMax + pad;
  const range  = maxVal - minVal || 1;

  const totalX = nmData.length - 1 || 1;
  const PAD2 = { l: 72, r: 16, t: 14, b: 28 };
  const gW = W - PAD2.l - PAD2.r;
  const gH = H - PAD2.t - PAD2.b;
  const xOf = i => PAD2.l + (i / totalX) * gW;
  const yOf = v => PAD2.t + gH - ((v - minVal) / range) * gH;

  ctx.strokeStyle = clrGrid; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD2.t + (i / 4) * gH;
    ctx.beginPath(); ctx.moveTo(PAD2.l, y); ctx.lineTo(W - PAD2.r, y); ctx.stroke();
    const val = maxVal - (i / 4) * range;
    ctx.fillStyle = clrLabel; ctx.font = '9px JetBrains Mono,monospace'; ctx.textAlign = 'right';
    ctx.fillText('$' + (val >= 1e6 ? (val / 1e6).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'k'), PAD2.l - 4, y + 3);
  }

  const drawRef = (val, color, label) => {
    if (!(val > 0)) return;
    const y = yOf(val);
    if (y < PAD2.t - 2 || y > PAD2.t + gH + 2) return;
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(PAD2.l, y); ctx.lineTo(W - PAD2.r, y); ctx.stroke();
    ctx.fillStyle = color; ctx.font = '9px JetBrains Mono,monospace'; ctx.textAlign = 'left';
    ctx.fillText(label, PAD2.l + 3, y - 3);
    ctx.restore();
  };
  drawRef(adv, clrAdv, 'ADVERTISED');
  drawRef(tgt, clrTgt, 'TARGET');

  // Area fill
  ctx.save();
  const grad = ctx.createLinearGradient(0, PAD2.t, 0, PAD2.t + gH);
  grad.addColorStop(0, clrNM + '33'); grad.addColorStop(1, clrNM + '00');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(xOf(0), PAD2.t + gH);
  nmData.forEach((d, i) => ctx.lineTo(xOf(i), yOf(d.perNM)));
  ctx.lineTo(xOf(nmData.length - 1), PAD2.t + gH);
  ctx.closePath(); ctx.fill(); ctx.restore();

  // Avg line
  const avgNM = nmData.reduce((a, d) => a + d.perNM, 0) / nmData.length;
  const avgY  = yOf(avgNM);
  if (avgY >= PAD2.t && avgY <= PAD2.t + gH) {
    ctx.save();
    ctx.strokeStyle = clrNM + '55'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(PAD2.l, avgY); ctx.lineTo(W - PAD2.r, avgY); ctx.stroke();
    ctx.fillStyle = clrNM + 'aa'; ctx.font = '9px JetBrains Mono,monospace'; ctx.textAlign = 'right';
    ctx.fillText('AVG', W - PAD2.r - 2, avgY - 3);
    ctx.restore();
  }

  // Line + dots
  ctx.save();
  ctx.strokeStyle = clrNM; ctx.lineWidth = 2; ctx.setLineDash([]);
  ctx.beginPath();
  nmData.forEach((d, i) => i === 0 ? ctx.moveTo(xOf(i), yOf(d.perNM)) : ctx.lineTo(xOf(i), yOf(d.perNM)));
  ctx.stroke();
  nmData.forEach((d, i) => {
    ctx.beginPath(); ctx.arc(xOf(i), yOf(d.perNM), 3, 0, Math.PI * 2);
    ctx.fillStyle = clrNM; ctx.fill();
  });
  ctx.restore();

  ctx.fillStyle = clrLabel; ctx.font = '8px JetBrains Mono,monospace'; ctx.textAlign = 'center';
  nmData.forEach((d, i) => ctx.fillText(d.run.replace('Run ', 'R'), xOf(i), H - PAD2.b + 12));
}
