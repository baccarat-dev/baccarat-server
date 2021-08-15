const { roundXToNthDecimal } = require("../helper");

const calcPercent = function (S) {
  if (S.maxLvl < S.lvl) {
    S.lvl = 1;
  }
  const percent = (S.lvl * 100) / S.maxLvl;
  S.percent = roundXToNthDecimal(percent, 1);
};

const reset = (S) => {
  S.lvl = 1;
  const percent = (S.lvl * 100) / S.maxLvl;
  S.percent = roundXToNthDecimal(percent, 1);
};

const runStrategies = async function (GAME, bet) {
  const promisesQueue = [];

  GAME.strategies.forEach((S_id) => {
    const promise = new Promise(async (resolve, reject) => {
      const S = await StrategyTypeIGameData.findById(S_id);
      const copy_S = { ...S.toObject() };
      delete copy_S.history;
      S.history.shift();
      S.history.push(copy_S);
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

const okurrs = function (val, arr) {
  return arr.reduce((cum, x) => (x === val ? cum + 1 : cum), 0);
};

module.exports = { runStrategies, reset, calcPercent, okurrs };
