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
  getAllBets(req.params._id, res).catch((err) => {
    console.log(err);
    res.json({ status: 500 });
  });
});

router.post("/", (req, res) => {
  insertBet(req.body, res);
});

router.delete("/undo/:_id", (req, res) => {
  undoBet(req.params._id, res).catch((err) => {
    console.log(err);
    res.json({ status: 500 });
  });
});

router.delete("/reset/:_id", (req, res) => {
  resetGame(req.params._id, res);
});

router.get("/setmaxlvl/:_id/:N", (req, res) => {
  const N = req.params.N;
  const _id = req.params._id;
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

        res.json({ status: 200, msg: "Max lvl set to " + N });
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: 500, msg: "error" });
      });
  }
});

router.get("/strategy/setmaxlvl/:_id/:N", (req, res) => {
  const N = req.params.N;
  const _id = req.params._id;
  if (isNaN(+N)) {
    res.json({ status: 500 });
  } else {
    StrategyTypeIGameData.findById(_id)
      .exec()
      .then(async (S) => {
        if (S) {
          S.maxLvl = +N;
          await S.save();
          res.json({
            status: 200,
            msg: `Max lvl set to ${N} for '${S.name}' `,
          });
        } else {
          res.json({ status: 404, msg: "Nonexistent Strategy ID" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: 500, msg: "Operation Failed" });
      });
  }
});

router.get("/strategy/:action/:_id", (req, res) => {
  const action = req.params.action.toLowerCase();
  if (!["enable", "disable"].includes(action)) {
    res.status(200).json({ status: 204, msg: "invalid action" });
    return;
  }
  const _id = req.params._id;

  StrategyTypeIGameData.findById(_id)
    .exec()
    .then(async (S) => {
      if (S) {
        S.enabled = action === "enable" ? true : false;
        await S.save();
        res.json({
          status: 200,
          msg: `${action}d strategy '${S.name}' `,
        });
      } else {
        res.json({ status: 404, msg: "Nonexistent Strategy" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500, msg: "Operation Failed" });
    });
});

router.delete("/remove", (req, res) => {});

router.get("/", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
