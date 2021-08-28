const { calcPercent, reset } = require("./common");

module.exports = function (S, R, bet) {
  const MOD = (R - 1) % 6;

  const STARTING_CELL = R === 1 + S.row || ((R - 1 - S.row) / 3) % 3 === 0;

  if ((MOD === S.row && STARTING_CELL) || (S.hasWonInCol && MOD === S.row)) {
    S.target = S.reverse ? bet : bet === "P" ? "B" : "P";
    S.nextMove = S.reverse ? "-" : bet;
    S.activated = true;
    S.targetIdx = R - 1;
    S.hasWonInCol = false;
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

  if (S.hasWonInCol) {
    S.nextMove = "-";
  }
};
