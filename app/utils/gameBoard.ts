import type { LetterStatus, WordleError } from "~/types/types";
import { MAX_WORD_LENGTH, WORD_NOT_IN_LIST, WORD_TOO_LONG, WORDS_LIST } from "./constants";
import type { IGameBoard } from "~/interface/IGameBoard";


export const GameBoard: IGameBoard = {
    statuses: [],
    guesses: [],
    targetLetters: [],
    compareWord: (guess: string, target: string): LetterStatus[] => {
        const statuses: LetterStatus[] = Array(guess.length).fill("absent");
        const targetLetters = target.split("");

        guess.split("").forEach((letter, i) => {
            if (letter === targetLetters[i]) {
                statuses[i] = "correct";
                targetLetters[i] = "";
            }
        });

        guess.split("").forEach((letter, i) => {
            if (statuses[i] === "correct") return;
            const targetIndex = targetLetters.indexOf(letter);
            if (targetIndex !== -1) {
                statuses[i] = "present";
                targetLetters[targetIndex] = "";
            }
        });
        return statuses;
    },
    checkWord: (input: string): WordleError => {
        if (input.length > MAX_WORD_LENGTH) {
            return { success: false, error: WORD_TOO_LONG };
        }
        if (!WORDS_LIST.includes(input)) {
            return { success: false, error: WORD_NOT_IN_LIST };
        }
        return { success: true };
    },
    getRandomWord: (): string => {
        const word = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)]
        console.log("Selected target word:", word) // For debugging purposes, can be removed in production
        return word
    }
};