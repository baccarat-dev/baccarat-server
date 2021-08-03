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
    target: String,
    enabled: Boolean,
    activated: Boolean,
    count: Number,
    targetIdx: Number,
    nbRows: Number,
  },
  { collection: "strategies_type_I_game_data" }
);

module.exports = StrategyTypeIGameData = mongoose.model(
  "strategies_type_I_game_data",
  schema
);

// StrategyTypeIGameData.find({ name: "Mirror-L-10 5x2" })
//   .exec()
//   .then((docs) => {
//     docs.forEach(async (doc) => {
//       doc.name = "Mirror L 5x2 - 6 rows";
//       doc.save();
//     });
//   });
