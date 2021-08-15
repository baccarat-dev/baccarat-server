const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;

const schema = new Schema(
  {
    name: { type: String, default: "Short Game" },
    round: { type: Number, default: 1 },
    bets: { type: [String], default: [] },
    userID: { type: String, default: "" },
    startedOn: { type: Date, default: Date.now() },
    isTrashed: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now() },
    threshold: { type: Number, default: 3 },
    strategies: [{ type: ObjectId, ref: "strategies_type_I_game_data" }],
    metrics: {
      data: { rightAndWrongs: { pcts: { type: [Boolean], default: [] } } },
      winsBetweenLossess: {
        min: { type: Number, default: null },
        max: { type: Number, default: null },
        current: { type: Number, default: 0 },
        activated: { type: Boolean, default: false },
        startIdx: { type: Number, default: 0 },
        endingRound: { type: Number, default: 0 },
        history: [Object],
      },
      winsPerLvl: {
        lvl: { type: Number, default: 1 },
        maxLvl: { type: Number, default: 4 },
        count: [{ lvl: Number, n: { type: Number, default: 0 } }],
        history: [Object],
      },
      quickStats: {
        pct_avg_P: { type: Number, default: 0 },
        pct_avg_B: { type: Number, default: 0 },
        P_next_count: { type: Number, default: 0 },
        B_next_count: { type: Number, default: 0 },
        P_next_pct: { type: Number, default: 0 },
        B_next_pct: { type: Number, default: 0 },
      },
    },
    undos: { type: Number, default: 1 },
  },
  { collection: "short_games_type_I" }
);

module.exports = ShortGame = mongoose.model("short_games_type_I", schema);
