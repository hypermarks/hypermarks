var serverOptions = {
  hosts: [{
    host: 'localhost',
    port: 9200
  }]
};
ElasticSearchClient = require('elasticsearchclient');
var elasticSearchClient = new ElasticSearchClient(serverOptions);
var elasticSearchMain;



/*!
 * Module dependencies.
 */




exports.index = function(req, res) {

  // elasticSearchMain("trying", function(err, results) {

  //   res.render('home', {
  //     title: 'Home',
  //     results: results
  //   });


  // });

  res.render('home', {
      results: globalResults
    });

};


exports.poster = function(req, res) {

  // elasticSearchMain("trying", function(err, results) {

  //   res.render('home', {
  //     title: 'Home',
  //     results: results
  //   });


  // });
  res.render('poster', {
      results: globalResults
    });

};



elasticSearchMain = function(query, cb) {


  var qryObj = {
    "query": {
      "term": {
        "message": query
      }
    }
  };

  elasticSearchClient.search('twitter', '', qryObj)
    .on('data', function(data) {

      cb(null, JSON.parse(data).hits.hits);

    })
    .on('done', function() {
      //always returns 0 right now


    })
    .on('error', function(error) {
      console.log(error);
    })
    .exec();


};


    globalResults = [
    {
      'favicon': 'false'
      , 'date_added': ''
      , 'title': 'Da Mystery of Chessboxing'
      , 'url': '#'
      , 'sani_url': 'wutang.com/discography/da-mystery-of-chessboxin'
      , 'excerpt': 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
    }
    , {
      'favicon': 'http://roots.cx/favicon.ico'
      , 'date_added': ''
      , 'title': 'Weird Times in the Gold Mines'
      , 'url': '#'
      , 'sani_url': 'doors.com/albums/wierd-times.html'
      , 'excerpt': 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'

    }
    , {
      'favicon': 'https://github.com/favicon.ico'
      , 'date_added': ''
      , 'title': 'Github - Shell script linter'
      , 'url': '#'
      , 'sani_url': 'github.com/staylor/UI-Toolbox'
      , 'excerpt': 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'

    }
    , {
      'favicon': 'false'
      , 'date_added': ''
      , 'title': 'Ufo Research'
      , 'url': '#'
      , 'sani_url': 'roswellufomuseum.com/research.html'
      , 'excerpt': 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'

    }
  ];
