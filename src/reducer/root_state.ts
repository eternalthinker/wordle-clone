import { LocalStorage } from "../utils/local_storage";
import { solutionSet5Letters } from "../utils/words_5letters";

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

export type RootState = {
  wordle: {
    wordLines: WordLine[];
    currentInputLine: number;
    currentInputLetter: number;
    gameState: GameState;
    solution: string,
  };
  constraints: Constraints,
  gameMode: GameMode,
  theme: Theme;
};

export const MAX_SUGGESTED_WORDS = 10;

export const createInitWord = ():WordLine => ({
  word: new Array(5).fill({ letter: undefined, status: "input" }),
  status: "input",
});

export const createInitConstraints = () => ({
  excludedLetters: new Set<string>(),
  includedLetters: new Set<string>(),
  incorrectPositions: Array(5)
    .fill(null)
    .map((_) => new Set<string>()),
  correctPositions: Array(5).fill(undefined),
});

const getDailySolution = (mode: GameMode) => {
  const wordle5LettersStart = new Date('June 19, 2021');
  const today = new Date();
  const diffDays = Math.floor(Math.abs(today.getTime() - wordle5LettersStart.getTime()) / (1000 * 3600 * 24))
  return solutionSet5Letters[diffDays % solutionSet5Letters.length];
}

export const createInitialState = (): RootState => {
  // Theme
  const preferDarkTheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const storedTheme: Theme | null = LocalStorage.getItem("theme") as Theme;
  const shouldSetDarkTheme = storedTheme != null ? storedTheme === "dark" : preferDarkTheme;
  const theme = shouldSetDarkTheme ? "dark" : "light";
  LocalStorage.setItem("theme", theme);

  // Game mode
  const gameMode: GameMode = "5letters";

  return {
    wordle: {
      wordLines: Array(6).fill(null).map(_ => createInitWord()),
      currentInputLine: 0,
      currentInputLetter: -1,
      gameState: "inprogress",
      solution: getDailySolution(gameMode),
    },
    constraints: createInitConstraints(),
    gameMode,
    theme,
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
    };
