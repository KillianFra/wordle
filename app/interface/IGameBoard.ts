import type { LetterStatus } from "~/types/types";



export interface IGameBoard  {
    statuses: LetterStatus[]
    guesses: string[]
    targetLetters: string[]
    compareWord: (guess: string, target: string) => LetterStatus[]
    checkWord: (input: string) => { success: boolean; error?: string }
    getRandomWord: () => string
}