'use strict';

var $ = require('../vendor/jquery.js')
  , areas = require('./areas.js')
;

//Sets up Persona
require('./internal-login.js');


areas.modalOverlay($('#modal-overlay'));
areas.newListModal($('#new-list-modal'));
areas.addLinkModal($('#add-link-modal'));
areas.sidebar($('#sidebar'));
areas.results($('#results'));
areas.header($('#header'));
areas.hypermark($('.hypermark'))


// $("#hypermarkpost").on("submit", function(e){
//   var that=this
//     , img = new Image();

//   img.onload=function(){
//     $('input[name=url]', that).val("");
//     window.location.href = window.location.href;
//   };

//   img.onError=function(event){
//     throw "Error";
//   }
//   img.src ="/_api/post?url="+$('input[name=url]',that).val();
// });

// $(".control-switch").on("click", function(){
// 	var $el=$("._controls");
// 	if ( $el.hasClass("hypermarkpost") )
// 		$el.removeClass("hypermarkpost");
// 	else
// 		$el.addClass("hypermarkpost");
// });