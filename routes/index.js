const express = require("express");
const router = express.Router();
const {
  insertBet,
  undoBet,
  resetGame,
  deleteGame,
} = require("../services/shortGameManager");

router.post("/short-game/type-1/:bet", (req, res) => {
  insertBet(req.params.bet, res);
});

router.delete("/undo/short-game/type-1", (req, res) => {
  undoBet(req, res);
});

router.delete("/short-game/type-1/reset", (req, res) => {
  resetGame();
});

router.delete("/short-game/type-1/remove", (req, res) => {});

router.get("/", (req, res) => {
  res.sendStatus(200);
});
module.exports = router;
