const ShortGame = require("../models/ShortGame");

async function insertBet(bet, res) {
  let doc = new ShortGame({
    bet,
  });
  doc = await doc.save();
  console.log(doc);
  res.json({ status: 200 });
}

async function undoBet(req, res) {}

async function getAllBets(res) {
  const docs = await ShortGame.find({});
  res.json({ status: 200, data: docs.map((x) => x.bet) });
}

async function resetGame(res) {
  const q = await ShortGame.deleteMany({});
  console.log(q);
  if (q.ok) {
    res.json({ status: 200 });
  } else {
    res.json({ status: 500 });
  }
  console.log("done");
}

async function deleteGame(req, res) {}

async function test() {
  let secs = 0;
  for (let i = 0; i < 1000; i++) {
    let t0 = Date.now();
    const docs = new Array(1000);
    docs.fill({ bet: "P" });
    await ShortGame.insertMany(docs);
    let t1 = Date.now();
    secs += t1 - t0;
    console.log("done " + i + " in " + secs + " ms");
  }
}

module.exports = {
  insertBet,
  undoBet,
  resetGame,
  deleteGame,
  getAllBets,
  test,
};
