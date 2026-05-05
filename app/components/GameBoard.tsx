import { useState, useEffect, useCallback } from "react"
import { WordComponent } from "./WordComponent"
import { KeyboardComponent } from "./KeyboardComponent"
import { GameBoard as GameBoardUtil } from "~/utils/gameBoard"
import type { LetterStatus } from "~/types/types"
import { MAX_WORD_LENGTH } from "~/utils/constants"

const MAX_ATTEMPTS   = 6
const REVEAL_DELAY   = MAX_WORD_LENGTH * 250 + 500

export const GameBoard = () => {
    const [guesses, setGuesses]         = useState<string[]>([])
    const [allStatuses, setAllStatuses] = useState<LetterStatus[][]>([])
    const [currentGuess, setCurrentGuess] = useState("")
    const [gameOver, setGameOver]       = useState(false)
    const [won, setWon]                 = useState(false)
    const [targetWord, setTargetWord] = useState(GameBoardUtil.getRandomWord())
    const [error, setError]             = useState<string | null>(null)
    const [shakingRow, setShakingRow]   = useState<number | null>(null)
    const [revealingRow, setRevealingRow] = useState<number | null>(null)

    useEffect(() => {
        if (!error) return
        const t = setTimeout(() => setError(null), 1500)
        return () => clearTimeout(t)
    }, [error])

    const handleNewGame = useCallback(() => {
        setGuesses([])
        setAllStatuses([])
        setCurrentGuess("")
        setGameOver(false)
        setWon(false)
        setTargetWord(GameBoardUtil.getRandomWord())
        setError(null)
        setShakingRow(null)
        setRevealingRow(null)
    }, [])

    const handleKey = useCallback((key: string) => {
        if (gameOver) return

        if (key === 'Enter') {
            const validation = GameBoardUtil.checkWord(currentGuess)
            if (!validation.success) {
                setError(validation.error || "Not in word list")
                const idx = guesses.length
                setShakingRow(idx)
                setTimeout(() => setShakingRow(r => r === idx ? null : r), 600)
                return
            }
            setError(null)

            const rowStatuses = GameBoardUtil.compareWord(currentGuess, targetWord)
            const rowIndex    = guesses.length
            const nextGuesses  = [...guesses, currentGuess]
            const nextStatuses = [...allStatuses, rowStatuses]

            setGuesses(nextGuesses)
            setAllStatuses(nextStatuses)
            setCurrentGuess("")
            setRevealingRow(rowIndex)
            setTimeout(() => setRevealingRow(null), REVEAL_DELAY)

            const isWin = currentGuess === targetWord
            setTimeout(() => {
                if (isWin) { setWon(true); setGameOver(true) }
                else if (nextGuesses.length >= MAX_ATTEMPTS) { setGameOver(true) }
            }, REVEAL_DELAY)

        } else if (key === 'Backspace') {
            setCurrentGuess(prev => prev.slice(0, -1))
        } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < MAX_WORD_LENGTH) {
            setCurrentGuess(prev => prev + key.toLowerCase())
        }
    }, [gameOver, currentGuess, guesses, allStatuses, targetWord])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') e.preventDefault()
            handleKey(e.key)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [handleKey])

    const rows = Array(MAX_ATTEMPTS).fill(null).map((_, i) => {
        if (i < guesses.length)               return { word: guesses[i],    statuses: allStatuses[i] }
        if (i === guesses.length && !gameOver) return { word: currentGuess, statuses: undefined }
        return { word: "", statuses: undefined }
    })

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>

            {/* Error toast */}
            <div style={{ height: "36px", display: "flex", alignItems: "center" }}>
                {error && (
                    <div
                        className="toast-enter"
                        style={{
                            backgroundColor: '#ffffff',
                            color:           '#121213',
                            padding:         '6px 18px',
                            borderRadius:    '4px',
                            fontFamily:      "'Karla', sans-serif",
                            fontWeight:      700,
                            fontSize:        '0.85rem',
                            letterSpacing:   '0.05em',
                            textTransform:   'uppercase',
                        }}
                    >
                        {error}
                    </div>
                )}
            </div>

            {/* Board */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {rows.map((row, i) => (
                    <WordComponent
                        key={i}
                        word={row.word}
                        statuses={row.statuses}
                        isRevealing={revealingRow === i}
                        shake={shakingRow === i}
                    />
                ))}
            </div>

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

            {/* Keyboard */}
            <div style={{ marginTop: "16px" }}>
                <KeyboardComponent
                    guesses={guesses}
                    allStatuses={allStatuses}
                    onKey={handleKey}
                />
            </div>
        </div>
    )
}
