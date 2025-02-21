// Импорты
const { logs } = require('@utils/logs');
const { Markup, Scenes: { BaseScene } } = require('telegraf');
const { getInvitesCounter, getInvitesWorking } = require('@middlewars/inviteMiddlewar');

// Стартовая сцена
const start = new BaseScene('start');
module.exports = start.enter(async (ctx) => {
    try {
        // Получаем данные об приглашениях
        const all = await getInvitesCounter();
        const in_work = await getInvitesWorking();

        // Отправляем сообщение
        await ctx.replyWithHTML(`<b>❇️  Управление инвайтами</b>\n\n<b>В работе:</b> ${in_work} шт\n<b>Всего инвайтов:</b> ${all} / 1000 шт`, Markup.keyboard([
            ['🔹 Добавить инвайт'],
            ['🔹 Скачать логи']
        ]).resize().oneTime());
    } catch (e) {
        logs('🟥 <b>ERROR:</b> Что-то пошло не так', e);
    }
});