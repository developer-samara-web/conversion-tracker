// Импорты
const { logs } = require('@utils/logs');
const connectToDatabase = require('@services/mongoose');
const Invite = require('@models/Invite');
const User = require('@models/User');

// Получаем пользователя по clientId
const getUser = async (clientId) => {
    try {
        // Проверка данных
        if (!clientId) { throw new Error('clientId не заполнен') };
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем инвайт
        const user = await User.findOne({ client_id: clientId }).populate({ path: 'invite', model: 'Invite' });
        // Проверка данных
        if (!user) { return null };
        // Отправляем данные
        return user;
    } catch (e) {
        logs('🟥 <b>ERROR:[getUser]</b> Не удалось получить пользователя', e);
    }
}

// Получаем всех пользователей
const getUsers = async (data) => {
    try {
        // Проверка данных
        if (!data) { throw new Error('data не заполнен') };
        // Подключаемся к базе
        await connectToDatabase();
        // Получаем пользователей
        const users = await User.find(data).populate({ path: 'invite', model: 'Invite' });
        // Проверка данных
        if (!users) { return 0 };
        // Отправляем данные
        return users.length;
    } catch (e) {
        logs('🟥 <b>ERROR:[getUsers]</b> Не удалось получить пользователей', e);
    }
}

// Создаём нового пользователя
const setUser = async (clientId, inviteId, clientType) => {
    try {
        // Проверка данных
        if (!clientId) { throw new Error('clientId не заполнен') };
        // Подключаемся к базе
        await connectToDatabase();
        // Создаём нового пользователя
        const user = new User({ 
            date: new Date(), 
            client_id: clientId,
            client_type: clientType,
            invite: inviteId
        });
        // Сохраняем в базе
        await user.save();
        // Проверка данных
        if (!user) { return null };
        // Отправляем данные
        return user;
    } catch (e) {
        logs('🟥 <b>ERROR:[setUser]</b> Не удалось создать пользователя', e);
    }
}

// Обновляем данные пользователя
const updateUser = async (id, updateData) => {
    try {
        // Проверка данных
        if (!id) { throw new Error('idUser не заполнен') };
        // Подключаемся к базе
        await connectToDatabase();
        // Обновляем пользователя
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        // Проверка данных
        if (!user) { return null };
        // Отправляем данные
        return user;
    } catch (e) {
        logs('🟥 <b>ERROR:[updateUser]</b> Не удалось обновить пользователя', e);
    }
}

// Поиск пользователя по href
const findUser = async (href) => {
    try {
        // Проверка данных
        if (!href) { throw new Error('href не заполнен') };
        // Подключаемся к базе
        await connectToDatabase();
        // Найдите объект Invite по полю href
        const invite = await Invite.findOne({ href });
        // Если такого инвайта нет
        if (!invite) { return null };
        // Найдите пользователя, связанный с этим Invite
        const user = await User.findOne({ invite: invite._id }).populate('invite');
        // Проверка данных
        if (!user) { return null };
        // Отправляем данные
        return user;
    } catch (e) {
        logs('🟥 <b>ERROR:[findUser]</b> Не удалось найти пользователя', e);
    }
}

module.exports = {
    getUser,
    findUser,
    setUser,
    updateUser,
    getUsers
}