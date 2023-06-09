const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAccountVerified: Boolean,
    verificationToken: String,
    resetPasswordToken: String,
    chats: Array,
    friends: Array,
    notifications: Array,
    friendRequests: Array
});

module.exports = mongoose.model('User', userSchema);