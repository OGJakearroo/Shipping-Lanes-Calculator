// -- INITIALIZATION --
load();
loadFromURL();
loadTheme();
loadSettingsToForm();

if (runs.length === 0) {
  showStartBalanceModal();
} else {
  render();
}

loadLogForm();

// Log form persistence listeners
['inp-balance','inp-fuel','inp-odo-start','inp-odo-end','inp-start','inp-end'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input',  saveLogForm);
  el.addEventListener('change', saveLogForm);
  el.addEventListener('blur',   saveLogForm);
});

// Resize handler
window.addEventListener('resize', () => { if (runs.length > 0) render(); });

// Initialize ship selectors with auto-fill
initShipSelector('ob-current-ship', {
  onSelect: ship => {
    document.getElementById('ob-current-sale').value = Math.round(ship.resale).toLocaleString();
    document.getElementById('ob-current-profit-nm').value = Math.round(ship.profitNM).toLocaleString();
    obUpdateSellPoint();
  }
});

initShipSelector('ob-target-ship', {
  onSelect: ship => {
    document.getElementById('ob-target-price').value = Math.round(ship.price).toLocaleString();
    document.getElementById('ob-target-profit-nm').value = Math.round(ship.profitNM).toLocaleString();
    obUpdateSellPoint();
  }
});

initShipSelector('set-current-ship', {
  onSelect: ship => {
    document.getElementById('set-current-sale').value = Math.round(ship.resale).toLocaleString();
    document.getElementById('set-profit-nm').value = Math.round(ship.profitNM).toLocaleString();
    document.getElementById('set-cargo').value = ship.cargo;
    calcSellPoint();
  }
});

initShipSelector('set-target-ship', {
  onSelect: ship => {
    document.getElementById('set-target-price').value = Math.round(ship.price).toLocaleString();
    document.getElementById('set-target-profit-nm').value = Math.round(ship.profitNM).toLocaleString();
    calcSellPoint();
  }
});

initShipSelector('route-ship', {
  onSelect: ship => {
    renderRouteCalculator();
  }
});

// Route calculator event listeners
['route-load', 'route-unload', 'route-distance'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', renderRouteCalculator);
  if (el) el.addEventListener('input', renderRouteCalculator);
});

// Initialize job comparison with 3 blank rows
addJobRow(); addJobRow(); addJobRow();

// Render seasons list
renderSeasons();

// Build date footer
document.body.insertAdjacentHTML('beforeend',
  '<div style="text-align:center;padding:16px 0 8px;font-size:0.65rem;color:var(--muted);font-family:var(--mono);letter-spacing:0.1em">'
  + 'BUILD ' + BUILD_DATE + ' &nbsp;&middot;&nbsp;'
  + '<a href="https://roblox-shipping-lanes.fandom.com/wiki/Shipping_Lanes_Wiki" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;opacity:0.8">SHIPPING LANES WIKI &#8599;</a>'
  + '</div>'
  + '<div style="text-align:center;padding:0 24px 24px;font-size:0.62rem;color:var(--muted);font-family:var(--mono);opacity:0.5;line-height:1.6">'
  + 'Entirely vibe coded &mdash; AI-assisted, no formal engineering process. Works fine, probably.'
  + '</div>');
