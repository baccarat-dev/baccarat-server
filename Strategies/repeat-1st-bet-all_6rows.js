const { calcPercent, reset } = require("./common");

module.exports = function (S, R, bet, betsList) {
  // idle time for the strategy
  const MOD6 = (R - 1) % 6;

  if (MOD6 === 0) {
    S.hasWonInCol = false;
    S.target = S.nextMove = betsList[R - 1];
    return;
  }

  const STRATEGY_WON = bet === S.target;
  if (!S.hasWonInCol) {
    if (STRATEGY_WON) {
      // strategy won, so we reset the strategy details
      S.hasWonInCol = true;
      S.nextMove = "-";
      reset(S);
    } else {
      // strategy lost, we go up a lvl, calc %, and update maxLvl if exceeded
      S.nextMove = S.target;
      S.lvl++;
      calcPercent(S);
    }
  }

  if (S.hasWonInCol || MOD6 === 5) {
    S.nextMove = "-";
  }
};
