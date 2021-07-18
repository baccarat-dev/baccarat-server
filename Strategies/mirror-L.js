const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  const NB_ROWS = 5;
  if (round < 16) {
    return;
  }

  let targetIdx;
  let nextIdx;

  switch (round % NB_ROWS) {
    case 1:
      S.hasWonInCol = false;
      S.cornerCellIdx = round - 1;
      S.nextMove = betsList[S.cornerCellIdx - 15];
      S.nextMove = S.reverse ? (S.nextMove === "P" ? "B" : "P") : S.nextMove;
      return;
    case 2:
      targetIdx = S.cornerCellIdx - 15;
      nextIdx = targetIdx + NB_ROWS;
      break;
    case 3:
      targetIdx = S.cornerCellIdx - 10;
      nextIdx = targetIdx + NB_ROWS;
      break;
    case 4:
      targetIdx = S.cornerCellIdx - 5;
      nextIdx = targetIdx + NB_ROWS;
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
    reset(S);
    return;
  } else {
    // strategy lost, we calc % and set nextMove
    S.lvl++;
    S.nextMove = round % NB_ROWS === 0 ? "-" : nextBet;
    calcPercent(S);
  }
};
