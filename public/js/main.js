$(function() {
    // Stuff to do as soon as the DOM is ready;

    var socket = io.connect('http://192.168.1.20:1234');
    camera.socket = socket;

    var users = [];
    var counter;

    socket.on('connect',function() {
        camera.init();

    });
    
    socket.on('userCount',function(data) {
        counter = data.count;
    });

    socket.on('requestingStreams',function(data){
        //console.log(data.requestingUser);
        if(camera.selfVideo != null){
            camera.requestingStreams(data.requestingUser);
        }else{
            console.log('sorry i am not broadcasting');
        }
    });

    socket.on('userStream', function (data) {
        camera.socketStoreStreams(data);
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