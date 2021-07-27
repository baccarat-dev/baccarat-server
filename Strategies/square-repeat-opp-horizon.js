const { calcPercent, reset } = require("./common");

module.exports = function (S, R, bet, betsList) {
  // idle time for the strategy
  if (R < 8) {
    return;
  }
  const MOD6 = (R - 1) % 6;

  if (MOD6 === 1) {
    const SQUARE = [
      betsList[R - 1],
      betsList[R - 2],
      betsList[R - 1 - 6],
      betsList[R - 2 - 6],
    ];
    S.square = SQUARE;
    S.activated = true;
    return;
  }

  if (MOD6 > 1) {
    return;
  }

  if (S.hasWonInCol) {
    return;
  }

  const STRATEGY_WON = bet === S.target;
  if (STRATEGY_WON) {
    // strategy won, so we reset the strategy details
    S.hasWonInCol = true;
    S.nextMove = "-";
    reset(S);
    return;
  } else {
    // strategy lost, we go up a lvl, calc %, and update maxLvl if exceeded
    S.lvl++;
    calcPercent(S);
  }
};
