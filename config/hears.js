// Импорты
const { setInvite } = require('@controllers/inviteController');
const { permission } = require('@utils/permission');

// Подключаем кнопки
module.exports = telegram => {
    telegram.hears(['🔹 Добавить инвайт'], ctx => setInvite(ctx));
    telegram.hears(['🔹 Обновить статистику'], ctx => permission(ctx, 'start'));
    telegram.hears(['🔹 Назад'], ctx => permission(ctx, 'start'));
};