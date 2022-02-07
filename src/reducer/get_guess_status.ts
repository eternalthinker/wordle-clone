import { LetterStatus } from "./root_state";

export const getLetterStatus = (
  letter: string,
  letterIndex: number,
  solution: string
): LetterStatus => {
  if (solution.charAt(letterIndex) === letter) {
    return "correct";
  }
  if (solution.includes(letter)) {
    return "misplaced";
  }
  return "absent";
};

export const getGuessStatus = (
  guess: string,
  solution: string
): LetterStatus[] => {
  const solutionCountMap: Record<string, number> = {};
  const guessPositionMap: Record<string, number[]> = {};
  for (let i = 0; i < guess.length; ++i) {
    const sLetter = solution[i];
    if (solutionCountMap[sLetter] == null) {
      solutionCountMap[sLetter] = 1;
    } else {
      solutionCountMap[sLetter] += 1;
    }

    const gLetter = guess[i];
    if (guessPositionMap[gLetter] == null) {
      guessPositionMap[gLetter] = [i];
    } else {
      guessPositionMap[gLetter].push(i);
    }
  }

  const result: LetterStatus[] = [];
  for (let i = 0; i < guess.length; ++i) {
    const letter = guess[i];

    if (solution.charAt(i) === letter) {
      result.push("correct");
      const sLetterCount = solutionCountMap[letter];
      const prevPositions = guessPositionMap[letter].filter((pos) => pos < i);
      // Ideally prevLetters < sLetterCount. Otherwise, some
      // guess letters have been incorrectly coloured yellow.
      if (prevPositions.length >= sLetterCount) {
        prevPositions.forEach((pos) => {
          if (result[pos] !== "correct") {
            result[pos] = "absent";
          }
        });
      }
    } else if (solution.includes(letter)) {
      const sLetterCount = solutionCountMap[letter];
      const prevPositions = guessPositionMap[letter].filter((pos) => pos < i);
      // If enough prevLetters have been coloured, do not
      // mark any more as yellow.
      if (prevPositions.length < sLetterCount) {
        result.push("misplaced");
      } else {
        result.push("absent");
      }
    } else {
      result.push("absent");
    }
  }

  return result;
};
