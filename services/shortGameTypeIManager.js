const ShortGame = require("../models/ShortGameTypeI");
const StrategyTypeIGameData = require("../models/StrategyTypeIGameData");
const { runStrategies } = require("../Strategies/common");
const {
  calcQuickStats,
  calcPersistentMetrics,
} = require("../services/metrics.js");

async function getAllBets(_id, res) {
  const game = await ShortGame.findById(_id).populate("strategies");
  const data = game.toObject();
  data.strategies = data.strategies.filter((S) => S.enabled);
  calcQuickStats(data, game);
  await game.save();
  res.contentType("application/json");
  res.send(JSON.stringify({ status: 200, data }, null, 4));
}

async function insertBet(body, res) {
  ShortGame.findById(body._id)
    .populate("strategies")
    .exec()
    .then(async (GAME) => {
      GAME.bets.push(body.bet);
      await runStrategies(GAME, body.bet);
      calcPersistentMetrics(GAME);
      GAME.round++;
      await GAME.save();
      res.json({ status: 200 });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500 });
    });
}

async function resetGame(_id, res) {
  const game = await ShortGame.findById(_id);
  game.round = 1;
  game.bets = [];
  game.metrics = {};

  const promisesQueue = [];
  game.strategies.forEach((S_id) => {
    const promise = new Promise(async (resolve) => {
      const S = await StrategyTypeIGameData.findById(S_id);
      S.lvl = 1;
      S.hasWonInCol = false;
      S.nextMove = "-";
      S.percent = 0;
      S.cornerCellIdx = undefined;
      S.history = [];
      S.activated = false;
      S.count = 0;
      await S.save();
      resolve();
    });
    promisesQueue.push(promise);
  });
  await Promise.all(promisesQueue); // this holds execution until all strategies finish
  await game.save();

  res.json({ status: 200 });
}

async function undoBet(_id, res) {
  const game = await ShortGame.findById(_id);
  const l1 = game.bets.length + game.round;
  game.bets.pop();
  game.round--;
  const l2 = game.bets.length + game.round;

  const promisesQueue = [];
  game.strategies.forEach((S_id) => {
    const promise = new Promise(async (resolve) => {
      const S = await StrategyTypeIGameData.findById(S_id);
      if (S.enabled) {
        const history = S.history;
        S.overwrite({ ...history[history.length - 1] });
        history.pop();
        S.history = history;
        await S.save();
        resolve();
      } else {
        resolve();
      }
    });
    promisesQueue.push(promise);
  });
  await Promise.all(promisesQueue); // this holds execution until all strategies finish
  await game.save();
  if (l2 === l1 - 2) {
    res.json({ status: 200 });
  } else {
    res.json({ status: 500 });
  }
}

async function deleteGame(req, res) {}

module.exports = {
  insertBet,
  undoBet,
  resetGame,
  deleteGame,
  getAllBets,
};
