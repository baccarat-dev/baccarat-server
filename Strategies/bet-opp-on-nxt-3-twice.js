const { calcPercent, reset } = require("./common");

module.exports = function (S, Rnd, bet, bets) {
  // idle time for the strategy
  if (Rnd === 1) {
    return;
  }

  const trigger = bets.slice(Rnd - 2, Rnd);
  const TRIGGERED = trigger.every((x) => x === trigger[0]);

  if (S.activated) {
    console.log(S.count);
    const SEQ = bets.slice(Rnd - (S.count > 3 ? S.count - 3 : S.count), Rnd);
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
