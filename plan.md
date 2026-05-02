# Home OS — Plan

## Vision

A single responsive web app that acts as the **host / override surface** for a home spatial-intelligence system — floorplan-centric on desktop, scene-picker-centric on mobile, same codebase. Modeled on SpringOS (ambient, scene-driven), not on tile-grid dashboards.

## Architecture

**Two halves, hard line between them.**

- **Backend = the brain.** Runs 24/7 on a Pi/NUC. Owns sensors, devices, scenes, schedules, circadian curves. Exposes WebSocket (live state) + REST (config). **Adopt Home Assistant** — don't build a device-abstraction layer.
- **Frontend = the window.** Static SPA, served from the same box. Pure view + override surface. Zero rule logic in the browser.

This split is non-negotiable. Lights and sound have to keep responding when every phone in the house is asleep.

## Frontend stack

- **Vite + React + TypeScript** — static SPA, installable PWA
- **TailwindCSS + Radix UI** *(planned)* — primitives for menus / dialogs / sheets. POC is using inline styles + CSS variables.
- **Framer Motion** — slow, organic easings (600–1200ms ease-in-out-cubic) for "living organism" feel
- **SVG (or Konva if perf demands)** — floorplan / digital twin, NOT a grid library
- **Zustand** *(planned)* — client state. POC uses React Context.
- **TanStack Query** *(planned)* — REST config caching
- **Native WebSocket** *(planned)* — live sensor stream
- **Iconify** *(planned)* — device / sensor iconography
- **Service worker** *(planned)* — offline last-known state + Web Push for alerts

## Shell pattern (lifted from sys63)

```css
html, body {
  position: fixed; inset: 0; overflow: hidden;
  overscroll-behavior: none; touch-action: none;
}
#root { position: fixed; inset: 0; }
```

Plus `<meta viewport ... maximum-scale=1, user-scalable=no, viewport-fit=cover>`. Kills pull-to-refresh and rubber-banding so it stops feeling like a webpage.

## Responsive split (same code, different density)

| Surface | Primary view | Interaction |
|---|---|---|
| **Mobile** | Scene carousel + single-zone sheet | Swipe between rooms, tap to override |
| **Tablet** | Floorplan + side panel | Touch zones, scene chips |
| **Desktop** | Full twin + timeline editor + multi-pane | Drag schedules, edit scene grammar |

## Core surfaces (build in this order)

1. **Spatial twin** — SVG floorplan, zones as hit-test polygons, sensor values as heat / glow overlays driven by WebSocket
2. **Scene picker** — declarative JSON scenes (zones × actuators × curves), executed server-side
3. **Override semantics** — explicit decision: tap "calm" → sticks until {next scheduled scene | midnight | manual clear}. Pick one, surface it in the UI.
4. **Schedule / timeline editor** (desktop-only)
5. **Spatial analytics** (movement / dwell heatmap, post-MVP)

## Phased build

### Phase 0 — Shell ✅ done
Vite scaffold + sys63 viewport CSS + Framer Motion. Existing iPhone-frame mockup removed; full-viewport responsive shell.

### Phase 1 — Mock prototype ✅ done
- `RoomsProvider` context owns room state
- SVG floorplan (5 zones) with halos, presence dot, click-to-select
- Scene strip (FOCUS / CALM / SOCIAL / SLEEP / AWAY) applies declarative per-room outputs
- Zone detail card with brightness slider + on/off
- Mobile bottom nav, desktop side rail + split panes
- Existing Dashboard / Lighting / Energy pages preserved as drill-ins
- Lighting page wired to shared context (verified: floorplan and dimmer mirror each other)

### Phase 2 — Real-time mock ⏳ next
- Replace `setInterval` mocks with a fake WebSocket server (Node, in `server/`)
- Add `useSensorStream` hook abstracting WS subscriptions
- Define a topic schema: `home/<zone>/<sensor>` → JSON payloads
- Add a fake schedule engine on the server so scenes / circadian run independently of the browser

### Phase 3 — Home Assistant integration
- Stand up Home Assistant on a Pi/NUC
- Map HA entities → our zones / actuators in a config file
- Replace fake WS with HA's WebSocket API
- Replace REST stub with HA REST API for config

### Phase 4 — Scene grammar + schedules
- Formal JSON scene format (zones × actuators × curves × priorities)
- Desktop timeline editor (drag scheduled scenes onto a 24h grid)
- Server-side execution via HA automations OR a thin custom rules service
- Override priority model surfaced in UI ("manual override until 18:00")

### Phase 5 — Polish
- Circadian color-temp curves
- Service worker — offline last-known state
- Web Push for alerts (door open, leak, presence at unusual time)
- Spatial analytics view (dwell / movement heatmap)
- PWA install prompts

## Hard problems (not framework choices — flag now, decide later)

1. **Floorplan authoring** — who draws the SVG, how zones get calibrated to real-world sensor positions. ~60% of total work. POC uses hand-coded coordinates.
2. **Scene grammar** — the rule language is the actual product. Sketch it on paper before coding.
3. **Override priority model** — must be explicit and visible. "calm until {when}?" needs an answer.
4. **iOS background limits** — locked-screen Safari throttles WebSockets hard. Live updates only when foregrounded; rely on server-side push for alerts.

## What's explicitly out of scope (v1)

- Custom device drivers (HA handles)
- Voice (later — Web Speech API is fine when we get there)
- 3D spatial view (2D floorplan is enough; 3D is demo-candy)
- Third-party widget SDK (closed widget set for v1)
- Multi-home / multi-tenant
- Account / auth (assume LAN trust for v1)

## Reference points

- **Field.io / SpringOS** — ambient OS, digital twin + scene engine + override surface. The shape we're building.
- **atom63.io / sys63** — Vite + React shell pattern, fixed-viewport CSS, vendor-chunked widgets. The chrome we're copying.
- **Home Assistant** — the brain we're not building.
