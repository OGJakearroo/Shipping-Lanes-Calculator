# Shipping Lanes Tracker

> **Disclaimer:** This project is entirely vibe coded — built through AI-assisted iteration with no formal software engineering process. It works, but don't expect production-grade code under the hood. Use at your own discretion.

A self-contained progress tracker for **Roblox Shipping Lanes**. No install, no account — runs entirely in your browser and saves data locally.

**[Open the tracker](https://ogjakearroo.github.io/Shipping-Lanes-Calculator/)**

---

## Features

### Dashboard
- Current balance, still needed to sell point, avg income/hr, and estimated time remaining
- **Smart prediction** — avg net per trip, avg trip duration, sell-current-ship value, trips remaining after selling, and total time to target ship
- **Balance progression chart** — actual balance over time with projected trajectory; toggleable layers for sell point, target price, trip duration bars, and odometer trend

### Efficiency Tab
- Summary stats: avg and best $/NM, avg and best $/min, total NM sailed, total time logged
- **$/NM trend chart** — your profit-per-nautical-mile plotted run by run, with reference lines for your ship's advertised rate and your target ship's rate
- **Ship comparison** — advertised $/NM vs your actual measured $/NM, with upgrade earnings boost %
- **Per-run efficiency table** — distance, $/NM, $/min, and deviation from your average for every logged run

### Log Run
- Enter new balance and fuel cost after each trip
- Optional odometer start/end readings for $/NM tracking
- Optional start/end times with auto-calculated duration preview
- **Form persists** across browser refreshes and closes — picks up where you left off

### History
- Full run table: balance, fuel, gross, net, odo start, odo end, **distance (auto-calculated)**, duration, $/NM, $/min
- Click any cell to edit in-place; delete individual runs; undo last run
- Totals row: total earned, total fuel cost, total time logged

### Other
- **Sell point auto-calc** — set target ship price and current ship resale; sell point is calculated automatically
- **Persistent storage** — all data saved in `localStorage`; survives browser close
- **Export to JSON** — full backup including settings, re-importable on any device
- **Export to CSV** — run history as a spreadsheet-compatible file
- **Import JSON** — restore any previous backup
- **Share URL** — encodes your data into a shareable URL (shortened via is.gd); anyone with the link can view your progress
- **Dark / light theme** toggle
- **3-step onboarding** — guided setup for balance, current ship, and target ship with links to the wiki

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
| Current ship | Name of the ship you're currently sailing |
| Current ship resale | What your current ship sells for |
| Sell point | Balance at which you sell and buy the next ship (auto-calculated if you set resale + target price) |
| Profit per NM | Your current ship's advertised earnings per nautical mile |
| Target ship | Name of the ship you're saving toward |
| Target ship price | Price of the target ship |
| Target ship profit/NM | The target ship's advertised $/NM — used to calculate your upgrade boost |
| Cargo type | The cargo you're hauling |
| Starting balance | Your balance at the start of tracking |

---

## Efficiency Tracking

Log odometer readings (start/end NM) on each run to unlock $/NM stats. Log start/end times to unlock $/min stats. Both are optional but the more you log, the more detail you get in the **Efficiency** tab.

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
