requirejs.config({
	paths: {
		handlebars: 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min'
	}
});

define(['handlebars','reg','users','profile','messages'],function(handlebars,reg,users,profile,messages){

	// Подключение handlebars helper
	handlebars.registerHelper('formatDate', function(ts) {
		return new Date(ts).toLocaleString();
	});

	// Регистрация и инициализация прослушки сообщений сервера
	reg.regButton.addEventListener('click',function(e){
		e.preventDefault();

		// Проверяем чтобы были заполнены поля ФИО и логин
		if(!reg.regName.value.trim()) {
			reg.regError.innerHTML = "Не заполнено поле ФИО";
			reg.regError.style.display = "block";
			return;
		}

		if(!reg.regLogin.value.trim()) {
			reg.regError.innerHTML = "Не заполнен логин";
			reg.regError.style.display = "block";
			return;
		}

		// Если ошибок нет, скрываем блок с ошибкой
		reg.regError.innerHTML = "";
		reg.regError.style.display = "none";

		// Создаем соединение с сервером
		let connection = new WebSocket('ws://localhost:5000');
		
		// Обработка ошибки соединения с сервером
		connection.onerror = function(e) {
			alert("Ошибка соединения с сервером");
		};

		// Событие передача сообщения на сервер
		messages.sendButton.addEventListener('click',function(e){
			e.preventDefault();

			// Проверка на пустое сообщение

			if(!messages.messageInput.value.trim()) {
				return;
			}

			// Объект с информацией об сообщении
			let newMessage = {"op":"message",
												"token":users.userToken,
												"data": {
													"body": messages.messageInput.value
												}};

			// Формируем JSON для отправки на сервер
			let newMessageJson = JSON.stringify(newMessage);
			connection.send(newMessageJson);

			// Очищаем поле после отправки сообщения
			messages.messageInput.value = "";
		
		});

		// Отправляем запрос на регистрацию
		connection.onopen = function(e) {
			// Формируем объект
			let newUser = {"op":"reg", 
										 "data": {
												"name": reg.regName.value,
												"login": reg.regLogin.value
										 }};

			// Формируем JSON для отправки на сервер
			let newUserJson = JSON.stringify(newUser);

			connection.send(newUserJson);
		}

		// Прослушка сообщения сервера
		connection.onmessage = function(e) {

			// Получаем ответ сервера
			let answerJson = e.data;

			// Если вернулся пустой ответ, ничего не делаем
			if (!answerJson) {
				return;
			}

			// Преобразуем ответ в объект
			let answerObj = JSON.parse(answerJson);

			// Устанавливаем тип ответа
			let answerType = answerObj['op'];

			// В зависимости от типа ответа проводим действия
			if (answerType == "error") {
				// Если такой пользователь уже есть

				// Сообщаем об ошибке в форму регистрации
				reg.regError.innerHTML = answerObj['error']['message'];
				reg.regError.style.display = "block";
				
			} else if (answerType == "token") {
				// Если регистрация прошла успешно

				// Скрываем форму
				reg.regBlock.style.display = "none";

				// И блок блокиратор
				reg.blockerBlock.style.display = "none";

				// Записываем токен текущего пользователя
				users.userToken = answerObj['token'];

				// Записываем имя текущего пользователя
				users.userName = reg.regName.value;

				// Записываем логин текущего пользователя
				users.userLogin = reg.regLogin.value;

				// Выводим в заголовок страницы имя текущего пользователя
				users.userTitle.innerHTML = "Добро пожаловать, "+users.userName+"!";

				// Список пользователей онлайн в чате
				let usersOnline = answerObj['users'];

				// Выводим список пользователей в чате
				let templateUsersList = users.usersListCompile({list: usersOnline});
				users.usersContent.innerHTML = templateUsersList;

				// Выводим последние сообщения из чата
				let lastMessages = answerObj['messages'];

				lastMessages.forEach(function(item){
					// Компилируем шаблон
					let templateMessageChat = messages.messageChatCompile({message: item});

					// Создаем новый элемент списка
					let newMessage = document.createElement('li');
					newMessage.classList.add('right__item','clearfix');
					newMessage.innerHTML = templateMessageChat;

					// Выводим сообщение
					messages.messagesList.appendChild(newMessage);
				});

			} else if (answerType == "user-enter") {
				// Если новый пользователь вошел в чат

				// Получаем элемент список пользователей
				let leftList = document.querySelector('.left__list');

				// Добавляем нового пользователя в список
				let userEnter = document.createElement('li');
				userEnter.classList.add('left__item');
				userEnter.innerHTML = answerObj['user']['name'];
				userEnter.setAttribute("id", answerObj['user']['login']);		
				leftList.appendChild(userEnter);

			} else if (answerType == "user-out") {
				// Если пользователь покинул чат

				// Удаляем элемент пользователя из списка пользователя			
				let userOut = document.querySelector('.left__item[data-list-user='+answerObj['user']['login']+']');
				userOut.remove();

			} else if (answerType == "message") {
				// Если новое сообщение в чате

				// Компилируем шаблон
				let templateMessageChat = messages.messageChatCompile({message: answerObj});

				// Создаем новый элемент списка
				let newMessage = document.createElement('li');
				newMessage.classList.add('right__item','clearfix');
				newMessage.innerHTML = templateMessageChat;

				// Выводим сообщение
				messages.messagesList.appendChild(newMessage);

			} else if (answerType == "user-change-photo") {
				// Если пользователь сменил аватар

				let xhr = new XMLHttpRequest();
				xhr.open('GET', 'http://localhost:5000/photos/'+answerObj['user']['login'], true);
				xhr.responseType = 'blob';
				xhr.send();

				xhr.onreadystatechange = function() {
					if (xhr.readyState != 4) {return};

						if (xhr.status = 200) {

							userProfileImg = "http://localhost:5000/photos/"+answerObj['user']['login']+"?"+Date.now();

							if(answerObj['user']['login'] == users.userLogin) { 	 						
								profile.profileAvatar.src = userProfileImg;
							}

							// Меняем изображение пользователя в существующих сообщениях чата
							let messageAvatar = document.querySelectorAll('.right__avatar-img[data-avatar='+answerObj['user']['login']+"-avatar");

							for(let i = 0; i < messageAvatar.length; i++) {
								messageAvatar[i].src = userProfileImg;
							}
						}
				}
			}
		}
	});
});