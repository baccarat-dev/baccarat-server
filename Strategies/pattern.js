const { calcPercent, reset } = require("./common");

module.exports = function (S, R, bet, bets) {
  if (R < 4) {
    return;
  }

  const PATTERN_ENCOUNTERED = bets
    .slice(R - S.pattern.length, R)
    .every((c, i) => c === S.pattern[i]);

  if (!S.activated && PATTERN_ENCOUNTERED) {
    S.activated = true;
    S.targetIdx = 0;
    S.nextMove = S.targetBets[S.targetIdx];
    return;
  }

  if (S.activated) {
    const STRATEGY_WON = bet === S.targetBets[S.targetIdx];
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
    S.targetIdx++;
    S.nextMove = S.targetBets[S.targetIdx];
  }
  if (S.targetIdx === S.targetBets.length) {
    S.activated = false;
    S.targetIdx = 0;
  }
};
