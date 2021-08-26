const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now() },
    role: { type: String, default: "basic", enum: ["admin", "basic"] },
  },
  { collection: "users" }
);

module.exports = Strategy = mongoose.model("users", schema);
