define('users',['handlebars'],function(handlebars){
	// Текущий токен зарегистрированного пользователя
	let userToken = "";

	// Имя текущего пользователя
	let userName = "";

	// Логин текущего пользователя
	let userLogin = "";

	// Поле с именем текущего пользователя
	let userTitle = document.querySelector('.left__profile-user');

	// Шаблон общего списка пользователей
	let usersList = document.getElementById('usersList').innerHTML;

	// Скомпилированный шаблон списка пользователя
	let usersListCompile = handlebars.compile(usersList);

	// Блок-обертка для списка пользователей
	let usersContent = document.querySelector('.left__content');

	return {
		userToken: userToken,
		userName: userName,
		userLogin: userLogin,
		userTitle: userTitle,
		usersListCompile: usersListCompile,
		usersContent: usersContent
	}
});