// Импорты
const mongoose = require('mongoose');

// Схема для лидов
const Userchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    client_id: { type: String, required: true, unique: true },
    client_type: { type: String, required: true },
    invite: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Invite', default: null },
    status: { type: String, required: true, default: 'pending' },
});

module.exports = mongoose.models.User || mongoose.model('User', Userchema);