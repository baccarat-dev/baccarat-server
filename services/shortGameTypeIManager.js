const { roundXToNthDecimal } = require("../helper");
const ShortGame = require("../models/ShortGameTypeI");
const StrategyTypeIGameData = require("../models/StrategyTypeIGameData");
const { runStrategies } = require("../Strategies/common");

async function getAllBets(_id, res) {
  const data = (
    await ShortGame.findById(_id).populate("strategies")
  ).toObject();
  let pct_sum_P = (pct_sum_B = pct_count_P = pct_count_B = 0);
  data.strategies.forEach((S) => {
    if (S.nextMove === "P") {
      pct_sum_P += S.percent;
      pct_count_P++;
    } else if (S.nextMove === "B") {
      pct_sum_B += S.percent;
      pct_count_B++;
    }
  });
  const pct_avg_P = pct_count_P
    ? roundXToNthDecimal(pct_sum_P / pct_count_P, 1)
    : 0;
  const pct_avg_B = pct_count_B
    ? roundXToNthDecimal(pct_sum_B / pct_count_B, 1)
    : 0;
  data.pct_avg_P = pct_avg_P;
  data.pct_avg_B = pct_avg_B;
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
  game.strategies.forEach(async (_id) => {
    let S = await StrategyTypeIGameData.findById(_id);
    S.lvl = 1;
    S.hasWonInCol = false;
    S.nextMove = "-";
    S.percent = 0;
    S.cornerCellIdx = undefined;
    await S.save();
  });
  await game.save();
  res.json({ status: 200 });
}

async function undoBet(_id, res) {
  const game = await ShortGame.findById(_id);
  const l1 = game.bets.length + game.round;
  game.bets.pop();
  game.round--;
  const l2 = game.bets.length + game.round;
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
