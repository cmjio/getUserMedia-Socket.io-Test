 var conn = io.connect('http://localhost:1234');
  conn.on('connect', function(){
		console.log('Connected');
	});

	conn.on('error', function (e) {
	  console.log('System', e ? e : 'A unknown error occurred');
	});

	conn.emit('message', 'wasssaaappp');

	conn.on('message', function(msg){
		console.log("Received Msg : "+msg);
	});

	conn.on("broadcast", function(msg){
		console.log("Broadcast Msg : "+msg);
	});

	conn.emit("setId","ChrisMJ");

	conn.on('disconnect', function(){
		console.log('Disconnected');
	});

	conn.send('Hello, Socket Server');