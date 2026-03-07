// Ship database for Roblox Shipping Lanes
// Sources: https://roblox-shipping-lanes.fandom.com/wiki/Ship_List
// Resale = 30% of purchase price for all ships
// Last updated: 2026-03-07

const SHIP_DATABASE = [
  // ── BULK CARRIERS ──
  { name: "Small Bulk Carrier",      price: 0,           profitNM: 3500,    speed: 15, dwt: 5000,    cargo: "Bulk",   tier: "starter" },
  { name: "Handysize",               price: 500000,      profitNM: 7300,    speed: 16, dwt: 28000,   cargo: "Bulk",   tier: "early" },
  { name: "Handymax",                price: 2000000,     profitNM: 15000,   speed: 17, dwt: 45000,   cargo: "Bulk",   tier: "early" },
  { name: "Panamax Bulk Carrier",    price: 6000000,     profitNM: 30000,   speed: 16, dwt: 75000,   cargo: "Bulk",   tier: "early" },
  { name: "York Bulk Carrier",       price: 12000000,    profitNM: 55000,   speed: 32, dwt: 35000,   cargo: "Bulk",   tier: "mid" },
  { name: "Capesize",                price: 46000000,    profitNM: 340000,  speed: 18, dwt: 180000,  cargo: "Bulk",   tier: "mid" },
  { name: "Very Large Ore Carrier",  price: 100000000,   profitNM: 430000,  speed: 18, dwt: 400000,  cargo: "Bulk",   tier: "late" },
  { name: "Seamax Ore Carrier",      price: 245000000,   profitNM: 787500,  speed: 18, dwt: 614763,  cargo: "Bulk",   tier: "endgame" },
  { name: "S.S Great Eastern",       price: 350000000,   profitNM: 900000,  speed: 25, dwt: 400000,  cargo: "Bulk",   tier: "endgame" },
  { name: "Grand Ore Carrier",       price: 716000000,   profitNM: 1100000, speed: 16, dwt: 900000,  cargo: "Bulk",   tier: "endgame" },

  // ── CONTAINER SHIPS ──
  { name: "Small Container Ship",    price: 0,           profitNM: 4000,    speed: 14, dwt: 0,       cargo: "Container", tier: "starter", containers: 120 },
  { name: "Long Trade Ship",         price: 300000,      profitNM: 6000,    speed: 15, dwt: 0,       cargo: "Container", tier: "early",   containers: 200 },
  { name: "Inland Container Carrier",price: 800000,      profitNM: 9000,    speed: 14, dwt: 0,       cargo: "Container", tier: "early",   containers: 350 },
  { name: "York Container Ship",     price: 2500000,     profitNM: 18000,   speed: 28, dwt: 0,       cargo: "Container", tier: "early",   containers: 280 },
  { name: "Perth Class",             price: 3500000,     profitNM: 22000,   speed: 18, dwt: 0,       cargo: "Container", tier: "early",   containers: 500 },
  { name: "Medium Container Ship",   price: 4000000,     profitNM: 28000,   speed: 16, dwt: 0,       cargo: "Container", tier: "mid",     containers: 680 },
  { name: "Panamax Container Ship",  price: 4500000,     profitNM: 35000,   speed: 18, dwt: 0,       cargo: "Container", tier: "mid",     containers: 900 },
  { name: "SL-7",                    price: 18000000,    profitNM: 85000,   speed: 33, dwt: 0,       cargo: "Container", tier: "mid",     containers: 1096 },
  { name: "B-Class",                 price: 25000000,    profitNM: 120000,  speed: 22, dwt: 0,       cargo: "Container", tier: "mid",     containers: 1800 },
  { name: "Stanley Class Freighter", price: 50000000,    profitNM: 200000,  speed: 22, dwt: 0,       cargo: "Container", tier: "late",    containers: 2500 },
  { name: "Prometheus Class",        price: 130000000,   profitNM: 400000,  speed: 22, dwt: 0,       cargo: "Container", tier: "late",    containers: 4200 },
  { name: "Quad-A Class",            price: 310000000,   profitNM: 600000,  speed: 20, dwt: 0,       cargo: "Container", tier: "endgame", containers: 6120 },
  { name: "Maximus Class",           price: 409500000,   profitNM: 650000,  speed: 22, dwt: 0,       cargo: "Container", tier: "endgame", containers: 6752 },

  // ── OIL TANKERS ──
  { name: "General Purpose Tanker",  price: 0,           profitNM: 5000,    speed: 14, dwt: 10000,   cargo: "Oil",    tier: "starter" },
  { name: "Coastal Tanker",          price: 1500000,     profitNM: 12000,   speed: 15, dwt: 16500,   cargo: "Oil",    tier: "early" },
  { name: "Aframax Tanker",          price: 5000000,     profitNM: 40000,   speed: 16, dwt: 120000,  cargo: "Oil",    tier: "mid" },
  { name: "Suezmax Tanker",          price: 10000000,    profitNM: 60000,   speed: 16, dwt: 160000,  cargo: "Oil",    tier: "mid" },
  { name: "Very Large Crude Carrier",price: 15000000,    profitNM: 80000,   speed: 16, dwt: 320000,  cargo: "Oil",    tier: "mid" },
  { name: "Seawise-Giant",           price: 200000000,   profitNM: 350000,  speed: 16, dwt: 564763,  cargo: "Oil",    tier: "endgame" },
  { name: "Batillus Supertanker",    price: 350000000,   profitNM: 700000,  speed: 17, dwt: 550000,  cargo: "Oil",    tier: "endgame" },

  // ── GAS CARRIERS ──
  { name: "Small LNG Carrier",       price: 3000000,     profitNM: 25000,   speed: 16, dwt: 25000,   cargo: "Gas",    tier: "early" },
  { name: "Conventional LNG Carrier",price: 45000000,    profitNM: 350000,  speed: 20, dwt: 90000,   cargo: "Gas",    tier: "mid" },
  { name: "Q-Flex LNG Carrier",      price: 120000000,   profitNM: 500000,  speed: 20, dwt: 216000,  cargo: "Gas",    tier: "late" },
  { name: "Q-Max LNG Carrier",       price: 250000000,   profitNM: 800000,  speed: 20, dwt: 266000,  cargo: "Gas",    tier: "endgame" },

  // ── VEHICLE TRANSPORTERS (Ro-Ro) ──
  { name: "High Speed Transporter",  price: 8000000,     profitNM: 45000,   speed: 30, dwt: 15000,   cargo: "Vehicle", tier: "mid" },
  { name: "Electrified Ferry",       price: 20000000,    profitNM: 90000,   speed: 28, dwt: 20000,   cargo: "Vehicle", tier: "mid" },
  { name: "Trimaran Cargo Transporter",price: 60000000,  profitNM: 250000,  speed: 35, dwt: 30000,   cargo: "Vehicle", tier: "late" },
  { name: "Mover Class Transporter", price: 150000000,   profitNM: 450000,  speed: 26, dwt: 50000,   cargo: "Vehicle", tier: "late" },
  { name: "Space Class Transporter", price: 280000000,   profitNM: 620000,  speed: 30, dwt: 60000,   cargo: "Vehicle", tier: "endgame" },
  { name: "King Class Transporter",  price: 420000000,   profitNM: 750000,  speed: 28, dwt: 80000,   cargo: "Vehicle", tier: "endgame" },

  // ── HEAVY LIFTERS ──
  { name: "Small Heavy Lifter",      price: 15000000,    profitNM: 70000,   speed: 18, dwt: 8000,    cargo: "Heavy",  tier: "mid" },
  { name: "Prototype Heavy Lifter",  price: 45000000,    profitNM: 290000,  speed: 22, dwt: 20000,   cargo: "Heavy",  tier: "mid" },
  { name: "Striker Heavy Lifter",    price: 90000000,    profitNM: 375000,  speed: 28, dwt: 30000,   cargo: "Heavy",  tier: "late" },
  { name: "Leviathan Heavy Lifter",  price: 400000000,   profitNM: 700000,  speed: 24, dwt: 80000,   cargo: "Heavy",  tier: "endgame" },
  { name: "Megalodon Heavy Lifter",  price: 600000000,   profitNM: 950000,  speed: 22, dwt: 120000,  cargo: "Heavy",  tier: "endgame" },

  // ── MISC / SPECIAL ──
  { name: "Midway Class Carrier",    price: 800000000,   profitNM: 1200000, speed: 30, dwt: 100000,  cargo: "Special", tier: "endgame" },
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
