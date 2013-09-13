module.exports = "javascript:!function(){var jsCode=document.createElement('script');jsCode.setAttribute('src','http://localhost:1337/permanent/bookmarklet.js');document.body.appendChild(jsCode);}();"



if (!window.jQuery || confirm('Overwrite\x20current\x20version?\x20v' + jQuery.fn.jquery))(function(d, s) {
  s = d.createElement('script');
  s.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.js';
  (d.head || d.documentElement).appendChild(s)
})(document);

function() {
  var jsCode = document.createElement('script');
  jsCode.setAttribute('src', 'http://localhost:1337/permanent/bookmarklet.js');
  document.body.appendChild(jsCode);
}();