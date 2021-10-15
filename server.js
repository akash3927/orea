/** @format */

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const port = process.env.port || 3000;
const socketio = require('socket.io');
const io = socketio(server);
app.use(express.static(path.join(__dirname, 'public'))); //static path of folder

// app.get('/', (req, res) => {
// 	// res.send('hello world');
// 	// console.log('hello world');
// 	res.status(400).sendFile(path.join(__dirname, 'public', 'index.html'));
// });

server.listen(port, () => {
	console.log(`server is running on ${port}`);
});
