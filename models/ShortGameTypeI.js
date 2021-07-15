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
  },
  { collection: "short_games_type_I" }
);

module.exports = ShortGame = mongoose.model("short_games_type_I", schema);
