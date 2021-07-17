const { roundXToNthDecimal } = require("../helper");

module.exports.calcPercent = function (S) {
  S.maxLvl = S.maxLvl < S.lvl ? S.lvl : S.maxLvl;
  const percent = (S.lvl * 100) / S.maxLvl;
  S.percent = roundXToNthDecimal(percent, 1);
};

module.exports.reset = (S) => {
  S.lvl = 1;
  S.nextMove = "-";
  S.hasWonInCol = true;
  const percent = (S.lvl * 100) / S.maxLvl;
  S.percent = roundXToNthDecimal(percent, 1);
};

module.exports.runStrategies = async function (GAME, bet) {
  const promisesQueue = [];

  GAME.strategies.forEach((S_id) => {
    const promise = new Promise(async (resolve, reject) => {
      const S = await StrategyTypeIGameData.findById(S_id);
      const runStrategy = require("../Strategies/" + S.code);
      runStrategy(S, GAME.round, bet, GAME.bets);
      await S.save();
      resolve();
    });
    promisesQueue.push(promise);
  });

  // this holds execution until all strategies finish
  return await Promise.all(promisesQueue);
};
