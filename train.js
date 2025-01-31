const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const Simulation = require('./entities/server/Simulation');
const QLearing = require('./entities/RL/QLearning');
const RandomAgent = require('./entities/RL/RandomAgent');
const Board = require('./entities/server/Board');

const port = process.env.PORT || 3000;

var QL = new QLearing();
QL.stepSize = 10;

var sim = new Simulation(new Board(6), QL, QL, 1000);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/training/train.html');
  });
  app.get('/training/train.js', (req, res) => {
    res.sendFile(__dirname + '/training/train.js');
  });

//run when client connects
io.on('connection', socket => {
	console.log('New WS connection');

	// socket.emit('message', 'Добре дошъл, приятел!');

	// socket.broadcast.emit('message', 'Нов потребител дойде!');

	socket.on('message', (msg) => {
        console.log('message: ' + msg);
        sim.run();
        console.log(sim.getWinRatios());
        console.log(`QL explo: ${ QL.explorationRate}`);
        //console.log(QL);
        
      });

	// });

	socket.on('disconnect', () => {
		io.emit('message', 'Някой си тръгна!!!');
	});

});

server.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
    console.log(`http://localhost:${port}`);
  //console.log(authRoutes);
});