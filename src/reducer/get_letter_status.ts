import { Constraints, LetterStatus } from "./root_state";

export const getLetterStatus = (
  letter: string,
  letterIndex: number,
  constraints: Constraints
): LetterStatus => {
  if (constraints.incorrectPositions[letterIndex].has(letter)) {
    return "misplaced";
  }
  if (constraints.correctPositions[letterIndex] === letter) {
    return "correct";
  }
  if (constraints.includedLetters.has(letter)) {
    return "misplaced";
  }
  return "absent";
};
