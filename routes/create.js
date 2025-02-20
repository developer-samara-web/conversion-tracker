const createInvite = require('@utils/createInvite')
const connectToDatabase = require('@services/mongoose')
const User = require('@models/User')

const create = async (req, res, telegram) => {
	try {
		// Получаем id пользователя
		const { clientId } = req.query
		// Создаём инвайт
		const { invite_link } = await createInvite(clientId, telegram, res)
		// Подключаемся к базе
        await connectToDatabase()
		// Создаём новый лид
		const user = new User({
            yaid: clientId,
            invite: invite_link,
			date: new Date()
        })
		// Сохраняем в базе
		await user.save()
		// Отдаём инвайт в ответе
		res.status(200).send(invite_link)
	} catch (e) {
		res.status(400).send(`Ошибка: не удалось отправить приглашение.`)
		console.log(e)
	}
}

module.exports = create