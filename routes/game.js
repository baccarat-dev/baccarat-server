const express = require("express");
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");
const Game = require("../models/Game");
const User = require("../models/User");
const router = express.Router();
const {
  insertBet,
  undoBet,
  getAllBets,
  getAllGames,
  activateGame,
} = require("../services/gameManager");
const StrategyData = require("../models/StrategyData");
const Strategy = require("../models/Strategy");

router.get("/:_id", (req, res) => {
  const _id = req.params._id;
  if (_id && isValidObjectId(_id)) {
    getAllBets(_id, res);
  } else {
    res.status(400).json({ status: 400, msg: "invalid _id" });
  }
});

router.post("/", (req, res) => {
  insertBet(req.body, res);
});

router.delete("/undo/:_id", (req, res) => {
  undoBet(req.params._id, res).catch((err) => {
    res.status(500).json({ status: 500 });
  });
});

router.post("/create", async (req, res) => {
  const user_id = req.body.user_id;
  let strategies = req.body.strategies;
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({ status: 400, msg: "Enter game name" });
  }
  if (!user_id || !isValidObjectId(user_id)) {
    return res.status(400).json({ status: 400, msg: "invalid user_id" });
  }
  if (await Game.findOne({ name, user_id })) {
    return res.status(400).json({ status: 400, msg: "Game name already used" });
  }
  if (!strategies.length) {
    return res.status(400).json({ status: 400, msg: "must select a strategy" });
  }
  let user = await User.findOne({ _id: user_id });
  if (!user) {
    return res.status(400).json({ status: 400, msg: "nonexistent user_id" });
  }
  strategies.forEach((s) => delete s._id);
  // TODO: MUST ADD .session(dbsession) on every mongoose query
  try {
    let game = new Game({ user_id });
    strategies.forEach((s) => (s.game_id = game._id));
    strategies = await StrategyData.insertMany(strategies);
    strategies.forEach((s) => game.strategies.push(s));
    game.name = name;
    await game.save();
    return res
      .status(201)
      .json({ status: 201, msg: "New game created", data: game });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, msg: "internal server error" });
  }
});

router.get("/strategies/all", (req, res) => {
  Strategy.find({})
    .lean()
    .exec()
    .then((docs) => {
      res.status(200).json({ status: 200, data: docs });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, msg: "internal server error" });
    });
});

router.get("/all/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  if (user_id && isValidObjectId(user_id)) {
    getAllGames(user_id, res);
  } else {
    res.status(400).json({ status: 400, msg: "invalid user_id" });
  }
});

router.post("/activate", async (req, res) => {
  const _id = req.body._id;
  if (_id && isValidObjectId(_id) && (await Game.findById(_id))) {
    await activateGame(_id, res);
  } else {
    res.status(400).json({ status: 400, msg: "invalid game_id" });
  }
});

router.delete("/:_id", async (req, res) => {
  const _id = req.params._id;
  if (_id && isValidObjectId(_id) && (await Game.findById(_id))) {
    Game.deleteOne({ _id })
      .then((result) => {
        res.status(200).json({ status: 200, msg: "Game was deleted" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ status: 500 });
      });
  } else {
    res.status(400).json({ status: 400, msg: "invalid game_id" });
  }
});

router.get("/", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
