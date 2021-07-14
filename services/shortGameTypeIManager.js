const ShortGame = require("../models/ShortGameTypeI");
const StrategyTypeI = require("../models/StrategyTypeI");
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
      const S_id = GAME.strategies.find((s) => s.code === "test")._id;
      const S = await StrategyTypeI.findById(S_id);
      console.log(S);
      console.log("\n-----------\n");
      GAME.bets = [...GAME.bets, body.bet];
      require("../Strategies/mirror-8")(S, GAME.round, body.bet, GAME.bets);
      GAME.round++;
      await S.save();
      GAME = await GAME.save();
      if (GAME) {
        res.json({ status: 200 });
      } else {
        res.json({ status: 500 });
      }
      console.log(S);
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
    let S = await StrategyTypeI.findById(_id);
    S.lvl = 1;
    S.hasWonInCol = false;
    S.nextMove = "-";
    calcPercent(S);
    await S.save();
  });
  await game.save();
  res.json({ status: 200 });
}

//resetGame();

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
