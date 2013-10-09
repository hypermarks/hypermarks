'use strict';

var config = require('./config/config')()
  , express = require('express')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , fs = require('fs')
;

console.log('logg');

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
var port = process.env.PORT || 8081;
app.listen(port);

console.log(config);

// Expose app
module.exports = app;