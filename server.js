var createError = require("http-errors");
var express = require("express");

const { PORT } = require("./config");

var indexRouter = require("./routes/index");

var app = express();

console.log();

app.use(require("cors")()); // cors
if (process.argv[2] == "LOG") {
  app.use(require("morgan")("tiny")); // morgan logger
}
app.use(express.json()); // json parser

require("./db/connect");

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

const httpServer = app.listen(PORT || 4545, () => {
  console.log(`LISTENING ON ${PORT}`);
});
