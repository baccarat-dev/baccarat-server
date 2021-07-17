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

router.delete("/remove", (req, res) => {});

router.get("/", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
