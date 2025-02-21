// Импорты
const { logs } = require('@utils/logs');
const { Scenes: { BaseScene } } = require('telegraf');

// Сцена ошибки доступа
const error = new BaseScene('error');
module.exports = error.enter(async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Ошибка доступа.</b>');
    } catch (e) {
        logs('🟥 <b>ERROR:</b> Что-то пошло не так' ,e);
    }
});