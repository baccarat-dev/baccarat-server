const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  // idle time for the strategy
  if (round < 6) {
    return;
  }

  const NB_ROWS = 5;

  let targetBet = betsList[round - NB_ROWS - 1];
  targetBet = S.reverse ? (targetBet === "P" ? "B" : "P") : targetBet;
  const STRATEGY_WON = bet === targetBet;
  S.nextMove = betsList[round - NB_ROWS];
  S.nextMove = S.reverse ? (S.nextMove === "P" ? "B" : "P") : S.nextMove;

  if (round % NB_ROWS === 1) {
    // started a new column so reset S.hasWonInCol to false and skip
    S.hasWonInCol = false;
    return;
  }

  if (S.hasWonInCol) {
    // has already won in column so skip
    S.nextMove = "-";
    return;
  }

  if (STRATEGY_WON) {
    // strategy won, so we reset the strategy details
    reset(S);
  } else {
    // strategy lost, we calc %, go up a lvl and update maxLvl if exceeded
    S.lvl++;
    calcPercent(S);
  }

  if (round % NB_ROWS === 0) {
    // reached the final round in a column, there is no expected next move
    S.nextMove = "-";
  }
};
