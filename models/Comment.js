const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    message: {type: String, required: true, maxlength: 300},
    created_at: {type: Date, required: true, default: () => Date.now()},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    photo: {type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true},
    deleted: {type: Boolean, required: true, default: false},
}, );

module.exports = mongoose.model('Comment', commentSchema);
