// Импорты
const { Scenes, Composer } = require('telegraf')
const { setInvite } = require('@controllers/inviteController')

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
        // Преобразуем текст в число
        const counter = parseInt(ctx.message.text, 10);
        // Проверяем, что число больше 0
        if (isNaN(counter) || counter <= 0) {
            await ctx.replyWithHTML(`🟥 <b>Некорректное значение.</b> Укажите положительное число.`);
            return ctx.scene.enter('start');
        }
        // Отправляем начальное сообщение
        let message = await ctx.replyWithHTML(`⏳ <b>Создаю инвайты:</b> 0 из ${counter}`);
        // Асинхронная функция для создания инвайтов с задержкой и обработкой ошибок
        const createInvitesWithDelay = async (ctx, counter, messageId) => {
            let successCount = 0; // Счетчик успешных созданий
            let delay = 5000; // Начальная задержка в 5 секунд

            for (let i = 1; i <= counter; i++) {
                try {
                    // Создаём один инвайт
                    const invite_link = await setInvite(ctx);

                    if (invite_link) {
                        successCount++; // Увеличиваем счетчик успешных созданий
                    } else {
                        throw new Error('Не удалось создать инвайт');
                    }

                    // Обновляем сообщение
                    await ctx.telegram.editMessageText(
                        ctx.chat.id,
                        messageId,
                        null,
                        `⏳ <b>Создаю инвайты:</b> ${i} из ${counter}`,
                        { parse_mode: 'HTML' }
                    );
                } catch (error) {
                    logs(`🟥 <b>ERROR:[createInvitesWithDelay]</b> Ошибка при создании инвайта №${i}`, error);

                    // Если ошибка flood control, увеличиваем задержку
                    if (error.message.includes('FLOOD_WAIT')) {
                        const match = error.message.match(/FLOOD_WAIT_(\d+)/);
                        if (match) {
                            const waitTime = parseInt(match[1], 10) * 1000; // Преобразуем секунды в миллисекунды
                            console.log(`🟥 Flood wait detected. Waiting for ${waitTime} milliseconds...`);
                            delay = Math.max(delay + waitTime, 10000); // Увеличиваем задержку
                            await new Promise((resolve) => setTimeout(resolve, waitTime));
                        }
                    }
                } finally {
                    // Добавляем задержку перед следующим созданием
                    if (i < counter) {
                        await new Promise((resolve) => setTimeout(resolve, delay));
                    }
                }
            }
            // Возвращаем количество успешно созданных инвайтов
            return successCount;
        };
        // Запускаем процесс создания инвайтов
        const totalSuccess = await createInvitesWithDelay(ctx, counter, message.message_id);
        // Отправляем финальное сообщение
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            message.message_id,
            null,
            `🟩 <b>Успех:</b> Создано ${totalSuccess} из ${counter}`,
            { parse_mode: 'HTML' }
        );
    } catch (error) {
        // Обработка ошибок
        await ctx.replyWithHTML(`🟥 <b>Ошибка:</b> ${error.message}`);
    } finally {
        // Переходим в начальную сцену
        ctx.scene.enter('start');
    }
})

const setInviteCounterScene = new Scenes.WizardScene('setInviteCounterWizard', getCodeInviteCounter, stageResultInviteCounter)
module.exports = setInviteCounterScene