# Win Animation Design

**Date:** 2026-05-05  
**Status:** Approved

## Overview

When the player wins a Wordle game, a fullscreen animated overlay appears showing two stickmen fighting. After 5 seconds one dies, and the winner starts making out with the loser's girlfriend.

## Architecture

### New file: `app/components/WinAnimation.tsx`

A React component that renders a `position: fixed` fullscreen overlay. Mounted inside `GameBoard.tsx` when `won === true`, sitting above the board. Contains the SVG scene and a "New Game" button that fades in after the animation completes.

### Modified files

- `app/components/GameBoard.tsx` — mount `<WinAnimation onNewGame={handleNewGame} />` when `won === true`
- `app/app.css` — add all new `@keyframes` for the animation phases

## Visual Structure

A single inline `<svg>` element (~500×300px, centered in the overlay) contains:

- **Fighter A** (left, ~x=140): winner — circle head + line body/arms/legs
- **Fighter B** (right, ~x=360): loser — same construction
- **Girlfriend** (far right, ~x=460, initially off-screen): distinguished by a triangle skirt shape and longer hair lines

All characters are white strokes on the dark overlay background.

## Animation Phases

### Phase 1 — Fight (0–5s)
- Fighter A's right arm swings forward repeatedly (`@keyframes punch-left`)
- Fighter B's left arm swings forward repeatedly (`@keyframes punch-right`)
- Bodies oscillate slightly left/right (`@keyframes body-sway`)
- A `*POW*` text element flashes between them on each punch cycle (`@keyframes pow-flash`)

### Phase 2 — Death (5–6s)
- Fighter B's entire `<g>` group rotates 90° clockwise around its feet (`@keyframes fall-right`)
- A small `✝` text appears above Fighter B's position (`@keyframes cross-appear`)
- Fighter A's arms raise in a victory pose (`@keyframes victory-arms`)

### Phase 3 — Romance (6–8s)
- Fighter A slides right toward center (`@keyframes winner-slide-right`)
- Girlfriend slides in from the right edge (`@keyframes girlfriend-slide-left`)
- Both lean inward (head circles move toward each other) (`@keyframes lean-in-left`, `@keyframes lean-in-right`)
- A `❤` text pulses between them (`@keyframes heart-pulse`)

### Phase 4 — End (8s+)
- "New Game" button fades in at the bottom of the overlay (`@keyframes fade-in`)
- `animation-fill-mode: forwards` used on all keyframes so final states persist

## Implementation Notes

- All keyframes use `animation-fill-mode: forwards` to hold the final frame
- Phase timing is achieved via `animation-delay` on each element's class
- The overlay itself fades in over 0.3s to avoid jarring the player
- Clicking the overlay does NOT dismiss it — only the "New Game" button does
- No sound effects
- Component is unmounted (not hidden) when `won` resets to `false` on new game, so all animations reset automatically
