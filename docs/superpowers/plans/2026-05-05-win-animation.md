# Win Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a fullscreen stickman fight animation when the player wins, with two fighters punching for 5s, one dying, and the winner making out with the loser's girlfriend.

**Architecture:** A new `WinAnimation` component renders a `position:fixed` overlay with an inline SVG scene. All motion is driven by CSS `@keyframes` with `animation-delay` controlling each phase. `GameBoard` mounts the overlay when `won === true` and hides the existing win-message panel.

**Tech Stack:** React 19, TypeScript, CSS keyframes, inline SVG

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `app/app.css` | All new `@keyframes` + CSS classes for the animation |
| Create | `app/components/WinAnimation.tsx` | Overlay component with SVG scene + New Game button |
| Modify | `app/components/GameBoard.tsx` | Mount `<WinAnimation>` on win; hide old win panel |

---

## Task 1 — Add CSS keyframes and classes

**Files:**
- Modify: `app/app.css`

- [ ] **Step 1: Append the following block to the end of `app/app.css`**

```css
/* ─── Win animation ──────────────────────────────────────── */

@keyframes overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes punch-a {
  0%, 100% { transform: rotate(0deg); }
  50%       { transform: rotate(-45deg); }
}

@keyframes punch-b {
  0%, 100% { transform: rotate(0deg); }
  50%       { transform: rotate(45deg); }
}

@keyframes body-sway-a {
  0%, 100% { transform: translateX(0); }
  50%       { transform: translateX(6px); }
}

@keyframes body-sway-b {
  0%, 100% { transform: translateX(0); }
  50%       { transform: translateX(-6px); }
}

@keyframes pow-flash {
  0%, 45%, 100% { opacity: 0; transform: scale(0.7); }
  22%            { opacity: 1; transform: scale(1.3); }
}

@keyframes fall-over {
  from { transform: rotate(0deg); }
  to   { transform: rotate(88deg); }
}

@keyframes appear {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes victory-a {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-80deg); }
}

@keyframes winner-move {
  from { transform: translateX(0); }
  to   { transform: translateX(150px); }
}

@keyframes gf-move {
  0%   { transform: translateX(150px); opacity: 0; }
  30%  { opacity: 1; }
  100% { transform: translateX(0);     opacity: 1; }
}

@keyframes heart-beat {
  0%, 100% { transform: scale(1);   opacity: 0.8; }
  50%       { transform: scale(1.5); opacity: 1; }
}

@keyframes btn-appear {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.win-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: overlay-in 0.3s ease forwards;
}

/* Fighter A outer group: slides right starting at 6s */
.fighter-a-outer {
  animation: winner-move 2s ease 6s 1 both;
}

/* Fighter A inner group: body sway during fight (0–4.8s) */
.fighter-a-inner {
  animation: body-sway-a 0.4s ease-in-out 12 forwards;
}

/* Fighter B outer group: falls at 5s (rotate around feet) */
.fighter-b-outer {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: fall-over 0.8s ease 5s 1 both;
}

/* Fighter B inner group: body sway during fight */
.fighter-b-inner {
  animation: body-sway-b 0.4s ease-in-out 12 forwards;
}

/* Fighter A right arm outer: victory pose at 5s */
.punch-arm-a-outer {
  transform-box: fill-box;
  transform-origin: 0% 0%;
  animation: victory-a 0.3s ease 5s 1 both;
}

/* Fighter A right arm inner: punch during fight */
.punch-arm-a-inner {
  transform-box: fill-box;
  transform-origin: 0% 0%;
  animation: punch-a 0.4s ease-in-out 12 forwards;
}

/* Fighter B left arm: punch during fight */
.punch-arm-b {
  transform-box: fill-box;
  transform-origin: 100% 0%;
  animation: punch-b 0.4s ease-in-out 12 forwards;
}

.pow-text {
  animation: pow-flash 0.4s ease-in-out 12 forwards;
}

/* Cross and winner label appear after death */
.cross-text {
  animation: appear 0.4s ease 5.8s 1 both;
}

.winner-label {
  animation: appear 0.4s ease 5.1s 1 both;
}

/* Girlfriend slides in from right starting at 6s */
.girlfriend-outer {
  animation: gf-move 2s ease 6s 1 both;
}

/* Heart pulses between characters starting at 7s */
.heart-text {
  animation: heart-beat 0.5s ease-in-out 7s 6 both;
}

/* New Game button fades in at 8s */
.win-new-game-btn {
  margin-top: 24px;
  padding: 12px 32px;
  background-color: #538d4e;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-family: 'Karla', sans-serif;
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  animation: btn-appear 0.5s ease 8s 1 both;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/app.css
git commit -m "feat(win-animation): add CSS keyframes and classes for stickman animation"
```

