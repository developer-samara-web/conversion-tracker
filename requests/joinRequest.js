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
		const user = await findUser(invite_link);
		// Проверяем тип конверсии
		if (user) {
			switch (user.client_type) {
				case 'yandex':
					// Обновляем статус юзера
					await updateUser(user._id, { status: 'completed', invite: null });
					// Чистим инвайт от юзера
					await updateInvite(user.invite._id, null);
					// Отправляем данные в метрику
					const metrikaLead = await metrikaRequest(user.client_id);
					// Отправляем лог
					logs(`<b>${metrikaLead ? '🟩 OK:' : '🟥 ERROR:'}[joinRequest][${user.client_id}]</b> отправил заявку в метрику`);
					break
				case 'tiktok':
					// Обновляем статус юзера
					await updateUser(user._id, { status: 'completed', invite: null });
					// Чистим инвайт от юзера
					await updateInvite(user.invite._id, null);
					// Отправляем данные в метрику
					const tiktokLead = await tiktokRequest(user.client_id);
					// Отправляем лог
					logs(`<b>${tiktokLead ? '🟩 OK:' : '🟥 ERROR:'}[joinRequest][${user.client_id}]</b> отправил заявку в тикток`);
					break
			}
		} else {
			logs(`<b>🟨 INFO:[joinRequest]</b> ${ctx.from.first_name} подписался без скрипта`);
		}
	} catch (e) {
		logs('🟥 <b>ERROR:[joinRequest]</b> Не удалось обработать подписку', e);
		return
	}
}

module.exports = { joinRequest }