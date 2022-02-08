import { LocalStorage } from "../utils/local_storage";
import { guessSet5Letters } from "../utils/words_5letters";
import { guessSet6Letters } from "../utils/words_6letters";
import { getConstraints } from "./get_constraints";
import { getFinalMessage } from "./get_final_message";
import { getGuessStatus } from "./get_guess_status";
import { generateToastId } from "./get_toast_id";
import {
  RootState,
  Action,
  WordLine,
  GameState,
  createInitialState,
  getWordLength,
} from "./root_state";
import { shareResult } from "./share_result";

export const rootReducer = (state: RootState, action: Action): RootState => {
  switch (action.type) {
    case "letter_input": {
      if (state.isRevealing) {
        return state;
      }
      const wordle = state.wordle;
      if (wordle.gameState === "success" || wordle.gameState === "fail") {
        return state;
      }
      const { currentInputLine, currentInputLetter } = wordle;
      const wordLength = getWordLength(state.gameMode);
      if (currentInputLine === 6 || currentInputLetter === wordLength - 1) {
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
      if (state.isRevealing) {
        return state;
      }
      const wordle = state.wordle;
      // Game already ended
      if (wordle.gameState === "success" || wordle.gameState === "fail") {
        return state;
      }

      const { currentInputLine, currentInputLetter } = wordle;
      const wordLength = getWordLength(state.gameMode);
      // Invalid state of input to be enter
      if (currentInputLetter !== wordLength - 1) {
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
      // Same as fail (redundant)
      if (currentInputLine === 6) {
        return state;
      }

      let guessWord = "";
      wordle.wordLines[currentInputLine].word.forEach((letter) => {
        guessWord = guessWord.concat(letter.letter!);
      });

      // Word not in list
      const guessSet =
        state.gameMode === "6letters" ? guessSet6Letters : guessSet5Letters;
      if (!guessSet.has(guessWord)) {
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

      // Process guess word
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

      // Check if game has ended
      const isSuccess = guessStatus.every((status) => status === "correct");
      const isFail = currentInputLine === 5 && !isSuccess;
      let gameState: GameState = "inprogress";
      if (isSuccess) {
        gameState = "success";
      } else if (isFail) {
        gameState = "fail";
      }

      const newWordle = {
        ...wordle,
        currentInputLine: currentInputLine + 1,
        currentInputLetter: -1,
        wordLines,
        gameState,
      };

      // Persist game state
      const gameStateKey = `gameState_${state.gameMode}`;
      LocalStorage.setItem(gameStateKey, JSON.stringify(newWordle));

      return {
        ...state,
        wordle: newWordle,
        isRevealing: true,
      };
    }
    case "reveal_end": {
      const { wordle } = state;
      // Add toast for game end
      let toasts = state.toasts;
      const message = getFinalMessage(
        wordle.gameState,
        wordle.currentInputLine,
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
      const constraints = getConstraints(wordle.wordLines, state.gameMode);

      return {
        ...state,
        toasts,
        showShare: wordle.gameState !== "inprogress",
        constraints,
        isRevealing: false,
      };
    }
    case "theme_change": {
      LocalStorage.setItem("theme", action.payload.theme);
      return {
        ...state,
        theme: action.payload.theme,
      };
    }
    case "game_mode_change": {
      LocalStorage.setItem("gameMode", action.payload.gameMode);
      return {
        ...createInitialState(),
        gameMode: action.payload.gameMode,
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