---

## Task 2 — Create WinAnimation component

**Files:**
- Create: `app/components/WinAnimation.tsx`

- [ ] **Step 1: Create `app/components/WinAnimation.tsx` with the full content below**

```tsx
import React from "react"

interface WinAnimationProps {
    onNewGame: () => void
}

export const WinAnimation: React.FC<WinAnimationProps> = ({ onNewGame }) => {
    const limb = {
        stroke: "#ffffff" as const,
        strokeWidth: 3,
        strokeLinecap: "round" as const,
    }
    const head = {
        fill: "none" as const,
        stroke: "#ffffff" as const,
        strokeWidth: 3,
    }

    return (
        <div className="win-overlay">
            <svg
                viewBox="0 0 500 260"
                width="500"
                height="260"
                style={{ overflow: "visible" }}
            >
                {/* ── Fighter A (winner) ── */}
                {/*
                  Outer group slides Fighter A 150px right starting at 6s.
                  WINNER label is inside so it slides with the fighter.
                */}
                <g className="fighter-a-outer">
                    <text
                        x={100} y={30}
                        textAnchor="middle"
                        className="winner-label"
                        style={{
                            fill: "#538d4e",
                            fontSize: "14px",
                            fontWeight: "bold",
                            fontFamily: "Karla, sans-serif",
                        }}
                    >
                        WINNER
                    </text>
                    {/* Inner group sways left/right during fight */}
                    <g className="fighter-a-inner">
                        <circle cx={100} cy={65} r={20} style={head} />
                        <line x1={100} y1={85}  x2={100} y2={165} style={limb} />
                        {/* static left arm */}
                        <line x1={100} y1={115} x2={68}  y2={150} style={limb} />
                        {/*
                          Right arm — two nested groups so two transforms compose:
                          outer: victory-a (raises arm at 5s)
                          inner: punch-a   (punches during fight 0–4.8s)
                          Both rotate around transform-origin 0% 0% = shoulder (100, 115).
                        */}
                        <g className="punch-arm-a-outer">
                            <g className="punch-arm-a-inner">
                                <line x1={100} y1={115} x2={133} y2={150} style={limb} />
                            </g>
                        </g>
                        <line x1={100} y1={165} x2={75}  y2={230} style={limb} />
                        <line x1={100} y1={165} x2={125} y2={230} style={limb} />
                    </g>
                </g>

                {/* ── Fighter B (loser) ── */}
                {/*
                  Outer group rotates 88° clockwise around feet at 5s (falls right).
                  transform-box:fill-box + transform-origin:50% 100% = foot level.
                */}
                <g className="fighter-b-outer">
                    {/* Inner group sways left/right during fight */}
                    <g className="fighter-b-inner">
                        <circle cx={380} cy={65} r={20} style={head} />
                        <line x1={380} y1={85}  x2={380} y2={165} style={limb} />
                        {/* static right arm */}
                        <line x1={380} y1={115} x2={412} y2={150} style={limb} />
                        {/*
                          Left arm punches toward Fighter A.
                          transform-origin 100% 0% = top-right of bounding box = shoulder (380, 115).
                        */}
                        <g className="punch-arm-b">
                            <line x1={380} y1={115} x2={347} y2={150} style={limb} />
                        </g>
                        <line x1={380} y1={165} x2={355} y2={230} style={limb} />
                        <line x1={380} y1={165} x2={405} y2={230} style={limb} />
                    </g>
                </g>

                {/* ── Girlfriend ── */}
                {/*
                  Drawn at final position x=310.
                  gf-move slides her from translateX(150px) → translateX(0),
                  so she starts off-screen right (≈x=460) and slides in at 6s.
                  At 8s her head is at x=310; Fighter A head is at x=100+150=250.
                  Gap of 60px with ❤ between them at x=280.
                */}
                <g className="girlfriend-outer">
                    <circle cx={310} cy={65} r={18} style={head} />
                    {/* hair */}
                    <line x1={295} y1={50} x2={285} y2={28} style={{ ...limb, strokeWidth: 2 }} />
                    <line x1={310} y1={47} x2={310} y2={22} style={{ ...limb, strokeWidth: 2 }} />
                    <line x1={325} y1={50} x2={335} y2={28} style={{ ...limb, strokeWidth: 2 }} />
                    {/* body */}
                    <line x1={310} y1={83}  x2={310} y2={155} style={limb} />
                    {/* arms */}
                    <line x1={310} y1={110} x2={283} y2={142} style={limb} />
                    <line x1={310} y1={110} x2={337} y2={142} style={limb} />
                    {/* skirt */}
                    <polygon
                        points="287,155 333,155 310,193"
                        style={{ fill: "none", stroke: "#ffffff", strokeWidth: 3 }}
                    />
                    {/* legs */}
                    <line x1={297} y1={193} x2={283} y2={240} style={limb} />
                    <line x1={323} y1={193} x2={337} y2={240} style={limb} />
                </g>

                {/* ── Effects ── */}

                {/* POW flashes between fighters during fight */}
                <text
                    x={240} y={85}
                    textAnchor="middle"
                    className="pow-text"
                    style={{
                        fill: "#ffcc00",
                        fontSize: "22px",
                        fontWeight: "bold",
                        fontFamily: "Karla, sans-serif",
                    }}
                >
                    *POW*
                </text>

                {/* Cross appears above fallen Fighter B at 5.8s */}
                <text
                    x={450} y={120}
                    textAnchor="middle"
                    className="cross-text"
                    style={{ fill: "#777777", fontSize: "26px" }}
                >
                    ✝
                </text>

                {/*
                  Heart pulses between the two characters at 7s.
                  At 8s: Fighter A head ≈ x=250, Girlfriend head ≈ x=310 → midpoint x=280.
                */}
                <text
                    x={280} y={52}
                    textAnchor="middle"
                    className="heart-text"
                    style={{ fill: "#e05c7a", fontSize: "30px" }}
                >
                    ❤
                </text>
            </svg>

            <button
                onMouseDown={e => e.preventDefault()}
                onClick={onNewGame}
                className="win-new-game-btn"
            >
                New Game
            </button>
        </div>
    )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/WinAnimation.tsx
git commit -m "feat(win-animation): add WinAnimation component with SVG stickmen"
```

