// Импорты
const { logs } = require('@utils/logs');

// Запрос на создание приглашения в телеграмм канале
const inviteRequest = async (ctx) => {
    try {
        // Создаём инвайт
        const { invite_link } = await ctx.telegram.createChatInviteLink(
            // ID группы
            process.env.TELEGRAM_GROUP_ID,
            // Опции создания инвайта
            {
                expiration_date: 0, // Срок работы инвайта
                creates_join_request: true, // Подтверждение инвайта
            }
        );

        return invite_link;
    } catch (e) {
        logs('🟥 <b>ERROR:</b> Не удалось получить ссылку приглашения', e);
    }
}

module.exports = { inviteRequest }