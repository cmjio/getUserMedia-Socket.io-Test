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

io.configure('production', function(){
  io.enable('browser client etag');
  io.set('log level', 1);

  io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
});

io.configure('development', function(){
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
 	io.set('transports', ['websocket']);
   	io.set('log level', 2);
   	io.set('log color', true);
});

var clients = {};
var rooms = {};

io.sockets.on('connection', function(socket){

	clients[socket.id] = socket;

	var userCount = 0;

	setInterval(function(){
		var newCount = io.sockets.clients().length;
			if(newCount != userCount){
				userCount = newCount;
				socket.emit('userCount',{count:userCount, roomList:rooms});
				//socket.emit('users',clients);
			}
	},1000);
	
	socket.on('newRoom',function(data){
		console.log(data);
		socket.set('room', data.room, function(){ 
			console.log('room ' + data.room + ' saved');
			rooms[data.room] = { roomID:data.room, accessCode:data.accessCode, creator:socket.id, created: new Date()  };
			console.log(rooms);
			socket.join(data.room);
			io.sockets.socket(socket.id).emit('roomCreated', { message:'Your room has been created', room:rooms[data.room] });
			socket.emit('roomList', { list:rooms });
		});
	});

	socket.on('userNotBroadcasting',function(data){
		io.sockets.socket(data).emit('apologyNoVideo', 'Sorry this user is not broadcasting.'); 
	});

	socket.on('checkRoomExsists',function(data){
		if( data in rooms){
			console.log('room exsists');
			socket.join(data);
			io.sockets.socket(socket.id).emit('roomExists', { message:'You have joined the requested room', room:rooms[data] });
			console.log(rooms[data]);
			
			if(io.sockets.clients().length > 1){
				socket.broadcast.in(data).emit('requestingStreams', {requestingUser:socket.id});
			}
		}else{
			// room does not exist
		}
	});



	socket.on('sendingVideoStream',function(data){
		io.sockets.socket(data.requestedUser).in(data.room).emit('watchMyStream', { stream:data.video, message:'here is my requested video stream', user:socket.id }); 
	});

  	socket.on('msg', function (data) {
    	socket.get('nickname', function (err, name) {
      		socket.broadcast.emit('message',{ user:name, message:data });
    	});
  	});

  	socket.on('stream',function(data){
  		//console.log(data);
  		socket.broadcast.emit('userStream', { stream:data, user:socket.id });
  		//io.sockets.in(data.room).emit('userStream', { stream:data.stream, user:socket.id });
  		//socket.broadcast.emit('userStream', { stream:data.data, user:socket.id });
  		io.sockets.in(data.room).emit('userStream', { stream:data.data, user:socket.id });
  	});

});