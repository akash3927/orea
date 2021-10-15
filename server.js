/** @format */

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const port = process.env.port || 3000;
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
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
const botName = 'Orea Bot';
io.on('connection', (socket) => {
	// console.log('socket is working>>>>>');

	socket.on('joinRoom', ({ username, room }) => {
		//for single client
		socket.emit('message', formatMessage(botName, 'welcome to orea'));

		//for everyone except the users connect
		socket.broadcast.emit(
			'message',
			formatMessage(botName, 'user has joined the chat'),
		);
	});

	//for all the users
	//io.emit()

	//when client disconnects

	//for chatmessages
	socket.on('chatMessage', (msg) => {
		io.emit('message', formatMessage('USER', msg));
	});
	socket.on('disconnect', () => {
		io.emit('message', formatMessage(botName, 'user left the chat'));
	});
});

server.listen(port, () => {
	console.log(`server is running on ${port}`);
});
