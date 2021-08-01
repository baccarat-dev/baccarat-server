const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  if (round < 6) {
    return;
  }
  const MOD6 = (round - 1) % 6;

  if (MOD6 === 0) {
    S.hasWonInCol = false;
  }

  if (S.hasWonInCol) {
    if (MOD6 === 5) {
      setTarget(S, round, betsList);
      return;
    }
    S.nextMove = "-";
    return;
  }

  if (MOD6 === 0) {
    S.hasWonInCol = false;
  }

  if (round === 6) {
    setTarget(S, round, betsList);
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

  const ON_EVEN_ROW = round % 2 === 0;
  if (ON_EVEN_ROW) setTarget(S, round, betsList);
};

function setTarget(S, round, betsList) {
  S.target = S.nextMove = S.reverse
    ? betsList[round - 5] === "P"
      ? "B"
      : "P"
    : betsList[round - 5];
}
