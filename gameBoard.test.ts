import { GameBoard } from "./app/utils/gameBoard";
import { WORD_TOO_LONG, WORD_NOT_IN_LIST } from "./app/utils/constants";

// ─── compareWord ────────────────────────────────────────────────────────────

/*
GIVEN two identical words
WHEN compareWord is called with guess equal to target
THEN all letters should be marked as correct
*/
test("compareWord: should mark all letters as correct when guess equals target", () => {
    const result = GameBoard.compareWord("pomme", "pomme");
    expect(result).toEqual(["correct", "correct", "correct", "correct", "correct"]);
});

/*
GIVEN two words with no common letters
WHEN compareWord is called
THEN all letters should be marked as absent
*/
test("compareWord: should mark all letters as absent when no letters match", () => {
    const result = GameBoard.compareWord("bbbbb", "aaaaa");
    expect(result).toEqual(["absent", "absent", "absent", "absent", "absent"]);
});

/*
GIVEN two words where every guess letter appears in the target but at a different position
WHEN compareWord is called
THEN all letters should be marked as present
*/
test("compareWord: should mark all letters as present when all letters exist in target but at wrong positions", () => {
    // each letter of "abcde" exists in "bcdea" but none is at the same index
    const result = GameBoard.compareWord("abcde", "bcdea");
    expect(result).toEqual(["present", "present", "present", "present", "present"]);
});

/*
GIVEN two words with partial overlap in letters and positions
WHEN compareWord is called
THEN each letter should receive the appropriate status
*/
test("compareWord: should return mixed statuses for a partial match", () => {
    // "pomme" vs "porte": p(correct) o(correct) m(absent) m(absent) e(correct)
    const result = GameBoard.compareWord("pomme", "porte");
    expect(result).toEqual(["correct", "correct", "absent", "absent", "correct"]);
});

/*
GIVEN a guess with a letter that appears twice but only once in the target
WHEN compareWord is called
THEN only one occurrence should be credited, the extra should be marked absent
*/
test("compareWord: should not over-count duplicate guess letters beyond the occurrences in target", () => {
    const result = GameBoard.compareWord("aaxxx", "baxxx");
    expect(result).toEqual(["absent", "correct", "correct", "correct", "correct"]);
});

/*
GIVEN a guess where a letter is at the correct position AND appears elsewhere in the target
WHEN compareWord is called
THEN the correct occurrence should be marked correct, not consuming an extra present slot
*/
test("compareWord: should prioritise correct over present for the same letter", () => {
    const result = GameBoard.compareWord("axbxx", "aaxxx");
    expect(result).toEqual(["correct", "present", "absent", "correct", "correct"]);
});

// ─── checkWord ──────────────────────────────────────────────────────────────

/*
GIVEN a word longer than the maximum allowed length
WHEN checkWord is called
THEN it should return an error with WORD_TOO_LONG
*/
test("checkWord: should return an error when the word exceeds the maximum length", () => {
    const result = GameBoard.checkWord("toolongword");
    expect(result.success).toBe(false);
    expect(result.error).toBe(WORD_TOO_LONG);
});

/*
GIVEN a five-letter word that is not in the word list
WHEN checkWord is called
THEN it should return an error with WORD_NOT_IN_LIST
*/
test("checkWord: should return an error when the word is not in the word list", () => {
    const result = GameBoard.checkWord("zzzzz");
    expect(result.success).toBe(false);
    expect(result.error).toBe(WORD_NOT_IN_LIST);
});

/*
GIVEN a valid word present in the word list
WHEN checkWord is called
THEN it should return success with no error
*/
test("checkWord: should return success when the word is valid", () => {
    const result = GameBoard.checkWord("pomme");
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
});

/*
GIVEN an empty string
WHEN checkWord is called
THEN it should return an error with WORD_NOT_IN_LIST
*/
test("checkWord: should return an error when the word is empty", () => {
    const result = GameBoard.checkWord("");
    expect(result.success).toBe(false);
    expect(result.error).toBe(WORD_NOT_IN_LIST);
});
