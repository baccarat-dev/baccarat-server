const ShortGame = require("../models/ShortGameTypeI");

//  new ShortGame().save();  // !!! DELETE LATER !!!

async function insertBet(body, res) {
  console.log("started");
  ShortGame.findById(body._id)
    .exec()
    .then(async (doc) => {
      doc.bets = [...doc.bets, body.bet];
      require("../Strategies/mirror-8")(
        doc.strategies["test"],
        doc.round,
        body.bet,
        doc.bets
      );
      console.log("line 18:", doc.strategies["test"]);
      doc.round++;
      doc = await doc.save();
      if (doc) {
        res.json({ status: 200 });
      } else {
        res.json({ status: 500 });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500 });
    });
}

insertBet(
  { bet: "P", _id: "60ef2a69c6b49b20e1d87c7a" },
  {
    json: (res) => {
      console.log(res);
    },
  }
);

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

//resetGame();

async function deleteGame(req, res) {}

async function test() {
  let secs = 0;
  for (let i = 0; i < 10; i++) {
    let t0 = Date.now();
    const docs = new Array(1000);
    docs.fill({ bet: "P" });
    await ShortGame.insertMany(docs);
    let t1 = Date.now();
    secs += t1 - t0;
    console.log("done " + (i + 1) + " in " + secs + " ms");
  }
  console.log("finished");
}

module.exports = {
  insertBet,
  undoBet,
  resetGame,
  deleteGame,
  getAllBets,
  test,
};
