module.exports = function(url){
	return "javascript:!function(){var jsCode=document.createElement('script');jsCode.setAttribute('src','"+ url +"/_resources/bookmarklet.js');document.body.appendChild(jsCode);}();";
	//Quick test if loading img directly in scriptlet is smart//return "javascript:!function(){img.onload=function(){}; img.onError=function(event){}; img.src = 'http://localhost:1337/_api/post?url='+window.location.href;}();";
};




  
  

  
  