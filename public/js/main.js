$(function() {
    // Stuff to do as soon as the DOM is ready;

    var socket = io.connect('http://192.168.1.20:1234');
    camera.socket = socket;

    var users = [];

    socket.on('connect',function() {
        //socket.emit('new',{hello:'world'});
        //socket.emit('set nickname', prompt('What is your nickname?'));
        camera.init();

    });
    
    socket.on('userCount',function(data) {
        console.log('userCount::',data.count);
        setInterval(function(){
            if(data.userCount != camera.count){
                camera.userCount = data.count;
                camera.displayUsersStreams();
            }
        },1000);
    });

    socket.on('users',function(data){
        console.log(data);
    });
    
    socket.on('ready', function () {
        console.log('Connected !');
        //socket.emit('msg', prompt('What is your message?'));
    });
    
    socket.on('message', function (message) {
        console.log(message);
    });

    socket.on('userStream', function (data) {
        camera.socketStoreStreams(data);
    });

});