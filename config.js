if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 4545,
};
