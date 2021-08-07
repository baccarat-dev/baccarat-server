const { calcPercent, reset } = require("./common");

module.exports = function (S, R, bet) {
  const MOD = (R - 1) % 6;

  const STARTING_CELL = R === 1 + S.row || ((R - 1 - S.row) / 3) % 3 === 0;

  if ((MOD === S.row && STARTING_CELL) || (S.hasWonInCol && MOD === S.row)) {
    S.nextMove = S.target = bet === "P" ? "B" : "P";
    S.activated = true;
    S.targetIdx = R - 1;
    S.hasWonInCol = false;
    return;
  }

  const i = S.targetIdx;
  const QUALIFIED_ROUNDS = [i + 2, i + 3, i + 7, i + 8, i + 13];
  const IS_ON_QUALIFIED_ROUND = QUALIFIED_ROUNDS.includes(R);

  if (S.activated && !S.hasWonInCol && IS_ON_QUALIFIED_ROUND) {
    const STRATEGY_WON = bet === S.target;
    if (STRATEGY_WON) {
      S.hasWonInCol = true;
      S.nextMove = "-";
      S.activated = false;
      reset(S);
      return;
    } else {
      S.lvl++;
      calcPercent(S);
    }
  }

  if (S.hasWonInCol || R >= i + 13) {
    S.nextMove = "-";
  }
};
