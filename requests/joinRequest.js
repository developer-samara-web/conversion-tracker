// Импорты
const { logs } = require('@utils/logs');
const { findUser, updateUser } = require('@controllers/userController');
const { updateInvite } = require('@controllers/inviteController');
const { conversionRequest } = require('@requests/conversionRequest');

// Запрос на вход в чат
const joinRequest = async (ctx) => {
	try {
		// Получаем ссылку инвайта
		const { invite_link } = ctx.chatJoinRequest.invite_link;
		// Поиск юзера с нужным инватом
		const user = await findUser(invite_link);

		if (user) {
			// Обновляем статус юзера
			await updateUser(user._id, { status: 'completed', invite: null });
			// Чистим инвайт от юзера
			await updateInvite(user.invite._id, null);
			// Отправляем данные в метрику
			const metrikaLead = await conversionRequest(user.client_id);
			// Отправляем лог
			logs(`<b>${metrikaLead ? '🟩 OK:' : '🟥 ERROR:'}[joinRequest] ${user.client_id}</b> отправил заявку`);
		} else {
			// Отправляем лог
			// logs(`<b>🟨 INFO:[joinRequest]</b> ${ctx.from.first_name} подписался без скрипта`);
		}
	} catch (e) {
		logs('🟥 <b>ERROR:[joinRequest]</b> Не удалось обработать подписку', e);
	}
}

module.exports = { joinRequest }