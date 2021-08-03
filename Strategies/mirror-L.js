const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  if (S.nbRows === 5 && round < 16) {
    return;
  } else if (S.nbRows === 6 && round < 25) {
    return;
  }

  let targetIdx;
  let nextIdx;

  const R_5 = S.nbRows === 5;
  let OFFSET = 0;
  switch (round % S.nbRows) {
    case 1:
      S.hasWonInCol = false;
      S.cornerCellIdx = round - 1;
      OFFSET = R_5 ? 5 * 3 : 6 * 4;
      S.nextMove = betsList[S.cornerCellIdx - OFFSET];
      S.nextMove = S.reverse ? (S.nextMove === "P" ? "B" : "P") : S.nextMove;
      return;
    case 2:
      OFFSET = R_5 ? 5 * 3 : 6 * 4;
      targetIdx = S.cornerCellIdx - OFFSET;
      nextIdx = targetIdx + S.nbRows;
      break;
    case 3:
      OFFSET = R_5 ? 5 * 2 : 6 * 3;
      targetIdx = S.cornerCellIdx - OFFSET;
      nextIdx = targetIdx + S.nbRows;
      break;
    case 4:
      OFFSET = R_5 ? 5 : 6 * 2;
      targetIdx = S.cornerCellIdx - OFFSET;
      nextIdx = targetIdx + S.nbRows;
      break;
    case 5:
      targetIdx = S.cornerCellIdx - S.nbRows;
      nextIdx = targetIdx + S.nbRows;
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
    S.nextMove = round % S.nbRows === 0 ? "-" : nextBet;
    calcPercent(S);
  }
};
