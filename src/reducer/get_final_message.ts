import { GameState } from "./root_state";

export const getFinalMessage = (
  gameState: GameState,
  currentInputLine: number,
  solution: string
) => {
  switch (gameState) {
    case "inprogress":
      return null;
    case "fail":
      return `😥 Oops! Better luck next time. The solution is: ${solution.toUpperCase()}`;
    case "success":
      // currentInputLine after it is updated to the next line
      switch (currentInputLine) {
        case 1:
          return "🤯 Wow genius!";
        case 2:
          return "😱 Great work!";
        case 3:
          return "🤩 Nicely done";
        case 4:
          return "🎉 Good one!";
        case 5:
          return "😎 You got it!";
        case 6:
          return "😭 Close call!";
        default:
          return null;
      }
    default:
      return null;
  }
};
