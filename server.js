'use strict';

var config = require('./config/config')()
  , express = require('express')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , fs = require('fs')
;

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