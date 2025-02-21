// Импорты
const { Telegraf } = require('telegraf');
// Получаем объект бота
const telegram = new Telegraf(process.env.TELEGRAM_TOKEN);

module.exports = telegram;