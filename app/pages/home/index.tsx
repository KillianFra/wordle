import { GameBoard } from "~/components/GameBoard"

export function Home() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#121213",
        }}>
            <header style={{
                width: "100%",
                borderBottom: "1px solid #3a3a3c",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "64px",
            }}>
                <h1 style={{
                    margin: 0,
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "2.4rem",
                    letterSpacing: "0.12em",
                    color: "#ffffff",
                }}>
                    Wordle
                </h1>
            </header>

            <main style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                paddingTop: "2rem",
                width: "100%",
            }}>
                <GameBoard />
            </main>
        </div>
    )
}
