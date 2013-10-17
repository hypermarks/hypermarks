'use strict';

function hypermarks() {
  var login, success, overlay, overlayHtml, successHtml, loginHtml, errorHtml;



  overlayHtml = '<style> .hypermarks_overlay { line-height: 1 !important; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif !important; font-size: 16px !important; color: #333 !important; position: fixed; z-index: 99999; width: 100%; height: 100%; top: 0; left: 0; text-align: center; background-color: rgba(0, 0, 0, 0.5); -webkit-transition: background-color 1s ease; -moz-transition: background-color 1s ease; -o-transition: background-color 1s ease; -ms-transition: background-color 1s ease; transition: background-color 1s ease; } .hypermarks_overlay a { color: #006bcf; text-decoration: underline; } .hypermarks_overlay a:visited { color: #7c0090; } .hypermarks_overlay ._flash { color: #7c0090; -webkit-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); -moz-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); -o-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); -ms-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); background: #fff; padding: 1em; margin-top: 10%; display: inline-block; position: relative; -webkit-transition: opacity 2s ease; -moz-transition: opacity 2s ease; -o-transition: opacity 2s ease; -ms-transition: opacity 2s ease; transition: opacity 2s ease; } .hypermarks_overlay ._flash ._title { font-size: 48px; } .hypermarks_overlay ._flash ._subtitle { font-size: 24px; } .hypermarks_overlay._fade { background-color: rgba(255, 255, 255, 0.1); } .hypermarks_overlay._fade ._flash { opacity: 0; } .hypermarks_overlay ._modal { -webkit-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); -moz-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); -o-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); -ms-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.2); background: #fff; padding: 1em; margin-top: 10%; display: inline-block; position: relative; } .hypermarks_overlay ._modal ._close { cursor: pointer; position: absolute; top: -0.5em; right: -0.5em; width: 1.5em; height: 1.5em; line-height: 1.5em !important; -webkit-border-radius: 50%; -moz-border-radius: 50%; -o-border-radius: 50%; -ms-border-radius: 50%; border-radius: 50%; background: #fff; -webkit-box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2); -moz-box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2); -o-box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2); -ms-box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2); box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2); } </style> <div class="hypermarks_overlay"></div>';
 
  successHtml = '<div class="_flash"><div class="_title">Hypermarked!</div><div class="_subtitle">hypermarks.org</div></div>';

  loginHtml = '<div class="_modal"><div>You need to sign in to use Hypermarks. <br>&nbsp;</div><a href="http://localhost:1337/_auth/login">Click here to sign in</a></div>';

  errorHtml = '<div class="_modal">Uh oh</div>';


  overlay = function () {
    var overlay = document.createElement(overlayHtml);
    document.body.appendChild(overlay);
  };

  success = function () {
    var success_flash = document.createElement(successHtml);
    var hypermarks_overlay = document.getElementById('hypermarks_overlay');
    hypermarks_overlay.appendChild(success_flash);
    // setTimeout(function(){ $success_flash('_fade'); }, 100);
    setTimeout(function(){ hypermarks_overlay.innerHTML(''); }, 1000);
  };

  login = function () {
    login = document.createElement(loginHtml);
    var hypermarks_overlay = document.getElementById('hypermarks_overlay');
    hypermarks_overlay.appendChild(login);
  };

  return {
    loadRequest: function () {
      console.log('loadRequest');
      overlay();
      var img = new Image();
      
      img.onload = function(){
        success();
      };

      img.onerror = function(){
        login();
      };

      img.src = 'http://localhost:1337/_api/post?url=' + window.location.href;
    }
  };
}

var hypermarksClosure = hypermarks();

hypermarksClosure.loadRequest(); //Fire the request
