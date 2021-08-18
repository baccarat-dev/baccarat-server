const express = require("express");
const router = express.Router();
const { runSimulation } = require("../services/simulator");

router.get("/strats", (req, res) => {
  res.json(require("../Strategies/all").strategies);
});

router.get("/run", (req, res) => {
  try {
    const GAME = runSimulation();
    res.contentType("application/json");
    res
      .status(200)
      .send(
        JSON.stringify(
          { status: 200, game: { ...GAME, strategies: null, bets: null } },
          null,
          4
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500 });
  }
});

module.exports = router;
