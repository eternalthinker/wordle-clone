import { RootState } from "./root_state";

export const shareResult = (state: RootState) => {
  const shareContent = getShareContent(state);

  // Mobile
  if (navigator.share) {
    navigator
      .share({
        title: "Share your result",
        text: shareContent,
      })
      .catch((e) => null);
    return { copiedToClipboard: false };
  }

  // Desktop
  navigator.clipboard.writeText(shareContent);
  return { copiedToClipboard: true };
};

const getShareContent = (state: RootState) => {
  const absentTile = state.theme === "dark" ? "⬛️" : "⬜️";
  const correctTile = "🟩";
  const misplacedTile = "🟨";

  let shareGrid = "";
  const { wordle } = state;
  for (let i = 0; i < wordle.currentInputLine; ++i) {
    const wordLine = wordle.wordLines[i];
    let shareWord = "";
    wordLine.word.forEach((letter) => {
      let tile = "";
      switch (letter.status) {
        case "absent":
          tile = absentTile;
          break;
        case "misplaced":
          tile = misplacedTile;
          break;
        case "correct":
          tile = correctTile;
          break;
      }
      shareWord = shareWord.concat(tile);
    });
    shareGrid = shareGrid.concat(shareWord + "\n");
  }

  const title = state.gameMode === "5letters" ? "Wordle(clone)" : "Wordle6";
  const finishLine = wordle.gameState === "success" ? wordle.currentInputLine : "x";
  const attempt = `${finishLine}/${wordle.wordLines.length}`;
  const url = "https://code.eternalthinker.co/wordle-clone";
  const shareContent = `${title} ${wordle.day} ${attempt}\n\n${shareGrid}\n${url}`;

  return shareContent;
};
