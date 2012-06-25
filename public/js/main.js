$(function() {
    // Stuff to do as soon as the DOM is ready;

    var socket = io.connect('http://192.168.0.4:1234');
    camera.socket = socket;

    $('#start').show();
    $('.room,#joinroom').hide();

    $('#start').find('#join').click(function(){
        camera.initJoinRoom();
    });

    $('#start').find('#create').click(function(){
        camera.initCreateRoom();
    });

    var users = [];
    var counter;

    socket.on('connect',function() {
        //camera.init();
        if(camera.roomID = null){
            camera.start();  
        }
    });
    
    socket.on('userCount',function(data) {
        counter = data.count;
    });

    socket.on('roomExists',function(data) {
        console.log(data.message,data.room);
        $('.room').show();
        $('#joinroom').hide();
        window.location.hash = '!/'+data.room.roomID;

    });

    socket.on('roomCreated',function(data) {
        console.log(data.message, data.room);
        $('#start, #joinroom').hide();
        $('.room').show();
        camera.init();
        window.location.hash = '!/'+data.room.roomID;
    });

    socket.on('requestingStreams',function(data){
        console.log('requesting user is: ',data.requestingUser);
        if(camera.selfVideo != null){
            camera.requestingStreams(data.requestingUser);
        }else{
            console.log('sorry i am not broadcasting');
            socket.emit('userNotBroadcasting',data.requestingUser);
        }
    });

    socket.on('userStream', function (data) {
        var friendVideo = $('#friend');
        friendVideo.attr('src',data.stream);
    });

    socket.on('roomList', function (data) {
        console.log(data.list);
    });

    socket.on('apologyNoVideo', function (data) {
        console.log(data);
    });

    socket.on('watchMyStream', function (data) {
        console.log(data.message);
        delete data.message;
        camera.videoStreams.push(data);
        camera.videoStreams[data.user] = data;
        $('.room').show();
        $('#joinroom').hide();
        $('#friend').show();
    });

    // Check for new users and show streams;
    setInterval(function(){
        if(counter != camera.userCount){
            camera.userCount = counter;
            camera.displayUsersStreams();
        }
        if(camera.videoStreams.length < 1){
            $('#friend').hide();
        }
    },1000);

});