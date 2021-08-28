const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set("useCreateIndex", true);

const schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    reverse: Boolean,
    nbRows: Number,
    row: Number,
    pattern: { type: [String], required: false, default: undefined },
    targetBets: { type: [String], required: false, default: undefined },
  },
  { collection: "strategies" }
);

module.exports = Strategy = mongoose.model("strategies", schema);
