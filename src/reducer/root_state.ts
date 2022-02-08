import { ToastOptions } from "../base/toast/toast";
import { LocalStorage } from "../utils/local_storage";
import { solutionList5Letters } from "../utils/words_5letters";
import { solutionList6Letters } from "../utils/words_6letters";
import { getConstraints } from "./get_constraints";

export type LetterStatus = "correct" | "misplaced" | "absent" | "input";

export type Letter = {
  letter?: string;
  status: LetterStatus;
};

export type Word = Letter[];

export type WordLineStatus = "completed" | "input";

export type WordLine = {
  word: Word;
  status: WordLineStatus;
};

export type Constraints = {
  excludedLetters: Set<string>;
  includedLetters: Set<string>;
  incorrectPositions: Set<string>[];
  correctPositions: (string | undefined)[];
};

export type GameState = "inprogress" | "success" | "fail";

export type GameMode = "5letters" | "6letters";

export type Theme = "light" | "dark" | "adaptive";

export type Wordle = {
  wordLines: WordLine[];
  currentInputLine: number;
  currentInputLetter: number;
  gameState: GameState;
  day: number;
  solution: string;
};

export type RootState = {
  wordle: Wordle;
  constraints: Constraints;
  gameMode: GameMode;
  theme: Theme;
  toasts: ToastOptions[];
  showShare: boolean;
};

export const MAX_SUGGESTED_WORDS = 10;

export const createInitWord = (wordLength: number): WordLine => ({
  word: new Array(wordLength).fill({ letter: undefined, status: "input" }),
  status: "input",
});

export const createInitConstraints = (gameMode: GameMode) => {
  const wordLength = getWordLength(gameMode);
  return {
    excludedLetters: new Set<string>(),
    includedLetters: new Set<string>(),
    incorrectPositions: Array(wordLength)
      .fill(null)
      .map((_) => new Set<string>()),
    correctPositions: Array(wordLength).fill(undefined),
  };
};

const getDailySolution = (mode: GameMode) => {
  const solutionList =
    mode === "6letters" ? solutionList6Letters : solutionList5Letters;
  const wordleStartDate =
    mode === "6letters"
      ? new Date("February 8, 2022")
      : new Date("June 19, 2021");
  const today = new Date();
  const diffDays = Math.floor(
    Math.abs(today.getTime() - wordleStartDate.getTime()) / (1000 * 3600 * 24)
  );
  return {
    solution: solutionList[diffDays % solutionList.length],
    day: diffDays,
  };
};

export const getWordLength = (gameMode: GameMode) => {
  if (gameMode === "5letters") {
    return 5;
  }
  return 6;
};

const createInitWordle = (
  gameMode: GameMode,
  day: number,
  solution: string
): Wordle => {
  const wordLen = getWordLength(gameMode);
  return {
    wordLines: Array(6)
      .fill(null)
      .map((_) => createInitWord(wordLen)),
    currentInputLine: 0,
    currentInputLetter: -1,
    gameState: "inprogress",
    day,
    solution,
  };
};

export const createInitialState = (): RootState => {
  // Theme
  const preferDarkTheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const storedTheme: Theme | null = LocalStorage.getItem("theme") as Theme;
  const shouldSetDarkTheme =
    storedTheme != null ? storedTheme === "dark" : preferDarkTheme;
  const theme = shouldSetDarkTheme ? "dark" : "light";
  LocalStorage.setItem("theme", theme);

  // Game mode
  const storedGameMode: GameMode | null = LocalStorage.getItem(
    "gameMode"
  ) as GameMode;
  const gameMode = storedGameMode ?? "6letters";
  LocalStorage.setItem("gameMode", gameMode);

  // Persisted game state
  const gameStateKey = `gameState_${gameMode}`;
  const storedWordleStr = LocalStorage.getItem(gameStateKey);
  let storedWordle: Wordle | undefined;
  if (storedWordleStr != null) {
    storedWordle = JSON.parse(storedWordleStr) as Wordle;
  }

  const { solution, day } = getDailySolution(gameMode);

  // Persisted game state is from an older day
  if (storedWordle?.day !== day) {
    storedWordle = undefined;
    LocalStorage.removeItem(gameStateKey);
  }

  return {
    wordle: storedWordle ?? createInitWordle(gameMode, day, solution),
    constraints: storedWordle
      ? getConstraints(storedWordle.wordLines, gameMode)
      : createInitConstraints(gameMode),
    gameMode,
    theme,
    toasts: [],
    showShare: false,
  };
};

export type Action =
  | {
      type: "letter_input";
      payload: {
        letter: string;
      };
    }
  | {
      type: "letter_delete";
    }
  | {
      type: "word_enter";
    }
  | {
      type: "theme_change";
      payload: {
        theme: Theme;
      };
    }
  | {
      type: "game_mode_change";
      payload: {
        gameMode: GameMode;
      };
    }
  | {
      type: "toast_destroy";
      payload: {
        id: string;
      };
    }
  | {
      type: "share_result";
    }
  | {
      type: "show_share";
      payload: {
        status: boolean;
      };
    };
