$(function() {
	// Stuff to do as soon as the DOM is ready;

	var socket = io.connect('http://localhost:1234');
	var users = [];

	socket.on('connect',function() {
    	socket.emit('new',{hello:'world'});
    	socket.emit('set nickname', prompt('What is your nickname?'));
  	});

	socket.on('userCount',function(data) {
    	console.log('userCount::',data.count);
  	});

  	socket.on('ready', function () {
      console.log('Connected !');
      socket.emit('msg', prompt('What is your message?'));
    });
    
    socket.on('message', function (message) {
      console.log(message);
    });


});