const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    title: String,
    category: String,
    description: String,
    price: Number,
    stock: Number,
    rating: Number,
    brand: String,
    thumbnail: String,
    images: Array
});

module.exports = mongoose.model('User', userSchema);