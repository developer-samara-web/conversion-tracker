const checkInvite = async (id) => {
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
		res.status(400).send(`Ошибка: проверить инвайт на исполнение.`)
		console.log(e)
	}
}

module.exports = checkInvite