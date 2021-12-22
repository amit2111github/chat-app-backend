var createError = require("http-errors");
// socket.io


var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

var usersRouter = require("./routes/user");
var authRouter = require("./routes/auth");
var messageRouter = require("./routes/message");
var postRouter = require("./routes/post");
var commentRouter = require("./routes/comment");

const { mongoDbUrl } = require("./config/var");

var app = express();

// mongoose connection
mongoose
  .connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
    console.log("DB connection failed");
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/home", authRouter);
app.use("/user", usersRouter);
app.use("/message", messageRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);

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
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
