var url = require("url");
var express = require('express');

var http = require("http"),
	 io = require("socket.io"),
	 server = express.createServer();

server.configure(function () {
  server.use(express.static(__dirname + '/public'));
});

server.get('/', function (req, res) {
  res.render('index', { layout: false });
});

server.listen(1234, function(){
	var addr = server.address();
	console.log('app listening on http://' + addr.address + ':' + addr.port);
});	 

var io = io.listen(server);

var clients = {};

io.sockets.on('connection', function(socket){

	clients[socket.id] = socket;

	var userCount = 0;

	setInterval(function(){
		var newCount = io.sockets.clients().length;
			if(newCount != userCount){
				userCount = newCount;
				socket.emit('userCount',{count:userCount});
				//socket.emit('users',clients);
			}
	},1000);

	if(clients.length > 1){
		socket.broadcast.emit('requestingStreams', {requestingUser:socket.id});
	}
	
	socket.on('new',function(data){
		socket.broadcast.emit('new user connected');
	});

	socket.on('set nickname', function (name) {
   		socket.set('nickname', name, function () { 
   			socket.emit('ready');
   		});
  	});

  	socket.on('msg', function (data) {
    	socket.get('nickname', function (err, name) {
      		socket.broadcast.emit('message',{ user:name, message:data });
    	});
  	});

  	socket.on('stream',function(data){
  		socket.broadcast.emit('userStream', { stream:data, user:socket.id });
  	});

});