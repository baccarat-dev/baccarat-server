const Game = require("../models/Game");
const StrategyData = require("../models/StrategyData");
const { runStrategies } = require("../Strategies/common");
const { calcQuickStats, calcPersistentMetrics } = require("./metrics.js");

async function getAllBets(_id, res) {
  Game.findById(_id)
    .populate("strategies")
    .then(async (game) => {
      calcQuickStats(game.toObject(), game);
      await game.save();
      const data = await Game.findById(_id).populate("strategies").lean();
      res.contentType("application/json");
      res.status(200).send(JSON.stringify({ status: 200, data }, null, 4));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, msg: "internal server error" });
    });
}

async function insertBet(body, res) {
  return Game.findById(body._id)
    .populate("strategies")
    .exec()
    .then(async (GAME) => {
      GAME.bets.push(body.bet);
      await runStrategies(GAME, body.bet);
      calcQuickStats(GAME.toObject(), GAME);
      calcPersistentMetrics(GAME);
      GAME.round++;
      GAME.undos = 1;
      await GAME.save();
      let game = await Game.findById(body._id).populate("strategies");
      calcQuickStats(game.toObject(), game);
      await game.save();
      const data = await Game.findById(body._id).populate("strategies").lean();
      res.json({ status: 200, data });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500 });
    });
}

async function resetGame(_id, res) {
  const game = await Game.findById(_id);
  game.round = 1;
  game.bets = [];
  game.metrics = {};

  const promisesQueue = [];
  game.strategies.forEach((S_id) => {
    const promise = new Promise(async (resolve) => {
      const S = await StrategyData.findById(S_id);
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
  const game = await Game.findById(_id);
  game.bets.pop();
  game.round--;
  const promisesQueue = [];
  game.strategies.forEach((S_id) => {
    const promise = new Promise(async (resolve) => {
      const S = await StrategyData.findById(S_id);
      const history = S.history;
      S.overwrite({ ...history[history.length - 1] });
      history.pop();
      S.history = history;
      await S.save();
      resolve();
    });
    promisesQueue.push(promise);
  });
  await Promise.all(promisesQueue); // this holds execution until all strategies finish
  game.metrics.data.rightAndWrongs.pcts.pop();
  game.metrics.winsBetweenLossess = game.metrics.winsBetweenLossess.history[0];
  game.metrics.winsPerLvl = game.metrics.winsPerLvl.history[0];
  game.undos--;
  await game.save();
  res.json({ status: 200 });
}

async function getAllGames(user_id, res) {
  Game.find({ user_id })
    .populate("strategies")
    .sort("-startedOn")
    .then((docs) => {
      res.json({ status: 200, data: docs });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500 });
    });
}

async function activateGame(_id, res) {
  let game = Game.findOne({ activated: true });
  if (game) {
    game.activated = false;
    await game.save();
  }
  game = await Game.findById(_id);
  game.activated = true;
  await game.save();
  res.json({ status: 200 });
}

module.exports = {
  insertBet,
  undoBet,
  getAllBets,
  getAllGames,
  activateGame,
};
