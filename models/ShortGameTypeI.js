const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    strategies: {
      type: Object,
      default: {
        test: {
          code: "Str",
          name: "str",
          lvl: 1,
          maxLvl: 10,
          percent: 10,
          nextMove: "-",
          hasWonInCol: false,
        },
      },
    },
  },
  { collection: "short_games_type_I" }
);

module.exports = ShortGame = mongoose.model("short_games_type_I", schema);
