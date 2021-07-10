const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({ bet: { type: String } });

module.exports = ShortGame = mongoose.model("short_game", schema);
