'use strict';
var $ = require('zepto-browserify').$
  , responseHandler = require('./responseHandlers.js')
  , config = require('../../../config/config')()
;

 function addcss(filename, cb){
    var filename = filename,sheet,i;
    var fileref = document.createElement("link");

    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);

    var readyfunc = function () {
        cb(null, fileref);
    }

    var timerfunc = function (){
        for (i=0;i<document.styleSheets.length;i++){
            sheet = document.styleSheets[i].href;
            if(sheet !== null && sheet.substr(sheet.length-filename.length) == filename)
                return readyfunc();
        }
        setTimeout(timerfunc,50);  
    }

    if (document.all){ //Uses onreadystatechange for Internet Explorer
        fileref.attachEvent('onreadystatechange',function() {
            if(fileref.readyState == 'complete' || fileref.readyState == 'loaded')
                readyfunc();
        });
    } else {    //Checks if the stylesheet has been loaded every 50 ms for others
        setTimeout(timerfunc,50);
    }
    document.getElementsByTagName("head")[0].appendChild(fileref); 
 }

function addSpinner() {
  ///we should add a spinner right off the bat!  to do!
}

function loadRequest() {
  var img = new Image(); 
  img.onload=function(){
    responseHandler.success()
  }

  img.onError=function(event){
    responseHandler.error();
  }
  img.src = config.url+"/_api/post?url="+window.location.href;
}
//Put our styles in head 
addSpinner();
addcss(config.url + '/styles/bookmarklet.css', function(){
 loadRequest();//Fire the request
});
