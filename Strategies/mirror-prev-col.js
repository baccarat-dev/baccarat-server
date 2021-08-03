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

  if (MOD === 1) {
    // started a new column so reset S.hasWonInCol to false and skip
    S.hasWonInCol = false;
    if (R_5) {
      return;
    }
  }

  if (R_6 && MOD === 0) {
    // this will keep the next move instead of changing it to "-" on the next block when hasWonInCol==true
    return;
  }

  if (S.hasWonInCol) {
    // has already won in column so skip
    S.nextMove = "-";
    return;
  }

  const STRATEGY_WON = bet === targetBet;
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

  if (R_5 && MOD === 0) {
    // reached the final round in a column, there is no expected next move
    S.nextMove = "-";
  }

  return;

  // if (round < 6) {
  //   return;
  // }
  // if (S.nbRows === 6 && round === 6) {
  //   S.nextMove = betsList[0];
  //   return;
  // }
  // S.nextMove = betsList[round - S.nbRows];
  // S.nextMove = S.reverse ? (S.nextMove === "P" ? "B" : "P") : S.nextMove;
  // if (S.nbRows === 5 && round % 5 === 1) {
  //   return;
  // }

  // let targetBet = betsList[round - S.nbRows - 1];
  // targetBet = S.reverse ? (targetBet === "P" ? "B" : "P") : targetBet;
  // const STRATEGY_WON = bet === targetBet;

  // console.log(S.nbRows, S.name, round, targetBet);

  // if (MOD === 1) {
  //   S.hasWonInCol = false;
  //   if (S.nbRows === 5) {
  //     return;
  //   }
  // }

  // if (S.hasWonInCol) {
  //   S.nextMove = "-";
  //   return;
  // }

  // if (STRATEGY_WON) {
  //   S.hasWonInCol = true;
  //   S.nextMove = "-";
  //   reset(S);
  // } else {
  //   S.lvl++;
  //   calcPercent(S);
  // }

  // if (MOD === 0) {
  //   if (S.nbRows === 5) {
  //     S.nextMove = "-";
  //     return;
  //   }
  //   S.nextMove = betsList[round - 6];
  // }
};
