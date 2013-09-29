'use strict';

var $ = require('../vendor/jquery.js')
  , areas = require('./areas.js')
;

//Sets up Persona
require('./internal-login.js');


areas.modalOverlay($('#modal-overlay'));
areas.newListModal($('#new-list-modal'));
areas.sidebar($('#sidebar'));
areas.results($('#results'));
areas.header($('#header'));