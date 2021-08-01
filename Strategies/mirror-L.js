const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  if (round <= S.row * 4) {
    return;
  }

  let targetIdx;
  let nextIdx;

  switch (round % S.row) {
    case 1:
      S.hasWonInCol = false;
      S.cornerCellIdx = round - 1;
      S.nextMove = betsList[S.cornerCellIdx - S.row * 4];
      S.nextMove = S.reverse ? (S.nextMove === "P" ? "B" : "P") : S.nextMove;
      return;
    case 2:
      targetIdx = S.cornerCellIdx - S.row * 4;
      nextIdx = targetIdx + S.row;
      break;
    case 3:
      targetIdx = S.cornerCellIdx - S.row * 3;
      nextIdx = targetIdx + S.row;
      break;
    case 4:
      targetIdx = S.cornerCellIdx - S.row * 2;
      nextIdx = targetIdx + S.row;
      break;
    case 5:
      if (S.row === 5) {
        break;
      }
      targetIdx = S.cornerCellIdx - S.row;
      nextIdx = targetIdx + S.row;
      break;
    default:
      targetIdx = S.cornerCellIdx;
      nextIdx = "-";
      break;
  }

  const targetBet = S.reverse
    ? betsList[targetIdx] === "P"
      ? "B"
      : "P"
    : betsList[targetIdx];

  const nextBet = S.reverse
    ? betsList[nextIdx] === "P"
      ? "B"
      : "P"
    : betsList[nextIdx];

  if (S.hasWonInCol) {
    // has already won in column so skip
    S.nextMove = "-";
    return;
  }

  if (targetBet === bet) {
    // strategy won, we reset
    S.hasWonInCol = true;
    S.nextMove = "-";
    reset(S);
    return;
  } else {
    // strategy lost, we calc % and set nextMove
    S.lvl++;
    S.nextMove = round % S.row === 0 ? "-" : nextBet;
    calcPercent(S);
  }
};
