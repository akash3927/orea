/** @format */

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

//get username and room from url

const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

// console.log(username, room);

const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room });

socket.on('message', (message) => {
	console.log(message);

	outputMessage(message);

	//scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();
	//get message text
	const msg = e.target.elements.msg.value;
	//emit message to server
	socket.emit('chatMessage', msg);

	//clear input
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus;
});

function outputMessage(message) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
	<p class="text">
	    ${message.text}
	</p>`;
	document.querySelector('.chat-messages').appendChild(div);
}
