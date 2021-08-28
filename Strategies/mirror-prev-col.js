const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  if (round < 6) {
    return;
  }
  const R_5 = S.nbRows === 5;
  const R_6 = S.nbRows === 6;
  const MOD = round % S.nbRows;

  let targetBet = betsList[round - S.nbRows - 1];
  targetBet = S.reverse ? (targetBet === "P" ? "B" : "P") : targetBet;
  S.nextMove = betsList[round - S.nbRows];
  S.nextMove = S.reverse ? (S.nextMove === "P" ? "B" : "P") : S.nextMove;

  console.log(S);

  if (MOD === 1) {
    // started a new column so reset S.hasWonInCol to false and skip
    S.hasWonInCol = false;
    if (R_5) {
      return;
    }
  }

  const STRATEGY_WON = bet === targetBet;
  if (!S.hasWonInCol) {
    if (STRATEGY_WON) {
      // strategy won, so we reset the strategy details
      S.hasWonInCol = true;
      S.nextMove = "-";
      reset(S);
    } else {
      // strategy lost, we calc %, go up a lvl and update maxLvl if exceeded
      S.lvl++;
      calcPercent(S);
    }
  }

  if (R_6 && MOD === 0) {
    return;
  }

  if (S.hasWonInCol) {
    // has already won in column so skip
    S.nextMove = "-";
    return;
  }

  if (R_5 && MOD === 0) {
    S.nextMove = "-";
  }
};
