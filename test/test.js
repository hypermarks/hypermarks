'use strict';

var parse = require('../logic/parse.js');
var server = require('./test-server.js');
var test = require('tape');
var request = require('request');


test('test server works', function(t) {
	t.plan(1);
	
	server.httpServe(
		function() {
			server.setOptions({'html': 'crunk'});
			request('http://localhost:7357/', function(error, response, body) {
				t.equal(body, 'crunk', 'correct body');
			});
		}
	);
	
});


//TODO: REFACTOR THESE TO ALL BE INSIDE ONE TEST
test('throws error for bad url', function(t) {
	t.plan(1);
	parse.pageHarvest('gibberish', function(error) {
		t.true(error);
	});
});

test('finds favicon type 1', function(t) {
	t.plan(1);

	server.setOptions({'html': '<html><head><link rel="icon" href="/favicon.ico" /></head><body></body></html>'},
		parse.pageHarvest('localhost:7357', function(error, page) {
			t.equal(page.favi_url, 'http://localhost:7357/favicon.ico', 'correct url');
		})
	);
});

test('finds favicon type 2', function(t) {
	t.plan(1);

	server.setOptions({'html': '<html><head><link rel="shortcut icon" href="/favicon.ico" /></head><body></body></html>'},
		parse.pageHarvest('localhost:7357', function(error, page) {
			t.equal(page.favi_url, 'http://localhost:7357/favicon.ico', 'correct url');
		})
	);
});

test('finds favicon in root', function(t) {
	t.plan(1);

	server.setOptions({'html': '<html><head></head><body></body></html>'},
		parse.pageHarvest('localhost:7357', function(error, page) {
			t.equal(page.favi_url, 'http://localhost:7357/favicon.ico', 'correct url');
		})
	);
});

test('deals with incorrect favicon link', function(t) {
	t.plan(1);

	server.setOptions({'html': '<html><head><link rel="icon" href="/no_file_here.ico" /><link rel="shortcut icon" href="/favicon.ico" /></head><body></body></html>'},
		parse.pageHarvest('localhost:7357', function(error, page) {
			t.equal(page.favi_url, 'http://localhost:7357/favicon.ico', 'correct url');
		})
	);
});

test('deals with no favicon, plus incorrect link', function(t) {
	t.plan(1);

	server.setOptions({'html': '<html><head><link rel="icon" href="/no_file_here.ico" /><link rel="shortcut icon" href="/favicon.ico" /></head><body></body></html>', 'no_favicon': true},
		parse.pageHarvest('localhost:7357', function(error, page) {
			t.equal(page.favi_url, false, 'no url');
		})
	);
});

test('gets correct content', function(t) {
	t.plan(1);

	server.setOptions({'html': '<html><head></head><body><p>crunk</p></body></html>', 'no_favicon': true},
		parse.pageHarvest('localhost:7357', function(error, page) {
			t.equal(page.content, 'crunk', 'correct content');
		})
	);
});

test('gets correct title', function(t) {
	t.plan(1);

	server.setOptions({'html': '<html><head><title>crunk</title></head><body></body></html>', 'no_favicon': true},
		parse.pageHarvest('localhost:7357', function(error, page) {
			t.equal(page.title, 'crunk', 'correct title');
		})
	);
});
