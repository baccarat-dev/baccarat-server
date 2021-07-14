const { calcPercent } = require("./common");

let currentLevel = 1,
  maxLevel = 8,
  percentage = null,
  nextMove = "-";

module.exports.run = function run(round, bet, winNbr, prevNum, prevBet) {
  nextMove = isEven(winNbr) ? bet : bet === "P" ? "B" : "P";
  if (round === 1) {
    return;
  }
  if (isEven(prevNum)) {
    if (prevBet === bet) {
      // strategy won, we reset
      reset(strategyDetails);
    } else {
      // strategy lost
      currentLevel++;
      maxLevel = maxLevel < currentLevel ? currentLevel : maxLevel;
      percentage = calcPercent(currentLevel, maxLevel);
    }
  } else {
    nextMove = bet === "P" ? "B" : "P";
    if (prevBet !== bet) {
      // strategy won, we reset
      reset(strategyDetails);
    } else {
      // strategy lost
      currentLevel++;
      maxLevel = maxLevel < currentLevel ? currentLevel : maxLevel;
      percentage = calcPercent(currentLevel, maxLevel);
    }
  }
};

function reset(strategyDetails) {
  percentage = Math.round(1000 / maxLevel) / 10;
  currentLevel = 1;
}

function isEven(x) {
  return x % 2 === 0;
}
