var parse = require('../utils/parse.js');
var request = require('request');
var async = require('async');

async.detect(['file1','file2','file3'], 
	function(item, cb) {
		cb(true)		
	}, 
	function(result){
		console.log(result)
});

// request('http://expressjs.com/favicon.ico', function(error, response, body){
// 	console.log(response.statusCode);
// })

// parse.pageHarvest('expressjs.com', function(elements) {
// 	console.log(elements);
// })

