# ⚓ Shipping Lanes Grind Tracker

A self-contained, offline-capable grind tracker for **Roblox Shipping Lanes**.  

## Features

- 📊 **Dashboard** with smart predictions based on your actual run data
- ⏱ **Auto-calculated trip duration** from start/end time inputs
- 💾 **Persistent storage** via `localStorage` — survives closing the browser
- ⚙️ **Fully configurable** — set your own ship names, prices, sell point, resale value, route, and more
- 📤 **Export to JSON** (full backup, re-importable) or **CSV** (for spreadsheets)
- 📥 **Import JSON** to restore a previous backup on any device
- 🔗 **Share URL** — encodes your full data into a URL you can copy and send
- 📈 **Live chart** showing actual balance vs projected trajectory

## Local Use

Just go to 'https://ogjakearroo.github.io/Shipping-Lanes-Calculator/' to get started

## Transferring Data Between Devices

**Option A — JSON Export/Import:**
1. On device A: go to *Export / Import* tab → **Export JSON**
2. On device B: go to *Export / Import* tab → paste the JSON → **Import & Restore**

**Option B — Share URL:**
1. Go to *Export / Import* tab → **Copy Share URL**
2. Open that URL on any device — your data loads automatically

## Configuring for a Different Ship

Go to the **Settings** tab and update:
- Current ship name + resale value
- Sell-point balance (when to sell your current ship)
- Target ship name + price
- Route name and paid distance

All predictions update instantly.
