const { calcPercent, reset } = require("./common");

module.exports = function (S, round, bet, betsList) {
  // idle time for the strategy
  if (round < 6) {
    return;
  }

  const NB_ROWS = 5;

  const betToCompare = betsList[round - NB_ROWS - 1];
  S.nextMove = betsList[round - NB_ROWS];

  if (round % NB_ROWS === 1) {
    // started a new column so reset S.hasWonInCol to false and skip
    S.hasWonInCol = false;
    return;
  }

  if (S.hasWonInCol) {
    // has already won in column so skip
    return;
  }

  if (betToCompare === bet) {
    // strategy won, so we reset the strategy details
    reset(S);
  } else {
    // strategy lost, we calc %, go up a lvl and update maxLvl if exceeded
    S.lvl++;
    S.maxLvl = S.maxLvl < S.lvl ? S.lvl : S.maxLvl;
    calcPercent(S);
  }

  if (round % NB_ROWS === 0) {
    // reached the final round in a column, there is no expected next move
    S.nextMove = "-";
  }

  console.log(`round: ${round}, bet: ${bet}, betTo: ${betToCompare}`);

  //console.log("Line 42:", S);
};
