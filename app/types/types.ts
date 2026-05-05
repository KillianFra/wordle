export type LetterStatus = "correct" | "present" | "absent" | "empty";


export type WordleError = {
    success: boolean,
    error?: string
}