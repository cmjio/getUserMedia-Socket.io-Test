
window.camera = {

	// Socket
	socket:null,
	// Elements
	videoElm: $('#live'),
	// Boolean Values
	canStream:false,
	// Variables
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
		_.socket.emit('sendingVideoStream', { video:_.selfVideo, requestedUser:userID });
	},

	// Socket Methods
	socketBroadcastStream:function(imageData){
		var _ = this;
		_.socket.emit('stream',imageData);
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