// Импорты
const { setInvite } = require('@controllers/inviteController');
const { permission } = require('@utils/permission');
const { conversionRequest } = require('@requests/conversionRequest');
const { getOAuthToken } = require('@services/yandex');

// Подключаем кнопки
module.exports = telegram => {
    telegram.hears(['🔹 Добавить инвайт'], ctx => setInvite(ctx));
    telegram.hears(['🔹 Тест api'], ctx => conversionRequest('173996931575869853'));
    telegram.hears(['🔹 Обновить токен'], ctx => permission(ctx, 'refreshTokenWizard'));
};