const express = require("express");
const router = express.Router();
const ShortGameTypeI = require("./shortGameTypeI");

router.use("/short-game/type-I", ShortGameTypeI);

router.get("/", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
