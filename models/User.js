const mongoose = require('mongoose');

// Схема для лидов
const Userchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    client_id: { type: String, required: true, unique: true },
    invite: { type: String, required: true },
    in_work: { type: Boolean, require: true, default: false }
});

module.exports = mongoose.models.User || mongoose.model('User', Userchema);