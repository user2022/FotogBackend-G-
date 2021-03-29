const mongoose = require('mongoose');
const {customAlphabet} = require('nanoid');

const nanoid = customAlphabet('1234567890abcdef', 12);

const photoSchema = new mongoose.Schema({
    id: {type: String, required: true, default: () => nanoid()},
    title: {type: String, required: true},
    image: {type: String, required: true},
    compressed_img: {type: String, required: true}, // Compressed image that will be smaller in size and resolution
    description: {type: String, required: false},
    created_at: {type: Date, required: true, default: () => Date.now()},
    updated_at: {type: Date, required: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    views: {type: Number, required: true, default: 1},
    keywords: {type: [String], required: false},
    deleted: {type: Boolean, required: true, default: false},
    comments: {type: Array, required: true, default: []}
});

module.exports = mongoose.model('Photo', photoSchema);
