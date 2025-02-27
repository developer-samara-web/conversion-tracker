// Импорты
const { Scenes, Composer } = require('telegraf')
const { getOAuthToken } = require('@services/yandex');

// Получаем код
const getCode = new Composer()
getCode.on('text', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML(`<b>♻️ Для обновления токена укажите код.</b>\n\n1️⃣ <b>Перейдите по ссылке:</b> https://oauth.yandex.ru/authorize?response_type=code&client_id=${process.env.METRIKA_CLIENT_ID}&redirect_uri=https://ya.ru`)
        return ctx.wizard.next()
    } catch (error) {
        return ctx.scene.leave()
    }
})

// Получаем токен
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    try {
        const code = ctx.message.text
        const token = await getOAuthToken(code)

        // Проверка на ошибку
        if (token) {
            await ctx.replyWithHTML(token)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Ошибка обновления токена.</b>`)
        }

        return ctx.scene.leave()
    } catch (error) {
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('start')
    }
})

const refreshTokenScene = new Scenes.WizardScene('refreshTokenWizard', getCode, stageResult)
module.exports = refreshTokenScene