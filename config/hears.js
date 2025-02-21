// Импорты
const { setInvite } = require('@controllers/inviteController');

// Подключаем кнопки
module.exports = telegram => {
    telegram.hears(['🔹 Добавить инвайт'], ctx => setInvite(ctx));
};