const { calcPercent, reset } = require("./common");

module.exports = function (S, R, bet, betsList) {
  // idle time for the strategy

  const MOD6 = (R - 1) % 6;

  if (MOD6 === 0) {
    S.activated = false;
    S.hasWonInCol = false;
    S.target = betsList[R - 1];
    return;
  }

  const WON = S.target === bet;
  if (MOD6 === 1) {
    if (WON) {
      S.activated = true;
    }
    return;
  }

  if (MOD6 === 2) {
    if (WON) {
      S.activated = true;
    }
    return;
  }

  if (MOD6 >= 3) {
    if (!S.activated) {
      return;
    } else {
      if (MOD6 === 3) {
        S.target = S.nextMove = betsList[R - 1];
        return;
      }
      if (WON) {
        S.hasWonInCol = true;
        S.nextMove = "-";
        reset(S);
        return;
      } else {
        S.nextMove = S.target;
        S.lvl++;
        calcPercent(S);
      }
    }
  }

  if (MOD6 === 5) {
    S.nextMove = "-";
  }
};
