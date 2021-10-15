/** @format */

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const port = process.env.port || 3000;
const socketio = require('socket.io');
const io = socketio(server, {
	cors: {
		origin: '*',
	},
});
app.use(express.static(path.join(__dirname, 'public'))); //static path of folder

// app.get('/', (req, res) => {
// 	// res.send('hello world');
// 	// console.log('hello world');
// 	res.status(400).sendFile(path.join(__dirname, 'public', 'index.html'));
// })

//run when client connects

io.on('connection', (socket) => {
	// console.log('socket is working>>>>>');

	//for single client
	socket.emit('message', 'welcome to orea');

	//for everyone except the users connect
	socket.broadcast.emit('message', 'user has joined the chat');

	//for all the users
	//io.emit()

	//when client disconnects
	socket.on('disconnect', () => {
		io.emit('message', 'user left the chat');
	});

	//for chatmessages
	socket.on('chatMessage', (msg) => {
		io.emit('message', msg);
	});
});

server.listen(port, () => {
	console.log(`server is running on ${port}`);
});
