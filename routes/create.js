// Импорты
const { logs } = require('@utils/logs');
const { setUser, getUser } = require('@controllers/userController');
const { getInvite, updateInvite} = require('@controllers/inviteController');

// Роут создания приглашения
const create = async (req, res) => {
	try {
		// Получаем id пользователя
		const { clientId } = req.query;
		// Проверка на существование
		const findUser = await getUser(clientId);

		if (!findUser) {
			// Получаем свободный инвайт
			const { _id, href } = await getInvite({ user_id: null });
			// Создаём нового юзера
			const user = await setUser(clientId, _id);
			// Резервируем инватй за юзером
			await updateInvite(_id, user._id);
			// Отдаём инвайт в ответе
			res.status(200).send(href);
		} else {
			res.status(200).send(findUser.invite.href);
		}
	} catch (e) {
		res.status(400).send(`Не удалось отправить приглашение.`);
		logs('🟥 <b>ERROR:</b> Не удалось отправить приглашение', e);
	}
}

module.exports = { create }