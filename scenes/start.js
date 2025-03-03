// Импорты
const { logs } = require('@utils/logs');
const { Markup, Scenes: { BaseScene } } = require('telegraf');
const { getInvitesCounter, getInvitesWorking } = require('@middlewars/inviteMiddlewar');
const { getUsersCounter, getUsersWorkingCounter, getUsersCompletedCounter, getUsersExpiredCounter } = require('@middlewars/userMiddlewar');

// Стартовая сцена
const start = new BaseScene('start');
module.exports = start.enter(async (ctx) => {
    try {
        // Получаем данные об приглашениях
        const all = await getInvitesCounter();
        const in_work = await getInvitesWorking();
        // Получаем данные об пользователях
        const users = await getUsersCounter();
        const working = await getUsersWorkingCounter();
        const completed = await getUsersCompletedCounter();
        const expired = await getUsersExpiredCounter();

        // Отправляем сообщение
        await ctx.replyWithHTML(`<b>❇️  Приглашения:</b>\n<b>В работе:</b> ${in_work} шт\n<b>Всего:</b> ${all} шт\n\n<b>❇️  Пользователи:</b>\n<b>Всего:</b> ${users} шт\n<b>В работе:</b> ${working} шт\n<b>Таймаут:</b> ${expired} шт\n<b>Завершенных:</b> ${completed} шт`, Markup.keyboard([
            ['🔹 Добавить инвайт'],
            ['🔹 Обновить статистику']
            // ['🔹 Обновить токен'],
        ]).resize().oneTime());
    } catch (e) {
        logs('🟥 <b>ERROR:</b> Что-то пошло не так', e);
    }
});