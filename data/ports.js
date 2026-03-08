// Port database for Roblox Shipping Lanes
// Sources: https://roblox-shipping-lanes.fandom.com/wiki/Ports
// Last updated: 2026-03-08

const PORT_DATABASE = [
  // ── SOUTHERN MAINLAND ──
  { name: "Long Island",        multiplier: 1.0,  dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas"],                       note: "Central-east location" },
  { name: "Newport",            multiplier: 1.0,  dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas","Heavy"],                note: "Mid-sized, popular" },
  { name: "Norfolk Port",       multiplier: 0.95, dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas","Vehicle","Heavy"],      note: "Cold-themed, hazardous" },
  { name: "Rockfall Port",      multiplier: 1.0,  dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas","Heavy"],                note: "Beginner-friendly" },
  { name: "Stanley Harbor",     multiplier: 1.0,  dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas","Vehicle","Heavy"],      note: "Large, Canal access" },
  { name: "Newhaven Harbor",    multiplier: 0.95, dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas","Vehicle","Heavy"],      note: "Enclosed, busy" },
  { name: "Emerald Harbor",     multiplier: 1.0,  dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas","Vehicle"],              note: "Desert island port" },
  { name: "Bayview Port",       multiplier: 1.3,  dwtLimit: 51000,   region: "Southern",  supports: ["Container","Oil","Gas","Heavy"],                      note: "Highest multiplier, small ships only" },
  { name: "Lakeview Docks",     multiplier: 1.2,  dwtLimit: 157000,  region: "Southern",  supports: ["Bulk","Container"],                                   note: "Lake port" },
  { name: "Jamestown",          multiplier: 1.2,  dwtLimit: 157000,  region: "Southern",  supports: ["Bulk"],                                               note: "Remote lake location" },
  { name: "Ocean Fall Port",    multiplier: 0.87, dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas","Vehicle","Heavy"],      note: "Tropical, volcano events" },
  { name: "Woodside Inlet",     multiplier: 1.3,  dwtLimit: 51000,   region: "Southern",  supports: ["Bulk"],                                               note: "Small, limited cargo" },
  { name: "Russell Station",    multiplier: 0.91, dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas"],                        note: "Southeast location" },
  { name: "Macquarie Harbor",   multiplier: 0.87, dwtLimit: null,    region: "Southern",  supports: ["Bulk","Container","Oil","Gas","Vehicle","Heavy"],      note: "Southernmost, congested" },

  // ── NORTHERN ISLES ──
  { name: "Midway Harbor",      multiplier: 1.0,  dwtLimit: null,    region: "Northern",  supports: ["Bulk","Container","Oil","Gas","Vehicle","Heavy"],      note: "Large, two entrances" },
  { name: "Wilmington Cove",    multiplier: 1.0,  dwtLimit: null,    region: "Northern",  supports: ["Container","Oil","Gas","Vehicle","Heavy"],             note: "Dock space congestion" },
  { name: "Douglas Harbor",     multiplier: 0.87, dwtLimit: null,    region: "Northern",  supports: ["Bulk","Container","Oil","Gas","Vehicle","Heavy"],      note: "Northwest location" },
  { name: "Albany Cove",        multiplier: 0.87, dwtLimit: null,    region: "Northern",  supports: ["Bulk","Container","Oil","Gas","Vehicle","Heavy"],      note: "Northernmost port" },
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
    case "Con-Ro":
      return up.multiplier || 1;
    case "Oil":
    case "Heavy":
    case "Special":
      return 1;
    default:
      return 1;
  }
}

function portSupports(port, cargoType) {
  const p = typeof port === 'string' ? PORT_DATABASE.find(pp => pp.name === port) : port;
  if (!p || !p.supports) return true;
  if (cargoType === "Con-Ro") return p.supports.includes("Container") || p.supports.includes("Vehicle");
  return p.supports.includes(cargoType);
}

function canDock(ship, port) {
  const p = typeof port === 'string' ? PORT_DATABASE.find(pp => pp.name === port) : port;
  if (!p) return true;
  if (p.dwtLimit && (ship.dwt || 0) > p.dwtLimit) return false;
  return portSupports(p, ship.cargo);
}

function getCargoPortsForShip(ship) {
  return PORT_DATABASE.filter(p => canDock(ship, p));
}

function estimateProfit(ship, loadPort, unloadPort, distanceNM) {
  if (!ship || !distanceNM) return null;
  const multi = getCargoMultiplier(ship.cargo, loadPort, unloadPort);
  return Math.round(ship.profitNM * distanceNM * multi);
}
