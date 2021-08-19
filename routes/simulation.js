const express = require("express");
const router = express.Router();
const { runSimulation } = require("../services/simulator");

router.get("/strats", (req, res) => {
  res.json(require("../Strategies/all").strategies);
});

router.post("/run", (req, res) => {
  const _ids = req.body._ids;
  if (!_ids.length) {
    res.status(400).json({ status: 400, msg: "Enable at least 1 strategy" });
    return;
  }
  try {
    const GAME = runSimulation(_ids);
    res.contentType("application/json");
    res
      .status(200)
      .send(
        JSON.stringify({ status: 200, game: { ...GAME, bets: null } }, null, 4)
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500 });
  }
});

module.exports = router;
