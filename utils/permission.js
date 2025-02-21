// Импорты
const { logs } = require('@utils/logs');

// Проверка доступа
const permission = async (ctx, scene) => {
	// Проверка на пустые данные
	if (!ctx) return;

	try {
		// Получаем id юзера
		const { id } = ctx.from;
		// Проверяем доступ
		if (process.env.TELEGRAM_ADMIN_ID.includes(id)) {
			ctx.scene.enter(scene);
		} else {
			ctx.scene.enter('error');
		}
	} catch (e) {
		logs('🟥 <b>ERROR:</b> Доступ ограничен', e);
	}
}

module.exports = { permission }