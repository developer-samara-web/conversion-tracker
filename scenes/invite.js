// Импорты
const { Scenes, Composer } = require('telegraf')
const { setInvites } = require('@controllers/inviteController')

// Получаем количество приглашений
const getCodeInviteCounter = new Composer()
getCodeInviteCounter.on('text', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML(`<b>♻️ Сколько приглашений вы хотите получить?</b>`)
        return ctx.wizard.next()
    } catch (error) {
        return ctx.scene.leave()
    }
})

// Отправляем код
const stageResultInviteCounter = new Composer()
stageResultInviteCounter.on('message', async (ctx) => {
    try {
        const counter = ctx.message.text
        const invite = await setInvites(ctx, counter)

        // Проверка на ошибку
        if (invite) {
            await ctx.replyWithHTML(`🟩 <b>Успешное создание инвайтов.</b>`)
        } else {
            await ctx.replyWithHTML(`🟥 <b>Ошибка обновления токена.</b>`)
        }

        return ctx.scene.leave()
    } catch (error) {
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('start')
    }
})

const setInviteCounterScene = new Scenes.WizardScene('setInviteCounterWizard', getCodeInviteCounter, stageResultInviteCounter)
module.exports = setInviteCounterScene