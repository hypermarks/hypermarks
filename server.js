'use strict';

var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , express = require('express')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , fs = require('fs')
;

console.log(process.env)

require('express-namespace');

mongoose.connect(config.db);


// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

var app = express();

// Bootstrap application settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport);


// Start the app by listening on <port>
var port = process.env.PORT || 1337;
app.listen(port);

// Expose app
module.exports = app;
