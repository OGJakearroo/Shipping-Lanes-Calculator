// Ship database for Roblox Shipping Lanes
// Sources: https://roblox-shipping-lanes.fandom.com/wiki/Ship_List
// Resale = 30% of purchase price for all ships
// Last updated: 2026-03-08

const SHIP_DATABASE = [
  // ── BULK CARRIERS ──
  { name: "Small Bulk Carrier",      price: 0,            profitNM: 400,      speed: 23, dwt: 600,      cargo: "Bulk",      tier: "starter" },
  { name: "York Bulk Carrier",       price: 5950,         profitNM: 690,      speed: 32, dwt: 2000,     cargo: "Bulk",      tier: "starter" },
  { name: "Mini Bulk Carrier",       price: 13500,        profitNM: 1015,     speed: 26, dwt: 9000,     cargo: "Bulk",      tier: "early" },
  { name: "Handysize",               price: 105470,       profitNM: 7351,     speed: 23, dwt: 35000,    cargo: "Bulk",      tier: "early" },
  { name: "Lloyd-Class Ore Carrier", price: 560000,       profitNM: 23351,    speed: 23, dwt: 50000,    cargo: "Bulk",      tier: "early" },
  { name: "Handymax",                price: 760000,       profitNM: 28840,    speed: 21, dwt: 45000,    cargo: "Bulk",      tier: "early" },
  { name: "Supramax",                price: 1200000,      profitNM: 46000,    speed: 20, dwt: 60000,    cargo: "Bulk",      tier: "early" },
  { name: "Panamax Bulk Carrier",    price: 2400000,      profitNM: 75500,    speed: 19, dwt: 75000,    cargo: "Bulk",      tier: "mid" },
  { name: "Stanley Class Freighter", price: 4400000,      profitNM: 97500,    speed: 23, dwt: 80000,    cargo: "Bulk",      tier: "mid" },
  { name: "Hobart Class Freighter",  price: 11500000,     profitNM: 160000,   speed: 23, dwt: 88000,    cargo: "Bulk",      tier: "mid" },
  { name: "Transit Class Freighter", price: 25400000,     profitNM: 200000,   speed: 22, dwt: 94000,    cargo: "Bulk",      tier: "mid" },
  { name: "Capesize",                price: 46000000,     profitNM: 340000,   speed: 19, dwt: 156000,   cargo: "Bulk",      tier: "late" },
  { name: "Very Large Ore Carrier",  price: 75406000,     profitNM: 430000,   speed: 18, dwt: 400000,   cargo: "Bulk",      tier: "late" },
  { name: "Hull 1173",               price: 125000000,    profitNM: 169000,   speed: 28, dwt: 280000,   cargo: "Bulk",      tier: "late" },
  { name: "Gauntlet Cargo Liner",    price: 150000000,    profitNM: 449500,   speed: 23, dwt: 10000,    cargo: "Bulk",      tier: "late" },
  { name: "Seamax Ore Carrier",      price: 245000000,    profitNM: 767500,   speed: 18, dwt: 614763,   cargo: "Bulk",      tier: "endgame" },
  { name: "Grand Ore Carrier",       price: 716000000,    profitNM: 1170000,  speed: 17, dwt: 999000,   cargo: "Bulk",      tier: "endgame" },
  { name: "S.S Great Eastern",       price: 1700000000,   profitNM: 990000,   speed: 23, dwt: 10000,    cargo: "Bulk",      tier: "endgame" },

  // ── CONTAINER SHIPS ──
  { name: "Small Container Ship",    price: 0,            profitNM: 200,      speed: 23, dwt: 500,      cargo: "Container", tier: "starter",  containers: 8 },
  { name: "Long Trade Ship",         price: 1950,         profitNM: 380,      speed: 22, dwt: 1500,     cargo: "Container", tier: "starter",  containers: 16 },
  { name: "Inland Container Carrier",price: 2550,         profitNM: 400,      speed: 22, dwt: 1500,     cargo: "Container", tier: "early",    containers: 24 },
  { name: "York Container Ship",     price: 6950,         profitNM: 690,      speed: 32, dwt: 1000,     cargo: "Container", tier: "early",    containers: 50 },
  { name: "Perth Class",             price: 25000,        profitNM: 2012,     speed: 22, dwt: 3000,     cargo: "Container", tier: "early",    containers: 60 },
  { name: "Medium Container Ship",   price: 55268,        profitNM: 3351,     speed: 20, dwt: 7000,     cargo: "Container", tier: "early",    containers: 146 },
  { name: "Zenlift Container Ship",  price: 180000,       profitNM: 8200,     speed: 21, dwt: 26000,    cargo: "Container", tier: "early",    containers: 420 },
  { name: "Panamax Container Ship",  price: 4500000,      profitNM: 89000,    speed: 22, dwt: 61500,    cargo: "Container", tier: "mid",      containers: 1022 },
  { name: "T2 Container Ship",       price: 51000000,     profitNM: 230000,   speed: 21, dwt: 50000,    cargo: "Container", tier: "late",     containers: 199 },
  { name: "Atlantic Class",          price: 110000000,    profitNM: 592500,   speed: 20, dwt: 196000,   cargo: "Container", tier: "late",     containers: 3936 },
  { name: "Container Boat",          price: 125000000,    profitNM: 169000,   speed: 29, dwt: 5,        cargo: "Container", tier: "late",     containers: 1 },
  { name: "Quad-A Class",            price: 310000000,    profitNM: 790000,   speed: 22, dwt: 200000,   cargo: "Container", tier: "endgame",  containers: 6120 },
  { name: "Maximus Class",           price: 409500000,    profitNM: 815000,   speed: 22, dwt: 225000,   cargo: "Container", tier: "endgame",  containers: 6752 },

  // ── OIL TANKERS ──
  { name: "General Purpose Tanker",  price: 298000,       profitNM: 0,        speed: 24, dwt: 18700,    cargo: "Oil",       tier: "early" },
  { name: "Aframax Tanker",          price: 999500,       profitNM: 0,        speed: 22, dwt: 90000,    cargo: "Oil",       tier: "early" },
  { name: "Suezmax Tanker",          price: 4000000,      profitNM: 0,        speed: 20, dwt: 125000,   cargo: "Oil",       tier: "mid" },
  { name: "Very Large Crude Carrier",price: 15000000,     profitNM: 0,        speed: 18, dwt: 320000,   cargo: "Oil",       tier: "mid" },
  { name: "Ultra Large Crude Carrier",price: 47000000,    profitNM: 0,        speed: 17, dwt: 441893,   cargo: "Oil",       tier: "late" },
  { name: "Seawise-Giant",           price: 190000000,    profitNM: 0,        speed: 16.5, dwt: 564763, cargo: "Oil",       tier: "endgame" },
  { name: "Batillus Supertanker",    price: 300000000,    profitNM: 0,        speed: 20, dwt: 630962,   cargo: "Oil",       tier: "endgame" },

  // ── GAS CARRIERS ──
  { name: "Q-Mini LNG Carrier",      price: 20000000,     profitNM: 145000,   speed: 25, dwt: 17800,    cargo: "Gas",       tier: "mid" },
  { name: "Conventional LNG Carrier",price: 55548000,     profitNM: 330000,   speed: 23, dwt: 84878,    cargo: "Gas",       tier: "mid" },
  { name: "Gem Class LNG Carrier",   price: 76700000,     profitNM: 430000,   speed: 19, dwt: 94028,    cargo: "Gas",       tier: "late" },
  { name: "Absolute LNG Carrier",    price: 110000000,    profitNM: 580000,   speed: 20, dwt: 163922,   cargo: "Gas",       tier: "late" },
  { name: "Prometheus Class",        price: 330000000,    profitNM: 780000,   speed: 22, dwt: 463522,   cargo: "Gas",       tier: "endgame" },

  // ── VEHICLE TRANSPORTERS ──
  { name: "High Speed Transporter",  price: 490000,       profitNM: 7800,     speed: 50, dwt: 1000,     cargo: "Vehicle",   tier: "early" },
  { name: "Electrified Ferry",       price: 7942000,      profitNM: 97500,    speed: 32, dwt: 2000,     cargo: "Vehicle",   tier: "mid" },
  { name: "Trimaran Cargo Transporter",price: 9942000,    profitNM: 89000,    speed: 45, dwt: 3500,     cargo: "Vehicle",   tier: "mid" },
  { name: "Space Class Transporter", price: 38530000,     profitNM: 220000,   speed: 23, dwt: 21820,    cargo: "Vehicle",   tier: "late" },
  { name: "King Class Transporter",  price: 55000000,     profitNM: 340000,   speed: 23, dwt: 25820,    cargo: "Vehicle",   tier: "late" },
  { name: "Mover Class Transporter", price: 109000000,    profitNM: 605000,   speed: 20, dwt: 41820,    cargo: "Vehicle",   tier: "endgame" },

  // ── HEAVY LIFTERS ──
  { name: "Prototype Heavy Lifter",  price: 46000000,     profitNM: 290000,   speed: 24, dwt: 41820,    cargo: "Heavy",     tier: "mid" },
  { name: "Striker Heavy Lifter",    price: 90000000,     profitNM: 375000,   speed: 28, dwt: 43220,    cargo: "Heavy",     tier: "late" },
  { name: "Goliath Heavy Lifter",    price: 199000000,    profitNM: 695000,   speed: 22, dwt: 81490,    cargo: "Heavy",     tier: "late" },
  { name: "Leviathan Heavy Lifter",  price: 400000000,    profitNM: 815000,   speed: 18, dwt: 116173,   cargo: "Heavy",     tier: "endgame" },
  { name: "Behemoth Heavy Lifter",   price: 530000000,    profitNM: 1000000,  speed: 25, dwt: 116173,   cargo: "Heavy",     tier: "endgame" },
  { name: "Megalodon Heavy Lifter",  price: 630000000,    profitNM: 1050000,  speed: 18, dwt: 116173,   cargo: "Heavy",     tier: "endgame" },

  // ── CON-RO (CONTAINER + VEHICLE HYBRID) ──
  { name: "Multi Class Freighter",   price: 225000000,    profitNM: 670000,   speed: 23, dwt: 100430,   cargo: "Con-Ro",    tier: "endgame" },

  // ── MISC / SPECIAL ──
  { name: "Midway Class Carrier",    price: 3980000000,   profitNM: 0,        speed: 32, dwt: 64000,    cargo: "Special",   tier: "endgame" },
];

