const { calcPercent, reset } = require("./common");

module.exports = function (S, R, bet, bets) {
  const MOD = (R - 1) % 6;

  const STARTING_CELL = R === 1 || ((R - 1) / 3) % 3 === 0;

  if (MOD === 0 && STARTING_CELL) {
    S.nextMove = S.target = bet === "P" ? "B" : "P";
    S.activated = true;
    S.targetIdx = R - 1;
    return;
  }

  const i = S.targetIdx;
  const QUALIFIED_ROUNDS = [i + 2, i + 3, i + 7, i + 8, i + 13];

  if (S.activated && !S.hasWonInCol && QUALIFIED_ROUNDS.includes(R)) {
    const STRATEGY_WON = bet === S.target;
    if (STRATEGY_WON) {
      // strategy won, so we reset the strategy details
      S.hasWonInCol = true;
      S.nextMove = "-";
      S.activated = false;
      reset(S);
      return;
    } else {
      // strategy lost, we go up a lvl, calc %, and update maxLvl if exceeded
      S.lvl++;
      calcPercent(S);
    }
  }
};
