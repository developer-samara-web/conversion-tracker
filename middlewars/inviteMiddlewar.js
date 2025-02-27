//Импорты
const { logs } = require('@utils/logs');
const { findInvites } = require('@controllers/inviteController');

// Получаем общее кол-во приглашений
const getInvitesCounter = async () => {
    try {
        // Получаем приглашение
        const invite = await findInvites({ user_id: null });
        // Проверка данных
        if (!invite.length) { return 0 };
        // Отправляем данные
        return invite.length;
    } catch (e) {
        logs('🟥 <b>ERROR:[getInvitesCounter]</b> Не удалось получить число приглашений', e);
    }
}

// Получаем кол-во приглашений в работе
const getInvitesWorking = async () => {
    try {
        // Получаем приглашения
        const invite = await findInvites({ user_id: { $ne: null } });
        // Проверка данных
        if (!invite.length) { return 0 };
        // Отправляем данные
        return invite.length;
    } catch (e) {
        logs('🟥 <b>ERROR:[getInvitesWorking]</b> Не удалось получить число приглашений в работе', e);
    }
}

module.exports = {
    getInvitesCounter,
    getInvitesWorking
}