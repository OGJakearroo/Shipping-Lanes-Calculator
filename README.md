# Shipping Lanes Grind Tracker

A self-contained grind tracker for **Roblox Shipping Lanes**. No install, no account — runs entirely in your browser and saves data locally.

**[Open the tracker](https://ogjakearroo.github.io/Shipping-Lanes-Calculator/)**

---

## Features

- **Dashboard** — live stats including gross/net per run, avg trip duration, avg income per minute and per hour, and smart predictions on how many runs/hours until your sell point
- **Efficiency card** — tracks your actual $/NM (profit per nautical mile) and $/min, compares against your target ship's $/NM, shows upgrade boost, and compares measured $/NM vs your ship's advertised rate
- **Run logging** — log each trip with your new balance, fuel cost, optional odometer start/end (for $/NM tracking), and optional start/end time
- **Auto-calculated trip duration** — enter start and end times, duration is worked out for you
- **Editable history** — click any cell in the history table to correct a past entry; delete individual runs with the trash icon
- **Live chart** — balance over time with trip duration bars on a dual axis; toggle net balance or individual run net; toggle duration bars
- **Sell point auto-calc** — enter target ship price and your current ship's resale value; sell point is calculated automatically
- **Persistent storage** — data survives closing the browser via `localStorage`
- **Export to JSON** — full backup, re-importable; filename includes your ship name and timestamp
- **Export to CSV** — for use in spreadsheets
- **Import JSON** — restore a backup on any device
- **Share URL** — encodes your full data into a URL you can copy and open on another device
- **Dark / light theme** toggle

---

## Getting Started

1. Open the [tracker](https://ogjakearroo.github.io/Shipping-Lanes-Calculator/)
2. A 3-step setup guide walks you through entering your balance, current ship details (including advertised $/NM), and target ship — with links to the [Ship List](https://roblox-shipping-lanes.fandom.com/wiki/Ship_List) where helpful
3. After each run, go to **Log Run**, enter your new balance and fuel cost, and hit **Log Run**
4. Optionally enter odometer start/end readings to enable $/NM efficiency tracking

---

## Settings

| Setting | Description |
|---|---|
| Current ship | Name of the ship you're currently grinding with |
| Current ship resale | What your current ship sells for |
| Sell point | Balance at which you sell and buy the next ship (auto-calculated if you set resale + target price) |
| Profit per NM | Your current ship's advertised earnings per nautical mile |
| Target ship | Name of the ship you're saving toward |
| Target ship price | Price of the target ship |
| Target ship profit/NM | The target ship's advertised $/NM — used to calculate your upgrade boost |
| Cargo type | The cargo you're hauling |
| Starting balance | Your balance at the start of the session |

---

## Efficiency Tracking

If you log odometer readings (start/end NM) for your runs, the **Efficiency** card will show:

- **Avg $/NM** — your actual measured profit per nautical mile across all logged runs
- **Avg $/min** — average income per minute (requires timed runs)
- **Target ship $/NM** — your target ship's rate for comparison
- **Upgrade boost** — how much more $/NM you'd earn after upgrading
- **Advertised $/NM** — your current ship's listed rate (if set)
- **VS Advertised** — whether you're beating or falling short of the advertised rate (green = meeting/exceeding, red = below)

---

## Transferring Data Between Devices

**Option A — JSON export/import:**
1. On device A: go to *Export / Import* → **Export JSON**
2. On device B: go to *Export / Import* → paste the JSON → **Import & Restore**

**Option B — Share URL:**
1. Go to *Export / Import* → **Copy Share URL**
2. Open that URL on any device — your data loads automatically

---

## Resetting

The **Reset** button (top right) clears all run history and ship settings in one step, then relaunches the setup guide so you can start fresh.

---

## Resources

- [Shipping Lanes Wiki](https://roblox-shipping-lanes.fandom.com/wiki/Shipping_Lanes_Wiki)
- [Ship List](https://roblox-shipping-lanes.fandom.com/wiki/Ship_List)
- [Cargo](https://roblox-shipping-lanes.fandom.com/wiki/Cargo_Types)
