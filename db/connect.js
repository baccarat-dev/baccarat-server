const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config");

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log(`MongoDB connected to db "${res.connection.db.databaseName}"`);
  })
  .catch((err) => {
    console.log(err);
  });
