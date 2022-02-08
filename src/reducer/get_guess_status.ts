import { LetterStatus } from "./root_state";

export const getGuessStatus = (
  guess: string,
  solution: string
): LetterStatus[] => {
  // Contains count of each letter in the solution
  const solutionCountMap: Record<string, number> = {};
  // Contains count of correct/misplaced letters in the solution
  const guessCountMap: Record<string, number> = {};
  const result: LetterStatus[] = Array(guess.length).fill("absent");

  for (let i = 0; i < guess.length; ++i) {
    const sLetter = solution[i];
    if (solutionCountMap[sLetter] == null) {
      solutionCountMap[sLetter] = 1;
    } else {
      solutionCountMap[sLetter] += 1;
    }

    const gLetter = guess[i];

    if (sLetter === gLetter) {
      result[i] = "correct";
      guessCountMap[gLetter] = (guessCountMap[gLetter] ?? 0) + 1;
      continue;
    }
  }

  for (let i = 0; i < guess.length; ++i) {
    const letter = guess[i];

    if (result[i] === "absent" && solution.includes(letter)) {
      const sLetterCount = solutionCountMap[letter];
      const gLetterCount = guessCountMap[letter] ?? 0;
      // If enough prevLetters have been coloured, do not
      // mark any more as yellow.
      if (gLetterCount < sLetterCount) {
        result[i] = "misplaced";
        guessCountMap[letter] = (guessCountMap[letter] ?? 0) + 1;
      }
    }
  }

  return result;
};
