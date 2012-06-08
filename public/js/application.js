
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
	videoStreams:[],

	// Methods
	init:function(){
		var _ = this;

		if(navigator.webkitGetUserMedia || navigator.getUserMedia){
			_.canStream = true;
			_.getUserMedia();
			$('#self').show();
			$('#friend').show();
		}else{
			_.canStream = false;
			$('#friend').show();
		}
	},

	// Start Own Webcam
	getUserMedia:function(){
		var _ = this;
		console.log('canStream:',this.canStream);
		navigator.webkitGetUserMedia({'video':true},function(stream){
			this.canStream = true;
			if (navigator.webkitGetUserMedia) {
				var video = $('#self');
				var blobUrl = window.webkitURL.createObjectURL(stream);
      			video.attr('src',blobUrl);
      			video.controls = false;
      			_.selfVideo = blobUrl;
      			_.socketBroadcastStream(blobUrl);
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
			console.log('stream:', videoStream.stream);
			var friendVideo = $('#friend');
			friendVideo.attr('src',videoStream.stream);
			console.log(friendVideo);
		});
	},

	// Socket Methods
	socketBroadcastStream:function(blob){
		var _ = this;
		_.socket.emit('stream',blob);
	},

	socketStoreStreams:function(data){
		var _ = this;
		_.videoStreams.push(data);
		console.log(_.videoStreams);
	},

	socketEmit:function(){},
	socketOn:function(){},
	socketBroadcast:function(){},
	socketSend:function(){}

}