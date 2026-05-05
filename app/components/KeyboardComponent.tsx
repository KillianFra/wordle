import type { LetterStatus } from '~/types/types'

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

const STATUS_PRIORITY: Record<LetterStatus, number> = {
    correct: 3,
    present: 2,
    absent:  1,
    empty:   0,
}

const STATUS_BG: Record<LetterStatus, string> = {
    correct: '#538d4e',
    present: '#b59f3b',
    absent:  '#3a3a3c',
    empty:   '#818384',
}

type KeyboardComponentProps = {
    guesses: string[]
    allStatuses: LetterStatus[][]
    onKey: (key: string) => void
}

export const KeyboardComponent = ({ guesses, allStatuses, onKey }: KeyboardComponentProps) => {
    const letterStatuses: Record<string, LetterStatus> = {}

    guesses.forEach((guess, gi) => {
        guess.split('').forEach((letter, li) => {
            const status  = allStatuses[gi][li]
            const current = letterStatuses[letter] ?? 'empty'
            if (STATUS_PRIORITY[status] > STATUS_PRIORITY[current]) {
                letterStatuses[letter] = status
            }
        })
    })

    const handleClick = (key: string) => {
        onKey(key === '⌫' ? 'Backspace' : key)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            {KEYBOARD_ROWS.map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px' }}>
                    {row.map(key => {
                        const isSpecial = key === 'Enter' || key === '⌫'
                        const status    = isSpecial ? 'empty' : (letterStatuses[key.toLowerCase()] ?? 'empty')
                        return (
                            <button
                                key={key}
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => handleClick(key)}
                                style={{
                                    width:           isSpecial ? '66px' : '43px',
                                    height:          '58px',
                                    display:         'flex',
                                    justifyContent:  'center',
                                    alignItems:      'center',
                                    backgroundColor: STATUS_BG[status],
                                    border:          'none',
                                    borderRadius:    '4px',
                                    fontFamily:      "'Karla', sans-serif",
                                    fontWeight:      700,
                                    fontSize:        isSpecial ? '0.75rem' : '0.9rem',
                                    color:           '#ffffff',
                                    cursor:          'pointer',
                                    textTransform:   'uppercase',
                                    letterSpacing:   isSpecial ? '0.02em' : '0',
                                    userSelect:      'none',
                                    transition:      'background-color 0.2s ease',
                                }}
                            >
                                {key}
                            </button>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}
