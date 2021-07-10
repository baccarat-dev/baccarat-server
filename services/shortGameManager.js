const ShortGame = require("../models/ShortGame");

const insertBet = async (req, res) => {
  let doc = new ShortGame({
    bet: "P",
  });
  doc = await doc.save();
  console.log(doc);
};

const undoBet = async (req, res) => {};

const deleteGame = async (req, res) => {
  const q = await ShortGame.deleteMany({});
  console.log(q);
};

module.exports = { insertBet, undoBet, deleteGame };
