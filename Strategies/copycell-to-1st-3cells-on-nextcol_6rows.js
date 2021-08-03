const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  const ACTIVE = round > 3 + S.nbRows;

  const MOD6 = (round - 1) % 6;

  if (MOD6 === 0) {
    S.hasWonInCol = false;
  }

  const STRATEGY_WON = bet === S.target;
  if (ACTIVE && !S.hasWonInCol && MOD6 >= S.nbRows - 3 && MOD6 < S.nbRows) {
    if (STRATEGY_WON) {
      // strategy won, so we reset the strategy details
      S.hasWonInCol = true;
      S.nextMove = "-";
      reset(S);
    } else {
      // strategy lost, we go up a lvl, calc %, and update maxLvl if exceeded
      S.nextMove = S.target;
      S.lvl++;
      calcPercent(S);
    }
  } else {
    S.nextMove = "-";
  }

  // sets the next target and changes the nextmove to "-" when reaching the target row
  if (MOD6 === S.nbRows - 1) {
    S.target = betsList[round - 1];
    S.nextMove = "-";
  }

  // sets the next move just before starting the 1st cell
  if (round > 5 && S.nbRows - 3 === round % 6) {
    S.nextMove = S.target;
  }
};
