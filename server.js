var createError = require("http-errors");
var express = require("express");

const { PORT } = require("./config");

var indexRouter = require("./routes/index");

var app = express();

app.use(require("cors")());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

const httpServer = app.listen(PORT, () => {
  console.log(`LISTENING ON ${PORT}`);
});

process.on("exit", () => {
  httpServer.close();
});

process.on("uncaughtException", () => {
  httpServer.close();
});

process.on("SIGTERM", () => {
  httpServer.close();
});
