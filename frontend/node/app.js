
/**
 * Module dependencies.
 */

var express = require('express'),
	io = require('socket.io');
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
	res.sendfile('views/index.html'); // @todo rewrite index.html to jade-files
	
});


var socket = io.listen(app);
socket.on('connection', function(client){
	//var c = new ClientHandler(client);
	
	console.log("New client connected");
    
});


app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);