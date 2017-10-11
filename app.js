var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require("cors");

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var mongooseClient = require("./bin/mongoose_client");
mongooseClient.connectDB(function () {
   console.log("db connection successful");
},function (err) {
    console.log("Error"+err);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var resetHandler  = require("./routes/resetHandler");
var logoutHandler = require("./routes/logoutHandler");
var usersHandler  = require("./routes/usersHandler");
var challengeHandler = require('./routes/challengeHandler');
var leaderBoardHandler = require('./routes/leaderBoardHandler');
var dbHandler = require("./routes/dbHandler");

app.use('/api/reset',resetHandler);

app.use('/api/logout',logoutHandler);

app.use('/api/users',usersHandler);

app.use('/api/challenges',challengeHandler);

app.use('/api/leaderboard',leaderBoardHandler);

app.use('/api/database',dbHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
