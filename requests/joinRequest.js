// Импорты
const { logs } = require('@utils/logs');
const { findUser, updateUser } = require('@controllers/userController');
const { updateInvite } = require('@controllers/inviteController');
const { metrikaRequest } = require('@requests/metrikaRequest');
const { tiktokRequest } = require('@requests/tiktokRequest');

// Запрос на вход в чат
const joinRequest = async (ctx) => {
	try {
		// Получаем ссылку инвайта
		const { invite_link } = ctx.chatJoinRequest?.invite_link;
		// Поиск юзера с нужным инватом
		const { _id, invite, client_id, client_type } = await findUser(invite_link);

		if (client_type === 'yandex') {
			// Обновляем статус юзера
			await updateUser(_id, { status: 'completed', invite: null });
			// Чистим инвайт от юзера
			await updateInvite(invite._id, null);
			// Отправляем данные в метрику
			const metrikaLead = await metrikaRequest(client_id);
			// Отправляем лог
			logs(`<b>${metrikaLead ? '🟩 OK:' : '🟥 ERROR:'}[joinRequest][${client_id}]</b> отправил заявку в метрику`);

			return;
		}

		if (client_type === 'tiktok') {
			// Обновляем статус юзера
			await updateUser(_id, { status: 'completed', invite: null });
			// Чистим инвайт от юзера
			await updateInvite(invite._id, null);
			// Отправляем данные в метрику
			const tiktokLead = await tiktokRequest(client_id);
			// Отправляем лог
			logs(`<b>${tiktokLead ? '🟩 OK:' : '🟥 ERROR:'}[joinRequest] [${client_type}] [${client_id}]</b> отправил заявку в тикток`);

			return;
		}

		logs(`<b>🟨 INFO:[joinRequest]</b> ${ctx.from.first_name} подписался без скрипта`);
		return
	} catch (e) {
		logs('🟥 <b>ERROR:[joinRequest]</b> Не удалось обработать подписку', e);
		return
	}
}

module.exports = { joinRequest }