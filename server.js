/** @format */

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const port = process.env.port || 3000;
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
	userJoin,
	getCurrentUser,
	getRoomUsers,
	userLeave,
} = require('./utils/users');
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
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		//for single client
		socket.emit('message', formatMessage(botName, 'welcome to orea'));

		//for everyone except the users connect
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(botName, `${user.username} has joined the chat`),
			);
		//send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	//for all the users
	//io.emit()

	//when client disconnects

	//for chatmessages
	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});
	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit(
				'message',
				formatMessage(botName, `${user.username} left the chat`),
			);
			//send users and room info
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});
});

server.listen(port, () => {
	console.log(`server is running on ${port}`);
});
