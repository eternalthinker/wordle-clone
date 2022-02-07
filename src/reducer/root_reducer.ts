import { LocalStorage } from "../utils/local_storage";
import { guessSet5Letters } from "../utils/words_5letters";
import { getConstraints } from "./get_constraints";
import { getFinalMessage } from "./get_final_message";
import { getGuessStatus } from "./get_guess_status";
import { generateToastId } from "./get_toast_id";
import { RootState, Action, WordLine, GameState } from "./root_state";
import { shareResult } from "./share_result";

export const rootReducer = (state: RootState, action: Action): RootState => {
  switch (action.type) {
    case "letter_input": {
      const wordle = state.wordle;
      if (wordle.gameState === "success" || wordle.gameState === "fail") {
        return state;
      }
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
            ...wordle.wordLines.slice(currentInputLine + 1),
          ],
        },
      };
    }
    case "letter_delete": {
      const wordle = state.wordle;
      if (wordle.gameState === "success" || wordle.gameState === "fail") {
        return state;
      }
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
            ...wordle.wordLines.slice(currentInputLine + 1),
          ],
        },
      };
    }
    case "word_enter": {
      const wordle = state.wordle;
      if (wordle.gameState === "success" || wordle.gameState === "fail") {
        return state;
      }
      const { currentInputLine, currentInputLetter } = wordle;
      if (currentInputLetter !== 4) {
        return {
          ...state,
          toasts: [
            {
              id: generateToastId(),
              content: "Not enough letters",
            },
            ...state.toasts,
          ],
        };
      }
      // same as fail
      if (currentInputLine === 6) {
        return state;
      }
      let guessWord = "";
      wordle.wordLines[currentInputLine].word.forEach((letter) => {
        guessWord = guessWord.concat(letter.letter!);
      });
      if (!guessSet5Letters.has(guessWord)) {
        return {
          ...state,
          toasts: [
            {
              id: generateToastId(),
              content: "This word is not present in the word list!",
            },
            ...state.toasts,
          ],
        };
      }

      const guessStatus = getGuessStatus(guessWord, state.wordle.solution);
      const word = wordle.wordLines[currentInputLine].word.map((letter, i) => ({
        ...letter,
        status: guessStatus[i],
      }));
      const wordLines: WordLine[] = [
        ...wordle.wordLines.slice(0, currentInputLine),
        {
          status: "completed",
          word,
        },
        ...wordle.wordLines.slice(currentInputLine + 1),
      ];

      const isSuccess = guessStatus.every((status) => status === "correct");
      const isFail = currentInputLine === 5 && !isSuccess;
      let gameState: GameState = "inprogress";
      if (isSuccess) {
        gameState = "success";
      } else if (isFail) {
        gameState = "fail";
      }

      let toasts = state.toasts;
      const message = getFinalMessage(
        gameState,
        currentInputLine,
        wordle.solution
      );
      if (message != null) {
        toasts = [
          {
            id: generateToastId(),
            content: message,
            duration: 3000,
          },
          ...toasts,
        ];
      }

      const constraints = getConstraints(wordLines);

      return {
        ...state,
        wordle: {
          ...wordle,
          currentInputLine: currentInputLine + 1,
          currentInputLetter: -1,
          wordLines,
          gameState,
        },
        constraints,
        toasts,
        showShare: gameState !== "inprogress",
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
      const newToasts = toasts.filter(
        (toast) => toast.id !== action.payload.id
      );
      return {
        ...state,
        toasts: newToasts,
      };
    }
    case "show_share": {
      return {
        ...state,
        showShare: action.payload.status,
      };
    }
    case "share_result": {
      const { copiedToClipboard } = shareResult(state);
      let toasts = state.toasts;
      if (copiedToClipboard) {
        toasts = [
          {
            id: generateToastId(),
            content: "Copied to clipboard!",
          },
          ...toasts,
        ];
      }
      return {
        ...state,
        toasts,
      };
    }
    default: {
      return state;
    }
  }
};
