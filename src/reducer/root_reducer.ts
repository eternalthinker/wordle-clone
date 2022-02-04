import { LocalStorage } from "../utils/local_storage";
import { wordList } from "../utils/wordlist";
import { getConstraints } from "./get_constraints";
import { getLetterStatus } from "./get_letter_status";
import { getSuggestedWords } from "./get_suggested_words";
import {
  RootState,
  Action,
  initWord,
  LetterStatus,
  WordLine,
} from "./root_state";

const getNextStatus = (
  status: Exclude<LetterStatus, "input">
): Exclude<LetterStatus, "input"> => {
  switch (status) {
    case "absent":
      return "misplaced";
    case "misplaced":
      return "correct";
    case "correct":
      return "absent";
    default:
      throw new Error(`Invalid Letter status: ${status}`);
  }
};

export const rootReducer = (state: RootState, action: Action): RootState => {
  switch (action.type) {
    case "letter_status_change": {
      const { lineIndex, letterIndex } = action.payload;
      const wordle = state.wordle;
      if (wordle.currentInputLine === 6 || wordle.currentInputLetter === 4) {
        return state;
      }
      const currentWordLine = wordle.wordLines[lineIndex];
      const newStatus = getNextStatus(
        currentWordLine.word[letterIndex].status as Exclude<
          LetterStatus,
          "input"
        >
      );

      const wordLines = [
        ...wordle.wordLines.slice(0, lineIndex),
        {
          ...currentWordLine,
          word: [
            ...currentWordLine.word.slice(0, letterIndex),
            {
              ...currentWordLine.word[letterIndex],
              status: newStatus,
            },
            ...currentWordLine.word.slice(letterIndex + 1),
          ],
        },
        ...wordle.wordLines.slice(lineIndex + 1),
      ];

      const constraints = getConstraints(wordLines);

      const suggestedWords = getSuggestedWords(
        wordList,
        constraints,
        wordle.currentInputLine
      );

      return {
        ...state,
        wordle: {
          ...wordle,
          wordLines,
        },
        constraints,
        suggestedWords,
      };
    }
    case "letter_input": {
      const wordle = state.wordle;
      if (wordle.currentInputLine === 6 || wordle.currentInputLetter === 4) {
        return state;
      }
      const letterIndex = wordle.currentInputLetter + 1;
      const wordIndex = wordle.currentInputLine;
      const currentWordLine = wordle.wordLines[wordIndex];

      return {
        ...state,
        wordle: {
          ...wordle,
          currentInputLetter: letterIndex,
          wordLines: [
            ...wordle.wordLines.slice(0, wordIndex),
            {
              ...currentWordLine,
              word: [
                ...currentWordLine.word.slice(0, letterIndex),
                {
                  ...currentWordLine.word[letterIndex],
                  letter: action.payload.letter,
                },
                ...currentWordLine.word.slice(letterIndex + 1),
              ],
            },
          ],
        },
      };
    }
    case "letter_delete": {
      const wordle = state.wordle;
      const { currentInputLine, currentInputLetter } = wordle;
      if (currentInputLine === 6 || currentInputLetter === -1) {
        return state;
      }
      const currentWordLine = wordle.wordLines[currentInputLine];

      return {
        ...state,
        wordle: {
          ...wordle,
          currentInputLetter: currentInputLetter - 1,
          wordLines: [
            ...wordle.wordLines.slice(0, currentInputLine),
            {
              ...currentWordLine,
              word: [
                ...currentWordLine.word.slice(0, currentInputLetter),
                {
                  ...currentWordLine.word[currentInputLetter],
                  letter: undefined,
                },
                ...currentWordLine.word.slice(currentInputLetter + 1),
              ],
            },
          ],
        },
      };
    }
    case "word_enter": {
      const wordle = state.wordle;
      const { currentInputLine, currentInputLetter } = wordle;
      if (currentInputLine === 6 || currentInputLetter !== 4) {
        return state;
      }

      const wordLines: WordLine[] = [
        ...wordle.wordLines.slice(0, currentInputLine),
        {
          status: "completed",
          word: wordle.wordLines[currentInputLine].word.map((letter, i) => ({
            ...letter,
            status: getLetterStatus(letter.letter!, i, state.constraints),
          })),
        },
        ...(currentInputLine === 5 ? [] : [initWord]),
      ];

      const constraints = getConstraints(wordLines);

      const suggestedWords = getSuggestedWords(
        wordList,
        constraints,
        wordle.currentInputLine
      );

      return {
        ...state,
        wordle: {
          ...wordle,
          currentInputLine: currentInputLine + 1,
          currentInputLetter: -1,
          wordLines,
        },
        constraints,
        suggestedWords,
      };
    }
    case "theme_change": {
      LocalStorage.setItem("theme", action.payload.theme);
      return {
        ...state,
        theme: action.payload.theme,
      };
    }
    default: {
      return state;
    }
  }
};
