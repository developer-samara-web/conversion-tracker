// Импорты
const mongoose = require('mongoose');

// Схема для лидов
const Invitechema = new mongoose.Schema({
	date: { type: Date, required: true, default: Date.now },
	user_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
	href: { type: String, required: true, unique: true }
});

module.exports = mongoose.models.Invite || mongoose.model('Invite', Invitechema);