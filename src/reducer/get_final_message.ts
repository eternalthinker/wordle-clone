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
      switch (currentInputLine) {
        case 0:
          return "🤯 Wow genius!";
        case 1:
          return "😱 Great work!";
        case 2:
          return "🤩 Nicely done";
        case 3:
          return "🎉 Good one!";
        case 4:
          return "😎 You got it!";
        case 5:
          return "😭 Close call!";
        default:
          return null;
      }
    default:
      return null;
  }
};
