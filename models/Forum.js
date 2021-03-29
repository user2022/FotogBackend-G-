const mongoose = require('mongoose');
const {customAlphabet} = require('nanoid');

const nanoid = customAlphabet('1234567890abcdef', 12);

const postSchema = new mongoose.Schema({
    message: {type: String, required: true},
    created_at: {type: Date, required: true, default: () => Date.now()},
    updated_at: {type: Date, required: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    deleted: {type: Boolean, required: true, default: false},
    thread: {type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true} //
});

const threadSchema = new mongoose.Schema({
    id: {type: String, required: true, default: () => nanoid()},
    title: {type: String, required: true},
    message: {type: String, required: true},
    created_at: {type: Date, required: true, default: () => Date.now()},
    updated_at: {type: Date, required: false},
    // The ref option is what tells Mongoose which model to use during population
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    topic: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true}, //
    views: {type: Number, required: true, default: 1},
    deleted: {type: Boolean, required: true, default: false},
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, default: []}],
    latest_post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false}
});

const topicSchema = new mongoose.Schema({
    id: {type: String, required: true, default: () => nanoid()},
    name: {type: String, required: true},
    thread_count: {type: Number, required: false},
    created_at: {type: Date, required: true, default: () => Date.now()},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true}, //
    threads: [{type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true, default: []}]
});

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    created_at: {type: Date, required: true, default: () => Date.now()},
    topics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true, default: []}],
    power: {type: Number, required: true, default: 0} // Determines who can view this category, power 0 by default = guests and above
});

const Category = mongoose.model('Category', categorySchema);
const Topic = mongoose.model('Topic', topicSchema);
const Thread = mongoose.model('Thread', threadSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = {
    Category: Category,
    Topic: Topic,
    Thread: Thread,
    Post: Post
}

