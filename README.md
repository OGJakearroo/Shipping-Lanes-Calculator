# Shipping Lanes Grind Tracker

A self-contained grind tracker for **Roblox Shipping Lanes**. No install, no account — runs entirely in your browser and saves data locally.

**[Open the tracker](https://ogjakearroo.github.io/Shipping-Lanes-Calculator/)**

---

## Features

- **Dashboard** — live stats including gross/net per run, avg trip duration, and smart predictions on how many runs/hours until your sell point
- **Run logging** — log each trip with your new balance, fuel cost, and optional start/end time
- **Auto-calculated trip duration** — enter start and end times, duration is worked out for you
- **Editable history** — click any cell in the history table to correct a past entry
- **Live chart** — balance over time with trip duration bars on a dual axis
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
2. Enter your current in-game balance when prompted
3. Go to **Settings** and configure your ship details
4. After each run, go to **Log Run**, enter your new balance and fuel cost, and hit **Log Run**

---

## Settings

| Setting | Description |
|---|---|
| Current ship | Name of the ship you're currently grinding with |
| Current ship resale | What your current ship sells for |
| Sell point | Balance at which you sell and buy the next ship (auto-calculated if you set resale + target price) |
| Profit per nautical mile | Your route's payout rate |
| Target ship | Name of the ship you're saving toward |
| Target ship price | Price of the target ship |
| Cargo type | The cargo you're hauling |
| Starting balance | Your balance at the start of the session |

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

The **Reset** button (top right) clears all run history. You'll also be asked whether to reset ship settings (name, prices, cargo, etc.) or keep them.

---

## Resources

- [Shipping Lanes Wiki](https://roblox-shipping-lanes.fandom.com/wiki/Shipping_Lanes_Wiki)