---

## Task 3 — Wire WinAnimation into GameBoard

**Files:**
- Modify: `app/components/GameBoard.tsx`

- [ ] **Step 1: Add the import at the top of `app/components/GameBoard.tsx` (after the existing imports)**

Add this line after the existing imports:
```tsx
import { WinAnimation } from "./WinAnimation"
```

- [ ] **Step 2: Replace the game-over panel in the JSX**

Find this block (lines 132–180 of `app/components/GameBoard.tsx`):

```tsx
            {/* Game-over panel */}
            {gameOver && (
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                    {won ? (
                        <p style={{
                            margin:      0,
                            fontFamily:  "'Karla', sans-serif",
                            fontWeight:  800,
                            fontSize:    '1.1rem',
                            color:       '#538d4e',
                            letterSpacing: '0.04em',
                        }}>
                            Magnificent!
                        </p>
                    ) : (
                        <p style={{
                            margin:     0,
                            fontFamily: "'Karla', sans-serif",
                            fontWeight: 700,
                            fontSize:   '1rem',
                            color:      '#ffffff',
                        }}>
                            The word was{' '}
                            <span style={{ color: '#b59f3b', fontWeight: 800, textTransform: 'uppercase' }}>
                                {targetWord}
                            </span>
                        </p>
                    )}
                    <button
                        onMouseDown={e => e.preventDefault()}
                        onClick={handleNewGame}
                        style={{
                            marginTop:   '16px',
                            padding:     '12px 32px',
                            backgroundColor: '#538d4e',
                            color:       '#ffffff',
                            border:      'none',
                            borderRadius: '4px',
                            fontFamily:  "'Karla', sans-serif",
                            fontWeight:  800,
                            fontSize:    '0.95rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            cursor:      'pointer',
                        }}
                    >
                        New Game
                    </button>
                </div>
            )}
```

Replace it with:

```tsx
            {/* Win animation overlay — replaces the old "Magnificent!" panel */}
            {won && <WinAnimation onNewGame={handleNewGame} />}

            {/* Loss panel — only shown when game over without winning */}
            {!won && gameOver && (
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                    <p style={{
                        margin:     0,
                        fontFamily: "'Karla', sans-serif",
                        fontWeight: 700,
                        fontSize:   '1rem',
                        color:      '#ffffff',
                    }}>
                        The word was{' '}
                        <span style={{ color: '#b59f3b', fontWeight: 800, textTransform: 'uppercase' }}>
                            {targetWord}
                        </span>
                    </p>
                    <button
                        onMouseDown={e => e.preventDefault()}
                        onClick={handleNewGame}
                        style={{
                            marginTop:   '16px',
                            padding:     '12px 32px',
                            backgroundColor: '#538d4e',
                            color:       '#ffffff',
                            border:      'none',
                            borderRadius: '4px',
                            fontFamily:  "'Karla', sans-serif",
                            fontWeight:  800,
                            fontSize:    '0.95rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            cursor:      'pointer',
                        }}
                    >
                        New Game
                    </button>
                </div>
            )}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm typecheck
```

Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
git add app/components/GameBoard.tsx
git commit -m "feat(win-animation): wire WinAnimation into GameBoard on win"
```
