const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  // idle time for the strategy
  const ACTIVE = round > 3 + S.row;

  const MOD6 = (round - 1) % 6;

  if (MOD6 === 0) {
    S.hasWonInCol = false;
  }

  if (MOD6 === S.row - 1) {
    S.target = betsList[round - 1];
    S.target = S.reverse ? (S.target === "P" ? "B" : "P") : S.target;
  }

  const STRATEGY_WON = bet === S.target;
  if (ACTIVE && !S.hasWonInCol && MOD6 >= S.row - 3 && MOD6 < S.row) {
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
  } else {
    S.nextMove = "-";
  }

  if (S.row - 3 === round % 6) {
    S.nextMove = S.target;
  }
};
