const express = require("express");
const router = express.Router();
const Game = require("./game");
const Auth = require("./auth");

router.use("/game", Game);
router.use("/auth", Auth);

router.get("/", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
