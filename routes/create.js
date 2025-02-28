// Импорты
const { logs } = require('@utils/logs');
const { setUser, getUser, updateUser } = require('@controllers/userController');
const { getInvite, updateInvite } = require('@controllers/inviteController');

// Роут создания приглашения
const create = async (req, res) => {
	try {
		// Получаем id пользователя
		const { clientId } = req.query;

		// Проверка данных
        if (!clientId) { throw new Error('clientId не заполнен. Отправлен общий инвайт') };

		// Проверяем, существует ли пользователь
		const findUser = await getUser(clientId);

		if (findUser) {
			// Если пользователь существует
			if (findUser.invite?.href) {
				// Если у пользователя уже есть инвайт, возвращаем его
				res.status(200).json({ data: findUser.invite.href });
			} else {
				// Если инвайта нет, резервируем новый
				const { _id, href } = await getInvite({ user_id: null });

				// Обновляем данные пользователя
				await updateUser(findUser._id, { invite: _id, status: 'pending' });

				// Резервируем инвайт за пользователем
				await updateInvite(_id, findUser._id);

				// Отменяем бронь через 2 минуты
				setTimeout(async () => {
					const user = await getUser(clientId);
					if (user.status === 'completed') return;
					// Очищаем инвайт
					await updateInvite(_id, null);
					await updateUser(user._id, { invite: null, status: 'expired' });
					logs(`🟨 <b>INFO:[createRoute]</b> ${user._id} не подписался вовремя.`);
				}, process.env.TELEGRAM_INVITE_TIME);

				// Отдаём инвайт в ответе
				res.status(200).json({ data: href })
			}
		} else {
			// Если пользователя нет, запрашиваем инвайт
			const { _id, href } = await getInvite({ user_id: null });
			// Создаём нового пользователя
			const user = await setUser(clientId, _id);
			if (!user) { logs(`🟨 <b>INFO:[createRoute]</b> Не указан id пользователя`); }
			// Резервируем инвайт за пользователем
			await updateInvite(_id, user._id);
			// Отменяем бронь через 2 минуты
			setTimeout(async () => {
				const user = await getUser(clientId);
				if (user.status === 'completed') return;
				// Очищаем инвайт
				await updateInvite(_id, null);
				await updateUser(user._id, { invite: null, status: 'expired' });
				logs(`🟨 <b>INFO:[createRoute]</b> ${user._id} не подписался вовремя.`);
			}, process.env.TELEGRAM_INVITE_TIME);

			// Отдаём инвайт в ответе
			res.status(200).json({ data: href });
		}
	} catch (e) {
		res.status(400).send(`Не удалось отправить приглашение.`);
		logs('🟥 <b>ERROR:[createRoute]</b> Не удалось отправить приглашение', e);
	}
};

module.exports = { create }