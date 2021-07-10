const ShortGame = require("../models/ShortGame");

const insertBet = async (bet, res) => {
  let doc = new ShortGame({
    bet,
  });
  doc = await doc.save();
  console.log(doc);
};

const undoBet = async (req, res) => {};

const resetGame = async (req, res) => {
  const q = await ShortGame.deleteMany({});
  if (q.ok && q.n > 0) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
  console.log(q);
};

const deleteGame = async (req, res) => {};

module.exports = { insertBet, undoBet, resetGame, deleteGame };
