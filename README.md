# ⚓ Shipping Lanes Grind Tracker

A self-contained, offline-capable grind tracker for **Roblox Shipping Lanes**.  
No build step. No dependencies to install. Just open `index.html` — or host it for free on GitHub Pages.

## Features

- 📊 **Dashboard** with smart predictions based on your actual run data
- ⏱ **Auto-calculated trip duration** from start/end time inputs
- 💾 **Persistent storage** via `localStorage` — survives closing the browser
- ⚙️ **Fully configurable** — set your own ship names, prices, sell point, resale value, route, and more
- 📤 **Export to JSON** (full backup, re-importable) or **CSV** (for spreadsheets)
- 📥 **Import JSON** to restore a previous backup on any device
- 🔗 **Share URL** — encodes your full data into a URL you can copy and send
- 📈 **Live chart** showing actual balance vs projected trajectory

## Quick Start (GitHub Pages)

1. Fork or clone this repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your tracker will be live at `https://<your-username>.github.io/<repo-name>/`

## Local Use

Just open `index.html` in any modern browser. No server needed.

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
