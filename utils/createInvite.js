const createInvite = async (clientId, telegram, res) => {
	// Проверка на ошибку
	if (!process.env.TELEGRAM_GROUP_ID) {
		console.error('Ошибка: не указан TELEGRAM_GROUP_ID в .env');
		return null;
	}

	try {
		return await telegram.telegram.createChatInviteLink(
			// ID группы
			process.env.TELEGRAM_GROUP_ID,
			// Опции создания инвайта
			{
				name: clientId, // Название инвайта
				expire_date: Math.floor(Date.now() / 1000) + 120, // Срок работы инвайта
				creates_join_request: true, // Подтверждение инвайта
			}
		);
	} catch (e) {
		res.status(400).send(`Ошибка: не удалось создать приглашение.`)
		console.log(e)
	}
}

module.exports = createInvite