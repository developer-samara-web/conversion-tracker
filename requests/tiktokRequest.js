// Импорты
const axios = require('axios');

// Отправка лидов в Метрику
const tiktokRequest = async (clientId) => {
    try {
        const response = await axios.post(
            `https://business-api.tiktok.com/open_api/v1.3/pixel/track/`,
            {
                pixel_code: process.env.TIKTOK_PIXEL,
                event: 'CompletePayment',
                data: [{
                    event: "CompletePayment",
                    event_id: clientId, // Уникальный ID события
                    timestamp: new Date().toISOString(),
                }],
            },
            {
                headers: {
                    'Access-Token': process.env.TIKTOK_TOKEN,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Проверка статуса ответа
        if (response.data?.message === 'OK') {
            console.log('\x1b[32m%s\x1b[0m', `Пользователь (${clientId}) отправлен в TikTok.`);
            return true;
        } else {
            console.log('\x1b[31m%s\x1b[0m', `Пользователь (${clientId}) не отправлен в TikTok.`);
            return false;
        }
    } catch (error) {
        console.error('🟥 ERROR: Не удалось отправить лид в TikTok', error.response ? error.response.data : error);
        return false;
    }
};


module.exports = { tiktokRequest }