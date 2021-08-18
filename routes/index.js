const express = require("express");
const router = express.Router();
const ShortGameTypeI = require("./shortGameTypeI");
const Simulation = require("./simulation");

router.use("/short-game/type-I", ShortGameTypeI);
router.use("/sim", Simulation);

router.get("/", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
