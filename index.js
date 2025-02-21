require('dotenv').config();
require('module-alias/register');

const { Scenes, session } = require('telegraf');
const { joinRequest } = require('@requests/joinRequest');
const { create } = require('@routes/create');
const { permission } = require('@utils/permission');
const telegram = require('@services/telegram');
const server = require('express')();

// Прослышуки и стадии
const stages = require('@config/stages');
const hears = require('@config/hears');

// Роут получения инвайта
server.get('/api/create', async (req, res) => {
	create(req, res);
});

// Если роут не существует
server.get('*', function (req, res) {
	res.status(403).send(`Ошибка дотупа.`);
});

// Логи
console.log('\x1b[34m%s\x1b[0m', '#ConversionTracker 1.0.0');
console.log('\x1b[34m%s\x1b[0m', 'Автор: @developer-samara-web\n');

// Запуск сервера
server.listen(process.env.EXPRESS_PORT, () => {
	console.log('EXPRESS.JS: \x1b[32m%s\x1b[0m', 'ACTIVE' )
});

// Инициализация стадий
const stage = new Scenes.Stage(stages);

// Сессии
telegram.use(session());
telegram.use(stage.middleware());
hears(telegram);

// Прослушка входа в чат
telegram.on('chat_join_request', async (ctx) => {
	await joinRequest(ctx);
});

// Приветствие
telegram.start(async (ctx) => {
	permission(ctx, 'start');
})

// Запуск бота
telegram.launch().then(
	console.log('TELEGRAF.JS: \x1b[32m%s\x1b[0m', 'ACTIVE' )
);