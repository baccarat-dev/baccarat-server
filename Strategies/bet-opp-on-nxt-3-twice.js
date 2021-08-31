const { calcPercent, reset } = require("./common");

module.exports = function (S, R, bet, bets) {
  if (R < 3) {
    return;
  }
  console.log("test");

  const trigger = bets.slice(R - 2, R);
  const TRIGGERED =
    trigger.every((x) => x === trigger[0]) &&
    (bets[R - 4] !== bets[R - 3] || bets[R - 2] !== bets[R - 3]);

  if (S.activated) {
    const SEQ = bets.slice(R - (S.count > 3 ? S.count - 3 : S.count), R);
    if (SEQ.some((x) => x === S.target)) {
      reset(S);
      S.activated = false;
      S.count = 1;
      S.nextMove = "-";
      return;
    }
    S.lvl++;
    calcPercent(S);
    if (S.count === 3) {
      S.nextMove = S.target = S.target === "P" ? "B" : "P";
    } else if (S.count === 6) {
      S.activated = false;
      S.nextMove = S.target = "-";
      S.count = 0;
      return;
    }
    S.count++;
    return;
  }

  if (TRIGGERED) {
    S.activated = true;
    S.nextMove = S.target = bet === "P" ? "B" : "P";
    S.count = 1;
    return;
  }
};
