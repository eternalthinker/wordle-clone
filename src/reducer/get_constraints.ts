import {
  Constraints,
  createInitConstraints,
  Letter,
  WordLine,
} from "./root_state";

export const getConstraints = (wordLines: WordLine[]): Constraints => {
  const constraints = createInitConstraints();
  for (let wi = 0; wi < wordLines.length; wi++) {
    const wordLine = wordLines[wi];
    if (wordLine.status === "input") {
      break;
    }
    const word = wordLine.word;
    word.forEach((letter: Letter, i) => {
      if (letter.letter == null) {
        return;
      }
      if (letter.status === "correct") {
        constraints.correctPositions[i] = letter.letter;
        constraints.includedLetters.add(letter.letter);
        constraints.excludedLetters.delete(letter.letter);
      } else if (letter.status === "misplaced") {
        constraints.incorrectPositions[i].add(letter.letter);
        constraints.includedLetters.add(letter.letter);
        constraints.excludedLetters.delete(letter.letter);
      } else if (letter.status === "absent") {
        if (constraints.includedLetters.has(letter.letter)) {
          constraints.incorrectPositions[i].add(letter.letter);
        } else {
          constraints.excludedLetters.add(letter.letter);
        }
      }
    });
  }
  return constraints;
};
