//Импорты
const { logs } = require('@utils/logs');
const { getUsers } = require('@controllers/userController');

// Получаем общее кол-во приглашений
const getUsersCounter = async () => {
    try {
        // Получаем пользователей
        const users = await getUsers({});
        // Проверка данных
        if (!users.length) { return 0 };
        // Отправляем данные
        return users.length;
    } catch (e) {
        logs('🟥 <b>ERROR:[getUsersCounter]</b> Не удалось получить число пользователей', e);
    }
}

// Получаем кол-во завершенных пользователей
const getUsersCompletedCounter = async () => {
    try {
        // Получаем пользователей
        const users = await getUsers({status: 'completed'});
        // Проверка данных
        if (!users.length) { return 0 };
        // Отправляем данные
        return users.length;
    } catch (e) {
        logs('🟥 <b>ERROR:[getUsersCompletedCounter]</b> Не удалось получить число пользователей', e);
    }
}

// Получаем кол-во пользователей в работе
const getUsersWorkingCounter = async () => {
    try {
        // Получаем пользователей
        const users = await getUsers({status: 'pending'});
        // Проверка данных
        if (!users.length) { return 0 };
        // Отправляем данные
        return users.length;
    } catch (e) {
        logs('🟥 <b>ERROR:[getUsersWorkingCounter]</b> Не удалось получить число пользователей', e);
    }
}

// Получаем кол-во пользователей истекших срок действия инвайта
const getUsersExpiredCounter = async () => {
    try {
        // Получаем пользователей
        const users = await getUsers({status: 'expired'});
        // Проверка данных
        if (!users.length) { return 0 };
        // Отправляем данные
        return users.length;
    } catch (e) {
        logs('🟥 <b>ERROR:[getUsersExpiredCounter]</b> Не удалось получить число пользователей', e);
    }
}

module.exports = {
    getUsersCounter,
    getUsersWorkingCounter,
    getUsersCompletedCounter,
    getUsersExpiredCounter,
}