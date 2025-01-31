var socket = io();

var btn = document.getElementById("send");

btn.addEventListener("click", function() {
    socket.emit('message', 'Добре дошъл, приятел!');
});


