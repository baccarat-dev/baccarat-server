import { calcPercent, reset } from "./common";

let currentLevel = 1,
  maxLevel = 12,
  percentage = null,
  nextMove = "-",
  hasWonInColumn = false,
  cornerCellIdx = 0;

export function run(bet, betsList) {
  const round = betsList.length;
  const mod5 = round % 5;
  console.log(mod5);
  if (round < 16) {
    return;
  }

  let targetIdx;
  let nextIdx;
  switch (mod5) {
    case 1:
      hasWonInColumn = false;
      cornerCellIdx = round - 1;
      nextMove = betsList[cornerCellIdx - 15];
      return;
    case 2:
      targetIdx = cornerCellIdx - 15;
      nextIdx = targetIdx + 5;
      break;
    case 3:
      targetIdx = cornerCellIdx - 10;
      nextIdx = targetIdx + 5;
      break;
    case 4:
      targetIdx = cornerCellIdx - 5;
      nextIdx = targetIdx + 5;
      break;
    default:
      targetIdx = cornerCellIdx;
      nextIdx = "-";
      break;
  }

  const targetBet = betsList[targetIdx];
  const nextBet = betsList[nextIdx];

  if (targetBet !== bet) {
    // strategy won, we reset
    hasWonInColumn = true;
    reset(strategyDetails);
  }
  if (hasWonInColumn) {
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
