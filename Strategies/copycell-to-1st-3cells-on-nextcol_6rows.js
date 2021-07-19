const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  // idle time for the strategy
  if (round < 6) {
    return;
  }

  const MOD6 = round % 6;

  if (MOD6 === 1) {
    S.hasWonInCol = false;
  }

  const idx = round - 1 - (6 - S.row) - MOD6;
  const targetBet = S.reverse
    ? betsList[idx] === "P"
      ? "B"
      : "P"
    : betsList[idx];

  S.nextMove = MOD6 < S.row ? targetBet : "-";

  if (S.hasWonInCol) {
    S.nextMove = "-";
    return;
  }

  const STRATEGY_WON = bet === targetBet;

  if (MOD6 > S.row - 3 && MOD6 <= S.row) {
    if (STRATEGY_WON) {
      // strategy won, so we reset the strategy details
      S.hasWonInCol = true;
      S.nextMove = "-";
      reset(S);
    } else {
      // strategy lost, we go up a lvl, calc %, and update maxLvl if exceeded
      S.lvl++;
      calcPercent(S);
    }
  }
};
