const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;

const schema = new Schema(
  {
    game_id: ObjectId,
    code: String,
    name: String,
    lvl: { type: Number, default: 1 },
    maxLvl: Number,
    percent: Number,
    nextMove: { type: String, default: "-" },
    hasWonInCol: { type: Boolean, default: false },
    reverse: { type: Boolean, default: false },
    cornerCellIdx: String,
    prevState: Object,
  },
  { collection: "strategies_type_I_game_data" }
);

module.exports = StrategyTypeIGameData = mongoose.model(
  "strategies_type_I_game_data",
  schema
);
