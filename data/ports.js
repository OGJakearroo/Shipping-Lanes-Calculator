// Port database for Roblox Shipping Lanes
// Sources: https://roblox-shipping-lanes.fandom.com/wiki/Ports
// Last updated: 2026-03-07

const PORT_DATABASE = [
  // ── SOUTHERN PORTS ──
  { name: "Norfolk Port",       multiplier: 0.95, dwtLimit: null,   region: "Southern",  bulkMulti: true,  containerMulti: false, note: "Major hub, common starting point" },
  { name: "Rockfall Port",      multiplier: 1.0,  dwtLimit: null,   region: "Southern",  bulkMulti: true,  containerMulti: false, note: "" },
  { name: "Emerald Harbor",     multiplier: 1.0,  dwtLimit: null,   region: "Southern",  bulkMulti: true,  containerMulti: false, note: "" },
  { name: "Ocean Fall Port",    multiplier: 1.0,  dwtLimit: null,   region: "Southern",  bulkMulti: true,  containerMulti: false, note: "" },
  { name: "Bayview Port",       multiplier: 1.3,  dwtLimit: 51000,  region: "Southern",  bulkMulti: true,  containerMulti: false, note: "Highest multiplier, DWT <= 51k only" },
  { name: "Macquarie Harbor",   multiplier: 1.0,  dwtLimit: null,   region: "Southern",  bulkMulti: true,  containerMulti: false, note: "Good for heavy lifters" },
  { name: "Sorrento Island",    multiplier: 1.0,  dwtLimit: null,   region: "Southern",  bulkMulti: true,  containerMulti: false, note: "" },
  { name: "Davenport",          multiplier: 1.0,  dwtLimit: null,   region: "Southern",  bulkMulti: true,  containerMulti: false, note: "" },

  // ── CANAL PORTS ──
  { name: "Jamestown",          multiplier: 1.1,  dwtLimit: 157000, region: "Canal",     bulkMulti: true,  containerMulti: false, note: "Accessed via Panama Canal" },

  // ── NORTHERN PORTS ──
  { name: "Midway Harbor",      multiplier: 1.0,  dwtLimit: null,   region: "Northern",  bulkMulti: true,  containerMulti: false, note: "Large port, good refueling" },
  { name: "Douglas Harbor",     multiplier: 1.0,  dwtLimit: null,   region: "Northern",  bulkMulti: true,  containerMulti: false, note: "" },
  { name: "Albany Cove",        multiplier: 1.0,  dwtLimit: null,   region: "Northern",  bulkMulti: true,  containerMulti: false, note: "Northern Isles" },
  { name: "Wilmington Cove",    multiplier: 1.0,  dwtLimit: null,   region: "Northern",  bulkMulti: true,  containerMulti: false, note: "Farthest north, popular destination" },
  { name: "Lakeview Docks",     multiplier: 1.3,  dwtLimit: 51000,  region: "Northern",  bulkMulti: true,  containerMulti: false, note: "Highest multiplier, DWT <= 51k only. Also 1.2x for DWT <= 157k" },
  { name: "Woodside Inlet",     multiplier: 1.3,  dwtLimit: 51000,  region: "Northern",  bulkMulti: true,  containerMulti: false, note: "DWT <= 51k only" },
];

// How port multipliers apply by cargo type:
// Bulk & Gas: multiplier applies to BOTH loading and unloading ports
// Container & Vehicle (Ro-Ro): multiplier applies to UNLOADING port only
// Oil: profit determined by oil market prices, not port multiplier
// Heavy: fixed per-NM rate

function getCargoMultiplier(cargoType, loadPort, unloadPort) {
  const lp = PORT_DATABASE.find(p => p.name === loadPort);
  const up = PORT_DATABASE.find(p => p.name === unloadPort);
  if (!lp || !up) return 1;

  switch (cargoType) {
    case "Bulk":
    case "Gas":
      return (lp.multiplier || 1) * (up.multiplier || 1);
    case "Container":
    case "Vehicle":
      return up.multiplier || 1;
    case "Oil":
    case "Heavy":
    case "Special":
      return 1; // not affected by port multipliers (oil is market-based)
    default:
      return 1;
  }
}

function canDock(ship, port) {
  const p = typeof port === 'string' ? PORT_DATABASE.find(pp => pp.name === port) : port;
  if (!p || !p.dwtLimit) return true;
  return (ship.dwt || 0) <= p.dwtLimit;
}

function getCargoPortsForShip(ship) {
  return PORT_DATABASE.filter(p => p.multiplier > 0 && canDock(ship, p));
}

function estimateProfit(ship, loadPort, unloadPort, distanceNM) {
  if (!ship || !distanceNM) return null;
  const multi = getCargoMultiplier(ship.cargo, loadPort, unloadPort);
  return Math.round(ship.profitNM * distanceNM * multi);
}
