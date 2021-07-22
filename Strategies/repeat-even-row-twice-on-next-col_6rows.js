const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  // idle time for the strategy
  if (round < 6) {
    return;
  }
  const MOD6 = (round - 1) % 6;
  if (MOD6 === 5) setTarget(S, round, betsList);
  if (round === 6) {
    return;
  }

  if (MOD6 === 0) {
    S.hasWonInCol = false;
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
  } else {
    // strategy lost, we go up a lvl, calc %, and update maxLvl if exceeded
    S.lvl++;
    calcPercent(S);
  }

  if (MOD6 % 2 === 1) setTarget(S, round, betsList);
};

function setTarget(S, round, betsList) {
  S.target = S.nextMove = S.reverse
    ? betsList[round - 5] === "P"
      ? "B"
      : "P"
    : betsList[round - 5];
}
