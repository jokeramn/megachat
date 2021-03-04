define('reg',function(){

	// Поле логин
	let regLogin = document.getElementById('regLogin');

	// Форма регистрации
	let regBlock = document.querySelector('.reg');

	// Блок блокиратор
	let blockerBlock = document.querySelector('.blocker');

	// Поле ФИО
	let regName = document.getElementById('regName');

	// Поле с ошибкой
	let regError = document.querySelector('.reg__error');

	// Регистрация в чате
	let regButton = document.querySelector('.reg__submit');

	// События валидации ввода для поля логина
	if(regLogin) {

		regLogin.addEventListener('input',function(event){
			let e = event||window.event;
			

			// спец. сочетания - не обрабатываем
			if (e.ctrlKey || e.altKey || e.metaKey) {
				return true;
			};

			let reg = new RegExp('^[A-Za-z0-9-_]', 'g');
			
			// Текущий вводимый символ
			let char = this.value.substr(-1);

			if(!char.match(reg)){
				this.value = this.value.replace(char,'');
			}
			
		});
	}

	return {
		regBlock: regBlock,
		blockerBlock: blockerBlock,
		regButton: regButton,
		regName: regName,
		regError: regError,
		regLogin: regLogin
	}
});