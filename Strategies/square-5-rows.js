const { calcPercent, reset, okurrs } = require("./common");

module.exports = function (S, round, bet, betsList) {
  // idle time for the strategy
  if (round < 6) {
    return;
  }

  const NB_ROWS = 5;

  // -------- Store the values of 3 corners of the square in an array
  const targetBetArr = [],
    nextBetArr = [];
  const idx = round - 1;
  targetBetArr.push(
    betsList[idx - 1],
    betsList[idx - 5],
    betsList[idx - 1 - 5]
  );
  nextBetArr.push(betsList[idx], betsList[idx - 5], betsList[idx + 1 - 5]);
  // ------------------------

  // -------- Set the nextMove. When all values the same set to "-"
  if (nextBetArr.every((bet) => bet === nextBetArr[0])) {
    S.nextMove = "-";
  } else {
    S.nextMove = okurrs("P", nextBetArr) > okurrs("B", nextBetArr) ? "P" : "B";
    S.nextMove = S.reverse ? (S.nextMove === "P" ? "B" : "P") : S.nextMove;
  }
  // ----------------------

  if (round % NB_ROWS === 1) {
    // 1st row. nextMove already set above so just skip
    return;
  } else if (round % NB_ROWS === 0) {
    // end row. % is calculated but no next move
    S.nextMove = "-";
  }

  // ------- Set the target bet. If all values the same skip (return).
  if (targetBetArr.every((bet) => bet === targetBetArr[0])) {
    return;
  }
  let targetBet =
    okurrs("P", targetBetArr) > okurrs("B", targetBetArr) ? "P" : "B";
  targetBet = S.reverse ? (targetBet === "P" ? "B" : "P") : targetBet;
  // ------------------------

  const STRATEGY_WON = bet === targetBet;
  if (STRATEGY_WON) {
    // strategy won, so we reset the strategy details
    reset(S);
  } else {
    // strategy lost, we calc %, go up a lvl and update maxLvl if exceeded
    S.lvl++;
    calcPercent(S);
  }
};
