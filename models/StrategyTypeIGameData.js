const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;

const schema = new Schema(
  {
    game_id: ObjectId,
    code: String,
    name: String,
    lvl: Number,
    maxLvl: Number,
    percent: Number,
    nextMove: String,
    hasWonInCol: Boolean,
    reverse: Boolean,
    cornerCellIdx: String,
    rectangle: Boolean,
    history: [Object],
    row: Number,
    target: String,
    enabled: Boolean,
    activated: Boolean,
    count: Number,
  },
  { collection: "strategies_type_I_game_data" }
);

module.exports = StrategyTypeIGameData = mongoose.model(
  "strategies_type_I_game_data",
  schema
);

StrategyTypeIGameData.updateMany(
  { name: "Mirror-8 (R)" },
  { name: "Mirror-8 5.rows (R)" },
  function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Updated Docs : ", docs);
    }
  }
);
