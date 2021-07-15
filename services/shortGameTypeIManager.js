const ShortGame = require("../models/ShortGameTypeI");
const StrategyTypeIGameData = require("../models/StrategyTypeIGameData");
const { calcPercent } = require("../Strategies/common");

async function getAllBets(_id, res) {
  const data = await ShortGame.findById(_id).populate("strategies");
  res.contentType("application/json");
  res.send(JSON.stringify({ status: 200, data }, null, 4));
}

async function insertBet(body, res) {
  ShortGame.findById(body._id)
    .populate("strategies")
    .exec()
    .then(async (GAME) => {
      GAME.bets.push(body.bet);

      const promisesQueue = [];
      GAME.strategies.forEach((S_id) => {
        const promise = new Promise(async (resolve, reject) => {
          const S = await StrategyTypeIGameData.findById(S_id);
          const runStrategy = require("../Strategies/" + S.code);
          runStrategy(S, GAME.round, body.bet, GAME.bets);
          await S.save();
          console.log("finished: " + S.name);
          resolve();
        });
        promisesQueue.push(promise);
      });
      // this holds execution until all strategies finish
      await Promise.all(promisesQueue);
      GAME.round++;
      await GAME.save();
      res.json({ status: 200 });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500 });
    });
}

async function undoBet(req, res) {}

async function resetGame(_id, res) {
  const game = await ShortGame.findById(_id);
  game.round = 1;
  game.bets = [];
  game.strategies.forEach(async (_id) => {
    let S = await StrategyTypeIGameData.findById(_id);
    S.lvl = 1;
    S.hasWonInCol = false;
    S.nextMove = "-";
    calcPercent(S);
    await S.save();
  });
  await game.save();
  res.json({ status: 200 });
}

async function deleteGame(req, res) {}

async function test() {
  let secs = 0;
  for (let i = 0; i < 10; i++) {
    let t0 = Date.now();
    const docs = new Array(1000);
    docs.fill({ bet: "P" });
    await ShortGame.insertMany(docs);
    let t1 = Date.now();
    secs += t1 - t0;
  }
}

module.exports = {
  insertBet,
  undoBet,
  resetGame,
  deleteGame,
  getAllBets,
  test,
};
