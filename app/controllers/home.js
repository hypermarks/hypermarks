var serverOptions = {
    hosts:[
        {
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



exports.index = function (req, res) {

    elasticSearchMain("trying", function(err, results){

        res.render('home', {
            title: 'Home',
            results:results
        });


    });


  
};



elasticSearchMain=function(queary, cb){


   var qryObj = {
        "query" : {
            "term" : { "message" : queary }
        }
    };

    elasticSearchClient.search('twitter', '', qryObj)
        .on('data', function(data) {

            cb(null, JSON.parse(data).hits.hits);

        })
        .on('done', function(){
            //always returns 0 right now


        })
        .on('error', function(error){
            console.log(error);
        })
        .exec();


};