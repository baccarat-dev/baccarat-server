const express = require("express");
const router = express.Router();
const {
  insertBet,
  undoBet,
  resetGame,
  getAllBets,
  deleteGame,
  test,
} = require("../services/shortGameTypeIManager");

router.get("/allrecords/:_id", (req, res) => {
  getAllBets(req.params._id, res);
});

router.post("/", (req, res) => {
  insertBet(req.body, res);
});

router.delete("/undo/:_id", (req, res) => {
  undoBet(req.params._id, res).catch(() => {
    res.json({ status: 500 });
  });
});

router.delete("/reset/:_id", (req, res) => {
  resetGame(req.params._id, res);
});

router.get("/setmaxlvl/:N", (req, res) => {
  const N = req.params.N;
  const _id = "60ef2a69c6b49b20e1d87c7a";
  if (isNaN(+N)) {
    res.json({ status: 500 });
  } else {
    ShortGame.findById(_id)
      .populate("strategies")
      .exec()
      .then(async (GAME) => {
        const promisesQueue = [];
        GAME.strategies.forEach((S_id) => {
          const promise = new Promise(async (resolve, reject) => {
            const S = await StrategyTypeIGameData.findById(S_id);
            S.maxLvl = +N;
            await S.save();
            resolve();
          });
          promisesQueue.push(promise);
        });
        await Promise.all(promisesQueue); // this holds execution until all strategies finish

        res.json({ status: 200 });
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: 500 });
      });
  }
});

router.delete("/remove", (req, res) => {});

router.get("/", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
