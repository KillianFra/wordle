import { MAX_WORD_LENGTH, WORDS_LIST, WORD_TOO_LONG, WORD_NOT_IN_LIST } from "./constants";

export function isWordValid(word: string): { success: boolean; error?: string } {
    if (word.length > MAX_WORD_LENGTH) {
        return { success: false, error: WORD_TOO_LONG };
    }
    if (!WORDS_LIST.includes(word)) {
        return { success: false, error: WORD_NOT_IN_LIST };
    }
    return { success: true };
}

export function getRandomWord(): string {
    return WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)]
}