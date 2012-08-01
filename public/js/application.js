
window.camera = {

	// Socket
	socket:null,
	// Elements
	videoElm: $('#live'),
	// Boolean Values
	canStream:false,
	// Variables
	roomID:null,
	roomAccessCode:null,
	userID:null,
	userCount:0,
	selfVideo:null,
	selfStream:null,
	// Arrays
	videoStreams:[],

	// Methods
	init:function(){
		var _ = this;

		if(navigator.webkitGetUserMedia || navigator.getUserMedia){
			_.canStream = true;
			_.getUserMedia();
			$('#self').hide();
			$('#friend').show();
		}else{
			_.canStream = false;
			if(_.userCount > 1 && _.videoStreams.length > 0){
				$('#friend').show();
			}else{
				console.log('No users broadcasting');
			}
		}
	},

	getRoomID:function(){
		var ask = prompt('');
	},

	start:function(){
		var _ = this;
		$('#start').show();
		$('.room').hide();
	},

	generateRoomID:function(){
		//var _ = this;
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < 8; i++ )text += possible.charAt(Math.floor(Math.random() * possible.length));
	 	return text;
	},

	initCreateRoom:function(){
		var _ = this;
		_.roomID = _.generateRoomID();
		console.log('New Room is found at: ',_.roomID);
		var ask = prompt('Please type your desired public access code','');
		console.log('accessCode: ',ask);
		_.roomAccessCode = ask
				
		if(_.roomAccessCode !== null){
			// build room on server
			_.socket.emit('newRoom', { room:_.roomID, accessCode:_.roomAccessCode } );
		}
				
	},

	initJoinRoom:function(){
		var _ = this;
		$('#joinroom').show();
		$('#start').hide();
		
		$('#joinroom').find('button[type=submit]').click(function(){
			var roomID = $('#joinroom').find('input').val();
			console.log(roomID);
			if(roomID != null){
				_.socket.emit('checkRoomExists', roomID);
			}
		});
				
	},

	// Start Own Webcam
	getUserMedia:function(){
		var _ = this;
		navigator.webkitGetUserMedia({'video':true},function(stream){
			this.canStream = true;
			_.selfStream = stream;
			if (navigator.webkitGetUserMedia) {
				var video =  document.getElementById('self');
				var blobUrl = window.webkitURL.createObjectURL(stream);
      			video.src = blobUrl;
      			video.controls = false;

      			//webkitRequestAnimationFrame(draw);
      			setInterval(function(){
      				draw();
      			},100);

      			function draw(){
      				var canvas = document.getElementById('selfCanvas');
					var ctx = canvas.getContext('2d');
					ctx.drawImage(video, 0, 0, 155, 115);
					var stringData= canvas.toDataURL();
					_.selfVideo = stringData;
					_.socketBroadcastStream(stringData);
					//webkitRequestAnimationFrame(draw);
      			}

      			// _.selfVideo = blobUrl;
      			// _.socketBroadcastStream(blobUrl);
    		} else {
    			var video = $('#self');
     			video.src = stream; // Opera
     			video.controls = false;
    		}
		},function(err) {
            console.log("Unable to get video stream!");
            this.canStream = false;
        });
				
	},

	displayUsersStreams:function(){
		var _ = this;
		$.each(_.videoStreams,function(index, videoStream){
			//console.log('stream:', videoStream.stream);
			var friendVideo = $('#friend');
			friendVideo.attr('src',videoStream.stream);
			//console.log(friendVideo);
			setInterval(function(){
			//	console.log(friendVideo);
			},100);
		});
	},

	drawToCanvas:function(){
		console.log('variable_or_string');
				
		var _ = this;
		var video = document.getElementById('self');
		var canvas = document.getElementById('selfCanvas');
		var ctx = canvas.getContext('2d');
		ctx.drawImage(video, 0, 0, 155, 115);
		webkitRequestAnimationFrame(_.drawToCanvas);
		
	},

	requestingStreams:function(userID){
		var _ = this;
		console.log(userID+' requested stream');
		_.socket.emit('sendingVideoStream', { video:_.selfVideo, requestedUser:userID, room:_.roomID });
	},

	// Socket Methods
	socketBroadcastStream:function(imageData){
		var _ = this;
		_.socket.emit('stream',{data:imageData, room:_.roomID});
	},

	socketStoreStreams:function(data){
		var _ = this;
		_.videoStreams.push(data);
		// console.log(_.videoStreams);
	},

	socketEmit:function(){},
	socketOn:function(){},
	socketBroadcast:function(){},
	socketSend:function(){}

}