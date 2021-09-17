const { calcPercent, reset } = require("./common");

module.exports = function (S, R, bet) {
  const MOD = (R - 1) % 6;

  if (MOD === 0) {
    S.hasWonInCol = false;
  }

  const STARTING_CELL = R === 1 + S.row || (R - 1 - S.row) % 6 === 0;

  if (!S.activated && !S.hasWonInCol && MOD === S.row && STARTING_CELL) {
    const antiBet = bet === "P" ? "B" : "P";
    S.target = S.reverse ? bet : antiBet;
    S.nextMove = S.reverse ? "-" : antiBet;
    S.activated = true;
    S.targetIdx = R - 1;
    S.hasWonInCol = false;
    delete S.history;
    return;
  }

  const idx = S.targetIdx;

  const QUALIFIED_ROUNDS_REGULAR = [
    idx + 2,
    idx + 3,
    idx + 7,
    idx + 8,
    idx + 13,
  ];
  const QUALIFIED_ROUNDS_REVERSE = [
    idx + 6,
    idx + 7,
    idx + 11,
    idx + 12,
    idx + 13,
  ];

  const NEXTBET_ROUNDS_REGULAR = QUALIFIED_ROUNDS_REGULAR.map((x) => x - 1);
  const NEXTBET_ROUNDS_REVERSE = QUALIFIED_ROUNDS_REVERSE.map((x) => x - 1);

  const QUALIFIED_ROUNDS = S.reverse
    ? QUALIFIED_ROUNDS_REVERSE
    : QUALIFIED_ROUNDS_REGULAR;
  const IS_ON_QUALIFIED_ROUND = QUALIFIED_ROUNDS.includes(R);

  if (S.activated && !S.hasWonInCol && IS_ON_QUALIFIED_ROUND) {
    const STRATEGY_WON = bet === S.target;
    if (STRATEGY_WON) {
      reset(S);
      S.hasWonInCol = true;
      S.nextMove = "-";
      S.activated = false;
      return;
    } else {
      S.lvl++;
      calcPercent(S);
    }
  }

  if (S.activated) {
    if (!S.reverse) {
      if (NEXTBET_ROUNDS_REGULAR.includes(R)) {
        S.nextMove = S.target;
      } else {
        S.nextMove = "-";
      }
    } else if (S.reverse) {
      if (NEXTBET_ROUNDS_REVERSE.includes(R)) {
        S.nextMove = S.target;
      } else {
        S.nextMove = "-";
      }
    }
  }

  if (S.hasWonInCol) {
    S.nextMove = "-";
  }
  if (QUALIFIED_ROUNDS_REGULAR[4] === R || R === QUALIFIED_ROUNDS_REVERSE[4]) {
    S.activated = false;
  }
};
