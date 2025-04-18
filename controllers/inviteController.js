// Импорты
const { logs } = require('@utils/logs');
const connectToDatabase = require('@services/mongoose');
const Invite = require('@models/Invite');

// Поиск приглашения по id пользователя
const getInvite = async (data, count) => {
    try {
        // Проверка данных
        if (!data) { throw new Error('data не заполнен') };
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем приглашение
        const invite = await Invite.findOne(data).populate({ path: 'user_id', model: 'User' });
        // Проверка данных
        if (!invite) { return null };
        // Отправляем данные
        return invite;
    } catch (e) {
        logs('🟥 <b>ERROR:[getInvite]</b> Не удалось получить приглашение', e);
    }
}

// Создание нового приглашения
const setInvite = async (ctx) => {
    const { inviteRequest } = require('@requests/inviteRequest');

    try {
        // Создаём инвайт
        const invite_link = await inviteRequest(ctx);
        // Подключаемся к базе
        await connectToDatabase();
        // Создаём новый инвайт
        const invite = new Invite({ date: new Date(), user_id: null, href: invite_link });
        // Сохраняем в базе
        await invite.save();
        // Проверка данных
        if (!invite) { return null };
        // Отправляем данные
        return invite_link;
    } catch (e) {
        logs('🟥 <b>ERROR:[setInvite]</b> Не удалось создать приглашение', e);
    }
}

// Обновление данных пользователя у приглашения
const updateInvite = async (id, userId) => {
    try {
        // Проверка данных
        if (!id) { throw new Error('id не заполнен') };
        // Подключаемся к базе
        await connectToDatabase();
        // Создаём новый инвайт
        const invite = await Invite.findByIdAndUpdate(id, { user_id: userId ? userId : null }, { new: true });
        // Проверка данных
        if (!invite) { return null };
        // Отправляем данные
        return invite;
    } catch (e) {
        logs('🟥 <b>ERROR:[updateInvite]</b> Не удалось обновить приглашение', e);
    }
}

const findInvites = async (data) => {
    try {
        // Проверка данных
        if (!data) { throw new Error('data не заполнен') };
        // Подключаемся к базе
        await connectToDatabase();
        // Найдите объект Invite по полю href
        const invite = await Invite.find(data);
        // Проверка данных
        if (!invite) { return null };
        // Отправляем данные
        return invite;
    } catch (e) {
        logs('🟥 <b>ERROR:[findInvites]</b> Не удалось найти приглашения', e);
    }
}

module.exports = {
    getInvite,
    setInvite,
    findInvites,
    updateInvite
};