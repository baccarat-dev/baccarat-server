const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  // idle time for the strategy
  if (round < 6) {
    return;
  }
  const MOD6 = (round - 1) % 6;
  if (MOD6 === 5) {
    S.target = S.nextMove = S.reverse
      ? betsList[round - 5] === "P"
        ? "B"
        : "P"
      : betsList[round - 5];
  }
  if (round === 6) {
    return;
  }

  if (MOD6 === 0) {
    S.hasWonInCol = false;
  }

  if (S.hasWonInCol) {
    console.log("returned with ", S.nextMove);
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

  if (MOD6 % 2 === 1) {
    S.target = S.nextMove = S.reverse
      ? betsList[round - 5] === "P"
        ? "B"
        : "P"
      : betsList[round - 5];
    console.log("just set the target to ", S.target);
  }
};
