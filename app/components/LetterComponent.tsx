import type { LetterStatus } from '~/types/types'

type LetterComponentProps = {
    letter: string
    status: LetterStatus
    index: number
    isRevealing?: boolean
    isJustTyped?: boolean
}

const STATUS_BG: Record<LetterStatus, string> = {
    correct: '#538d4e',
    present: '#b59f3b',
    absent:  '#3a3a3c',
    empty:   'transparent',
}

const STATUS_BORDER: Record<LetterStatus, string> = {
    correct: '#538d4e',
    present: '#b59f3b',
    absent:  '#3a3a3c',
    empty:   '#3a3a3c',
}

export const LetterComponent = ({ letter, status, index, isRevealing, isJustTyped }: LetterComponentProps) => {
    const hasStatus = status !== 'empty'
    const isActive  = status === 'empty' && letter !== ''

    let animationClass = ''
    if (isRevealing && hasStatus) animationClass = 'tile-flip'
    else if (isJustTyped)         animationClass = 'tile-pop'

    const bgColor     = isRevealing && hasStatus ? 'transparent' : STATUS_BG[status]
    const borderColor = isActive ? '#999999' : STATUS_BORDER[status]

    return (
        <div
            className={animationClass}
            style={{
                '--reveal-color':  STATUS_BG[status],
                '--reveal-border': STATUS_BG[status],
                width:             '62px',
                height:            '62px',
                display:           'flex',
                justifyContent:    'center',
                alignItems:        'center',
                border:            `2px solid ${borderColor}`,
                backgroundColor:   bgColor,
                fontFamily:        "'Karla', sans-serif",
                fontWeight:        800,
                fontSize:          '2rem',
                color:             '#ffffff',
                textTransform:     'uppercase',
                userSelect:        'none',
                animationDelay:    isRevealing && hasStatus ? `${index * 250}ms` : '0ms',
            } as React.CSSProperties}
        >
            {letter}
        </div>
    )
}
