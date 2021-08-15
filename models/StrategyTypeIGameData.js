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
    target: String,
    enabled: Boolean,
    activated: Boolean,
    count: Number,
    targetIdx: Number,
    nbRows: Number,
    row: Number,
    pattern: [String],
    targetBets: [String],
    history: [Object],
  },
  { collection: "strategies_type_I_game_data" }
);

module.exports = StrategyTypeIGameData = mongoose.model(
  "strategies_type_I_game_data",
  schema
);