// Pre-compute resale values (30% of price)
SHIP_DATABASE.forEach(ship => {
  ship.resale = Math.round(ship.price * 0.3);
});

// Tier labels for display
const SHIP_TIERS = {
  starter: "Starter (Free)",
  early:   "Early Game",
  mid:     "Mid Game",
  late:    "Late Game",
  endgame: "Endgame"
};

// Cargo type colors for UI
const CARGO_COLORS = {
  Bulk:      "var(--orange)",
  Container: "var(--cyan)",
  Oil:       "var(--red)",
  Gas:       "var(--green)",
  Vehicle:   "var(--purple)",
  Heavy:     "#f9a825",
  "Con-Ro":  "var(--cyan)",
  Special:   "var(--cyan)"
};

function findShip(name) {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  return SHIP_DATABASE.find(s => s.name.toLowerCase() === lower) || null;
}

function findShipsByCargoType(cargo) {
  return SHIP_DATABASE.filter(s => s.cargo === cargo);
}

function findShipsByTier(tier) {
  return SHIP_DATABASE.filter(s => s.tier === tier);
}

function getNextShips(currentShip) {
  const ship = typeof currentShip === 'string' ? findShip(currentShip) : currentShip;
  if (!ship) return SHIP_DATABASE.filter(s => s.price > 0).sort((a, b) => a.price - b.price);
  return SHIP_DATABASE
    .filter(s => s.price > ship.price)
    .sort((a, b) => a.price - b.price);
}
