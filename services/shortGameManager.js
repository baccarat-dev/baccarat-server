const ShortGame = require("../models/ShortGame");

const insertBet = async (bet, res) => {
  let doc = new ShortGame({
    bet,
  });
  doc = await doc.save();
  console.log(doc);
  res.json({ status: 200 });
};

const undoBet = async (req, res) => {};

const getAllBets = async (res) => {
  const docs = await ShortGame.find({});
  res.json({ status: 200, data: docs.map((x) => x.bet) });
};

const resetGame = async (res) => {
  const q = await ShortGame.deleteMany({});
  console.log(q);
  if (q.ok) {
    res.json({ status: 200 });
  } else {
    res.json({ status: 500 });
  }
  console.log("done");
};

const deleteGame = async (req, res) => {};

module.exports = { insertBet, undoBet, resetGame, deleteGame, getAllBets };
