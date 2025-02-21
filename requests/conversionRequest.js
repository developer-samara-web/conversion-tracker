// Импорты
const { logs } = require('@utils/logs');

// Отправка лидов в Метрику
const conversionRequest = async (clientId) => {
    try {
        await fetch(`https://api-metrika.yandex.net/management/v1/counter/${process.env.METRIKA_COUNTER_ID}/offline_conversions/upload`, {
            method: 'POST',
            // Заголовки запроса
            headers: {
                Authorization: `OAuth ${process.env.OAUTH_TOKEN}`,
                'Content-Type': 'application/json',
            },
            // Тело запроса
            body: {
                conversions: [
                    {
                        ClientID: clientId,
                        Target: process.env.METRIKA_GOAL_ID,
                        DateTime: Math.floor(Date.now() / 1000),
                    },
                ],
            },
        });
    } catch (e) {
        logs('🟥 <b>ERROR:</b> Не удалось отправить лид в метрику', e);
    }
}

module.exports = { conversionRequest }