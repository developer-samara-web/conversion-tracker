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
    } finally {
        ctx.scene.enter('start');
    }
}

// Создание нескольких приглашений
const setInvites = async (ctx, counter) => {
    const { inviteRequest } = require('@requests/inviteRequest');
    const invites = [];

    try {
        // Проверка данных
        if (counter <= 0) { throw new Error('Количество должно быть больше нуля') }
        // Подключаемся к базе данных
        await connectToDatabase();
        // Цикл для создания инвайтов
        for (let i = 0; i < counter; i++) {
            try {
                // Создаём инвайт
                const invite_link = await inviteRequest(ctx);
                // Создаём новый инвайт
                const invite = new Invite({
                    date: new Date(),
                    user_id: null,
                    href: invite_link,
                });
                // Сохраняем в базе
                await invite.save();
                // Проверка данных
                if (!invite) { throw new Error(`Не удалось сохранить инвайт №${i + 1}`) }
                // Добавляем ссылку в массив
                invites.push(invite_link);
            } catch (e) {
                logs(`🟥 <b>ERROR:[setInvites] Не удалось создать инвайт №${i + 1}</b>`, e);
            }
        }
        // Отправляем данные
        return invites;
    } catch (e) {
        logs('🟥 <b>ERROR:[setInvites]</b> Ошибка при создании инвайтов', e);
        return null;
    }
};

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
    setInvites,
    findInvites,
    updateInvite
};