// Импорты
const telegram = require('@services/telegram');

// Логирование
const logs = async (info, e) => {
	// Функция для получения текущего времени
	function getCurrentTime() {
		const now = new Date();
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}

	try {
		await telegram.telegram.sendMessage(54355560, `[${getCurrentTime()}] ${info}${e ? `: ${e}` : '.'}`, { parse_mode: 'HTML' });
	} catch (e) {
		console.log(e);
	}
}

module.exports = { logs }