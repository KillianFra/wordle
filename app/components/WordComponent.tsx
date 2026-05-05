import { LetterComponent } from "./LetterComponent"
import type { LetterStatus } from "~/types/types"
import { MAX_WORD_LENGTH } from "~/utils/constants"

type WordComponentProps = {
    word: string
    statuses?: LetterStatus[]
    isRevealing?: boolean
    shake?: boolean
}

export const WordComponent = ({ word, statuses, isRevealing, shake }: WordComponentProps) => {
    const cells = Array(MAX_WORD_LENGTH)
        .fill("")
        .map((_, i) => word[i] ?? "")

    return (
        <div
            className={shake ? 'row-shake' : ''}
            style={{ display: "flex", gap: "5px", perspective: "300px" }}
        >
            {cells.map((letter, i) => (
                <LetterComponent
                    key={i}
                    letter={letter}
                    status={statuses ? statuses[i] : "empty"}
                    index={i}
                    isRevealing={isRevealing}
                    isJustTyped={!statuses && i === word.length - 1}
                />
            ))}
        </div>
    )
}
