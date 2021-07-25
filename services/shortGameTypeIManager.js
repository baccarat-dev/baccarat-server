const { roundXToNthDecimal } = require("../helper");
const ShortGame = require("../models/ShortGameTypeI");
const StrategyTypeIGameData = require("../models/StrategyTypeIGameData");
const { runStrategies } = require("../Strategies/common");

//StrategyTypeIGameData.insertMany([{}, {}]);

async function getAllBets(_id, res) {
  const data = (
    await ShortGame.findById(_id).populate("strategies")
  ).toObject();

  data.strategies = data.strategies.filter((S) => S.enabled);

  let pct_sum_P = (pct_sum_B = P_next_count = B_next_count = 0);
  data.strategies.forEach((S) => {
    if (S.nextMove === "P") {
      pct_sum_P += S.percent;
      P_next_count++;
    } else if (S.nextMove === "B") {
      pct_sum_B += S.percent;
      B_next_count++;
    }
  });
  const pct_avg_P = P_next_count
    ? roundXToNthDecimal(pct_sum_P / P_next_count, 1)
    : 0;
  const pct_avg_B = B_next_count
    ? roundXToNthDecimal(pct_sum_B / B_next_count, 1)
    : 0;
  const P_next_pct =
    Math.round((100 * P_next_count) / (P_next_count + B_next_count)) || 0;
  const B_next_pct =
    Math.round((100 * B_next_count) / (P_next_count + B_next_count)) || 0;
  data.stats = {
    pct_avg_P,
    pct_avg_B,
    P_next_count,
    B_next_count,
    P_next_pct,
    B_next_pct,
  };
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
