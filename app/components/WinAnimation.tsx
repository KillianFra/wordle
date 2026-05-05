interface WinAnimationProps {
    onNewGame: () => void
}

export const WinAnimation = ({ onNewGame }: WinAnimationProps) => {
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
                        style={{ ...limb, fill: "none" as const }}
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
                  Initial opacity 0 works with forwards fill-mode on .heart-text.
                */}
                <text
                    x={280} y={52}
                    textAnchor="middle"
                    className="heart-text"
                    style={{ fill: "#e05c7a", fontSize: "30px", opacity: 0 }}
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
