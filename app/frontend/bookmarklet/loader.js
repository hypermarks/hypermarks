module.exports = function(url){
	return "javascript:!function(){var jsCode=document.createElement('script');jsCode.setAttribute('src','"+ url +"/_resources/bookmarklet.js');document.body.appendChild(jsCode);}();";
};