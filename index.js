require('dotenv').config();
require('module-alias/register');

// ExpressJS
const server = require('express')();
// TelegrafJS
const telegram = require('@services/telegram');
// Роуты
const create = require('@routes/create');

// Роут получения инвайта
server.get('/api/create', async (req, res) => {
	create(req, res, telegram)
});

// Если роут не существует
server.get('*', function (req, res) {
	res.status(403).send(`Ошибка дотупа.`)
});

console.log('Статус сервера:')

// Запуск сервера
server.listen(process.env.EXPRESS_PORT, () => {
	console.log(`API: [ OK ]`);
});

// Запуск бота
telegram.launch().then(
	console.log('BOT: [ OK ]')
);