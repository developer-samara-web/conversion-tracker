// Импорты
const server = require('express')()

// Роут получения инвайта
server.get('/api/create', async (req, res) => {
	console.log('Invite')
})

// Если роут не существует
server.get('*', function(req, res){
    res.status(403).send(`Forbidden`)
});

// Понятие сервера
server.listen(process.env.SERVER_PORT, () => {
    console.log(`READY | PORT: ${process.env.SERVER_PORT}`)
})