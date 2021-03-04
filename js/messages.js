define('messages',['handlebars'],function(handlebars){

	// Шаблон сообщения чата
	let messageChat = document.getElementById('messageChat').innerHTML;

	// Скомпилированный шаблон сообщения
	let messageChatCompile = handlebars.compile(messageChat);

	// Список сообщений чата
	let messagesList = document.querySelector('.right__list');

	// Кнопка отправить сообщение
	let sendButton = document.getElementById('sendMessage');

	// Поле с текстом сообщения
	let messageInput = document.getElementById('messageInput');

	return {
		messageChatCompile: messageChatCompile,
		messagesList: messagesList,
		messageInput: messageInput,
		sendButton: sendButton
	}
});