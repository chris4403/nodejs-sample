
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express',
    content : ''
  });
});

app.post('/', function(req, res){
  var content = req.body.content || '';
  res.render('index', {
    title: 'Express',
    content: content
  });
});

// atnd events api
app.get('/events', function(req, res){

  var http = require('http');
  var options = {
      host : 'api.atnd.org',
      port : 80,
      path : '/events/?format=json',
  };
  var result = {};
  http.get(options, function(response) {
    response.setEncoding('utf8');
    var json = "";
    response.on('data',function(d) {
        json += d;
    }).on('end',function() {
        result = JSON.parse(json);
        res.render('events', {
          title: 'atnd event results',
          total_events : result.results_available,
          events : result.events
        });
    });
  }).on('error',function(e) {
      console.log(e);
  });

});

app.get('/event', function(req, res) {
  var eventId = req.query.event_id;

  var http = require('http');
  var options = {
      host : 'api.atnd.org',
      port : 80,
      path : '/events/?format=json&event_id=' + eventId,
  };
  var result = {};
  http.get(options, function(response) {
    response.setEncoding('utf8');
    var json = "";
    response.on('data',function(d) {
        json += d;
    }).on('end',function() {
        result = JSON.parse(json);
        res.render('event', {
          title: 'atnd event',
          event : result.events[0]
        });
    });
  }).on('error',function(e) {
      console.log(e);
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
