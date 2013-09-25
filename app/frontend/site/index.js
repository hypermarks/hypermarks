'use strict';

var $ = require('../vendor/jquery.js')
  , areas = require('./areas.js');
;

//Sets up Persona
require('./internal-login.js');

areas.global($('body'))
areas.sidebar($('.sidebar'));
areas.results($('.results'));