import { LocalStorage } from "../utils/local_storage";
import { guessSet5Letters } from "../utils/words_5letters";
import { getConstraints } from "./get_constraints";
import { getLetterStatus } from "./get_letter_status";
import {
  RootState,
  Action,
  WordLine,
} from "./root_state";

export const rootReducer = (state: RootState, action: Action): RootState => {
  switch (action.type) {
    case "letter_input": {
      const wordle = state.wordle;
      const { currentInputLine, currentInputLetter } = wordle;
      if (currentInputLine === 6 || currentInputLetter === 4) {
        return state;
      }
      const letterIndex = currentInputLetter + 1;
      const currentWordLine = wordle.wordLines[currentInputLine];

      return {
        ...state,
        wordle: {
          ...wordle,
          currentInputLetter: letterIndex,
          wordLines: [
            ...wordle.wordLines.slice(0, currentInputLine),
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
            ...wordle.wordLines.slice(currentInputLine+1),
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
            ...wordle.wordLines.slice(currentInputLine+1),
          ],
        },
      };
    }
    case "word_enter": {
      const wordle = state.wordle;
      const { currentInputLine, currentInputLetter } = wordle;
      if (currentInputLetter !== 4) {
        return {
          ...state,
          toasts: [
            {
              id: Math.random().toString(36).slice(2, 9),
              content: "Not enough letters",
            },
            ...state.toasts,
          ]
        }
      }
      if (currentInputLine === 6) {
        return state;
      }
      let guessWord = "";
      wordle.wordLines[currentInputLine].word.forEach(letter => {
        guessWord = guessWord.concat(letter.letter!);
      })
      if (!guessSet5Letters.has(guessWord)) {
        return {
          ...state,
          toasts: [
            {
              id: Math.random().toString(36).slice(2, 9),
              content: "This word is not present in the word list!",
            },
            ...state.toasts,
          ]
        }
      }

      const wordLines: WordLine[] = [
        ...wordle.wordLines.slice(0, currentInputLine),
        {
          status: "completed",
          word: wordle.wordLines[currentInputLine].word.map((letter, i) => ({
            ...letter,
            status: getLetterStatus(letter.letter!, i, state.wordle.solution),
          })),
        },
        ...wordle.wordLines.slice(currentInputLine+1),
      ];

      const constraints = getConstraints(wordLines);

      return {
        ...state,
        wordle: {
          ...wordle,
          currentInputLine: currentInputLine + 1,
          currentInputLetter: -1,
          wordLines,
        },
        constraints,
      };
    }
    case "theme_change": {
      LocalStorage.setItem("theme", action.payload.theme);
      return {
        ...state,
        theme: action.payload.theme,
      };
    }
    case "toast_destroy": {
      const toasts = state.toasts;
      const newToasts = toasts.filter(toast => toast.id !== action.payload.id)
      return {
        ...state,
        toasts: newToasts,
      }
    }
    default: {
      return state;
    }
  }
};
