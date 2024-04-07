const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },

    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],

    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
});

module.exports = mongoose.model('group', groupSchema);