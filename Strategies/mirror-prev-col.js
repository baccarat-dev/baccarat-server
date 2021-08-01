const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  if (round < 6) {
    return;
  }
  if (S.row === round && round === 6) {
    S.nextMove = betsList[0];
    return;
  }

  let targetBet = betsList[round - S.row - 1];
  targetBet = S.reverse ? (targetBet === "P" ? "B" : "P") : targetBet;
  const STRATEGY_WON = bet === targetBet;
  S.nextMove = betsList[round - S.row];
  S.nextMove = S.reverse ? (S.nextMove === "P" ? "B" : "P") : S.nextMove;

  if (round % S.row === 1) {
    S.hasWonInCol = false;
    if (S.row === 5) {
      return;
    }
  }

  if (S.hasWonInCol) {
    S.nextMove = "-";
    return;
  }

  if (STRATEGY_WON) {
    S.hasWonInCol = true;
    S.nextMove = "-";
    reset(S);
  } else {
    S.lvl++;
    calcPercent(S);
  }

  if (round % S.row === 0) {
    if (S.row === 5) {
      S.nextMove = "-";
      return;
    }
    S.nextMove = betsList[round - 6];
  }
};
