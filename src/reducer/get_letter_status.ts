import { LetterStatus } from "./root_state";

export const getLetterStatus = (
  letter: string,
  letterIndex: number,
  solution: string,
): LetterStatus => {
  if (solution.charAt(letterIndex) === letter) {
    return "correct";
  }
  if (solution.includes(letter)) {
    return "misplaced";
  }
  return "absent";
};
