# Home OS — Prototype

A single responsive web app that acts as the host / override surface for a home spatial-intelligence system. Floorplan-centric on desktop, scene-picker-centric on mobile, **same codebase**.

Modeled on Field.io's **SpringOS** (ambient, scene-driven), with the structural shell pattern lifted from **atom63.io/sys63** (full-viewport fixed shell, no rubber-band).

> **Status:** proof-of-concept. UI works end-to-end with mock state; no real device backend yet. See [plan.md](plan.md) for the full architecture and phased roadmap.

---

## What's in here

- **Floorplan home view** — SVG digital twin, 5 zones, brightness halos, presence indicator
- **Scene picker** — FOCUS / CALM / SOCIAL / SLEEP / AWAY, each applies a declarative per-room state map
- **Zone drill-in** — tap a zone for brightness slider + on/off
- **Drill-in pages** — Dashboard (sensor metrics), Lighting (per-room dimmer), Energy (solar)
- **Responsive split**
  - Mobile: stacked single-page with bottom nav
  - Desktop (≥900px): side rail + floorplan pane + selected-page pane

State is shared across surfaces via a `RoomsProvider` context — applying a scene on the floorplan updates the dimmer on the Lighting page in real time.

## Stack

- Vite + React 18 + TypeScript
- Framer Motion (animations)
- Recharts (charts on Energy / Dashboard)
- React Spring (animated counters)
- No router (state-machine page switching for now)
- No backend yet — sensor data is local `setInterval`

## Getting started

```bash
npm install
npm run dev
```

Opens on http://localhost:5173. Resize the browser window across 900px to switch between mobile and desktop layouts.

## Project layout

```
src/
├── App.tsx                  # responsive shell (mobile stack vs desktop split)
├── main.tsx                 # entry, wraps in RoomsProvider
├── index.css                # sys63-style fixed-viewport shell
├── components/
│   ├── BottomNav.tsx        # bottom (mobile) + side rail (desktop) variants
│   ├── CircularDimmer.tsx   # 270° drag-to-set dimmer
│   └── widgets/             # AreaChart, BarChart wrappers
├── pages/
│   ├── Home.tsx             # floorplan + scenes + zone detail
│   ├── Dashboard.tsx        # sensor metric cards + add-device sheet
│   ├── Lighting.tsx         # per-room brightness + analytics
│   └── Energy.tsx           # solar gauge / battery / output
├── state/
│   └── rooms.tsx            # shared room state context
├── hooks/
│   └── useMediaQuery.ts
└── data/
    └── mockData.ts          # seed values + history series
```

## Design language

- Cream `#EEEEE8` background, paper feel (not glass / dark)
- Mono fonts (Space Mono) for data, Inter for prose
- Accent orange `#E85D04` for live signals
- Slow easings (0.6–1.2s) — the "living organism" feel SpringOS describes
- Tile borders, not shadows

## What this prototype does **not** yet do

- Talk to real devices (no MQTT / Home Assistant)
- Persist state (resets on reload)
- Run the scene engine server-side (currently runs in the browser, so it stops when the tab closes)
- Schedule scenes / circadian curves
- Spatial analytics (presence heatmap)

These are tracked in [plan.md](plan.md) under the phased build.
