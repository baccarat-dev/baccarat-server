const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  // idle time for the strategy
  if (round < 6) {
    return;
  }

  const NB_ROWS = 5;

  let targetBet = betsList[round - NB_ROWS - 1];
  targetBet = S.reverse ? (targetBet === "P" ? "B" : "P") : targetBet;
  const STRATEGY_WON = bet === targetBet;
  S.nextMove = betsList[round - NB_ROWS];
  S.nextMove = S.reverse ? (S.nextMove === "P" ? "B" : "P") : S.nextMove;

  console.log("R=" + S.reverse + "WON=" + STRATEGY_WON);

  if (round % NB_ROWS === 1) {
    console.log("started new col");
    // started a new column so reset S.hasWonInCol to false and skip
    S.hasWonInCol = false;
    return;
  }

  if (S.hasWonInCol) {
    console.log("already won");

    // has already won in column so skip
    S.nextMove = "-";
    return;
  }

  if (STRATEGY_WON) {
    console.log("just won");
    // strategy won, so we reset the strategy details
    reset(S);
  } else {
    console.log("just lost");
    // strategy lost, we calc %, go up a lvl and update maxLvl if exceeded
    S.lvl++;
    calcPercent(S);
  }

  if (round % NB_ROWS === 0) {
    console.log("bottom of the thing");
    // reached the final round in a column, there is no expected next move
    S.nextMove = "-";
  }
};
