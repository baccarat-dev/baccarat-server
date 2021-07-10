const express = require("express");
const router = express.Router();
const {
  insertBet,
  undoBet,
  deleteGame,
} = require("../services/shortGameManager");

router.post("/short-game/type-1", (req, res) => {
  insertBet(req, res);
});

router.delete("/undo/short-game/type-1", (req, res) => {
  undoBet(req, res);
});

router.delete("/short-game/type-1/reset", (req, res) => {
  deleteAll;
});

router.delete("/short-game/type-1/remove", (req, res) => {});

module.exports = router;
