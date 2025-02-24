// Импорты
const { setInvite } = require('@controllers/inviteController');
const { permission } = require('@utils/permission');

// Подключаем кнопки
module.exports = telegram => {
    telegram.hears(['🔹 Добавить инвайт'], ctx => setInvite(ctx));
    telegram.hears(['🔹 Обновить токен'], ctx => permission(ctx, 'refreshTokenWizard'));
};