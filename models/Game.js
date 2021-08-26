const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;

const schema = new Schema(
  {
    name: { type: String, required: true },
    round: { type: Number, default: 1 },
    bets: { type: [String], default: [] },
    user_id: { type: String, required: true, ref: "users" },
    active: { type: Boolean, default: false },
    startedOn: { type: Date, default: Date.now() },
    strategies: [{ type: ObjectId, ref: "strategies_data" }],
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
        maxLvl: { type: Number, default: 3 },
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
        max_conseq_wins: { type: Number, default: 0 },
        max_conseq_losses: { type: Number, default: 0 },
      },
    },
    undos: { type: Number, default: 1 },
  },
  { collection: "games" }
);
schema.index({ user_id: 1, name: 1 }, { unique: true });

module.exports = ShortGame = mongoose.model("games", schema);
