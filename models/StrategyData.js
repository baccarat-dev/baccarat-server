const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;

const schema = new Schema(
  {
    game_id: { type: ObjectId, required: true, ref: "games" },
    code: { type: String, required: true },
    name: { type: String, required: true },
    maxLvl: { type: Number, required: true },

    reverse: { type: Boolean, default: false },
    lvl: { type: Number, default: 1 },
    percent: { type: Number, default: 0 },
    nextMove: { type: String, default: "-" },
    hasWonInCol: { type: Boolean, default: false },
    activated: { type: Boolean },
    cornerCellIdx: Number,
    target: String,
    count: Number,
    targetIdx: Number,
    nbRows: Number,
    row: Number,
    pattern: { type: [String], required: false, default: undefined },
    targetBets: { type: [String], required: false, default: undefined },
    history: [Object],
  },
  { collection: "strategies_data" }
);
schema.index({ game_id: 1, name: 1 }, { unique: true });

module.exports = StrategyData = mongoose.model("strategies_data", schema);
