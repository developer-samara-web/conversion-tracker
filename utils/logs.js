// Импорты
const telegram = require('@services/telegram');

// Логирование
const logs = async (info, e) => {
	try {
		await telegram.telegram.sendMessage(54355560, `${info}${e ? `: ${e}` : '.'}`, { parse_mode: 'HTML' });
	} catch (e) {
		console.log(e);
	}
}

module.exports = { logs }