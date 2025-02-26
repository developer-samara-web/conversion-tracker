// Импорты
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Отправка лидов в Метрику
const conversionRequest = async (clientId) => {
    try {
        // Проверка на наличие переменных окружения
        if (!process.env.METRIKA_COUNTER_ID || !process.env.METRIKA_GOAL_ID || !process.env.METRIKA_OAUTH_TOKEN) {
            throw new Error('Не указаны необходимые переменные окружения.');
        }

        // Формирование CSV
        const csvData = [
            ['yclid', 'Target', 'DateTime'],
            [clientId, process.env.METRIKA_GOAL_ID, Math.floor(Date.now() / 1000)],
        ].map(row => row.join(',')).join('\n');

        // Запись CSV
        const filePath = './file.csv';
        fs.writeFileSync(filePath, csvData, 'utf8');

        // Проверка на наличие CSV
        if (!fs.existsSync(filePath)) {
            throw new Error('Файл CSV не был создан.');
        }

        // Формирование FormData
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath), { filename: 'file.csv' });

        // Отправка запроса
        const response = await axios.post(
            `https://api-metrika.yandex.net/management/v1/counter/${process.env.METRIKA_COUNTER_ID}/offline_conversions/upload?format=csv`,
            form,
            {
                headers: {
                    Authorization: `OAuth ${process.env.METRIKA_OAUTH_TOKEN}`,
                    ...form.getHeaders(),
                },
            }
        );

        // Удаление CSV
        fs.unlinkSync(filePath);

        // Проверка статуса ответа
        if (response.status === 200) {
            console.log('\x1b[32m%s\x1b[0m', `Пользователь (${clientId}) отправлен.`);
            return true;
        } else {
            console.log('\x1b[31m%s\x1b[0m', `Пользователь (${clientId}) не отправлен.`);
            console.error('Детали ошибки:', response.data);
            return false;
        }
    } catch (e) {
        console.error('🟥 ERROR: Не удалось отправить лид в метрику', e.response ? e.response.data : e);
    }
};


module.exports = { conversionRequest }