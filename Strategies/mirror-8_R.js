import { calcPercent, reset } from "./common";

let currentLevel = 1,
  maxLevel = 10,
  percentage = null,
  nextMove = "-",
  hasWonInColumn = false;

export function run(bet, betsList) {
  const round = betsList.length;

  if (round < 6) {
    return;
  }
  const prevBet = betsList[round - 5 - 1] === "P" ? "B" : "P";
  const nextBet = betsList[round - 5] === "P" ? "B" : "P";

  if (round % 5 === 1) {
    hasWonInColumn = false;
    nextMove = nextBet;
    return;
  }
  if (hasWonInColumn) {
    return;
  }
  if (prevBet === bet) {
    // strategy won, we reset
    hasWonInColumn = true;
    reset(strategyDetails);
  }
  if (hasWonInColumn || round % 5 === 0) {
    nextMove = "-";
  } else {
    // strategy lost, we calc % and set nextMove
    currentLevel++;
    maxLevel = maxLevel < currentLevel ? currentLevel : maxLevel;
    percentage = calcPercent(currentLevel, maxLevel);
    nextMove = nextBet;
  }
}

export function reset() {
  percentage = Math.round(1000 / maxLevel) / 10;
  currentLevel = 1;
}
