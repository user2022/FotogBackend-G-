const {Post, Thread, Topic, Category} = require('../models/Forum');

// Category Section
exports.createCategory = async (req, res) => {
    try {
        let category = new Category();

        category.name = req.body.name;

        await category.save();

        await res.json({
            success: true,
            message: 'Successfully saved'
        })
    } catch (err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        let categories = await Category.find().populate('topics').exec();

        await res.json({
            success: true,
            categories: categories
        })

    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// Topic Section
exports.createTopic = async (req, res) => {
    try {
        let topic = new Topic();

        topic.name = req.body.name;
        topic.category = req.body.category;

        await topic.save(); // Saving topic

        // Find the category that matches category _id
        let category = await Category.findOne({_id: req.body.category});

        await category.topics.addToSet(topic._id); // Add this topics _id to the topics array in category
        await category.save(); // save it

        await res.json({
            success: true,
            message: 'Successfully saved'
        })

    } catch (err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.getOneTopic = async (req, res) => {
    try {
        let topic = await Topic.findOne({id: req.params.id})
            .populate({path: 'threads',
                populate: [
                    {path: 'user', model: 'User', select: 'username profileImg _id'},
                    {path: 'latest_post', model: 'Post', populate: {path: 'user', model: 'User', select: 'profileImg username _id'}},
                    {path: 'topic', model: 'Topic', select: 'name _id'}
                ]
            }).exec();

        await res.json({
            success: true,
            topic: topic
        })
    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.getNew = async (req, res) => {
    try {
        let threads = await Thread.find()
            .populate([
                {path: 'user', model: 'User', select: 'profileImg username _id'},
                {path: 'latest_post', model: 'Post', populate: {path: 'user', model: 'User', select: 'profileImg username _id'}},
                {path: 'topic', model: 'Topic', select: 'name _id'}])
            .sort({created_at: -1}).exec();

        await res.json({
            success: true,
            topic: threads
        })
    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// Thread Section
exports.createThread = async (req, res) => {
    try {
        let thread = new Thread();

        thread.title = req.body.title;
        thread.message = req.body.message;
        thread.user = req.body.user;
        thread.topic = req.body.topic;

        await thread.save();

        let topic = await Topic.findOne({_id: req.body.topic});

        await topic.threads.addToSet(thread._id);
        await topic.save();

        await res.json({
            success: true,
            message: 'Successfully saved',
            url_id: thread.id
        })
    } catch (err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.getOneThread = async (req, res) => {
    try {
        let thread = await Thread.findOneAndUpdate({id: req.params.id}, {
            $inc: {'views': 1} // increments the view value by 1 when this api request is called
        }).populate([
            {path: 'user', model: 'User', select: 'profileImg username _id role', populate: {path: 'role', model: 'Role'}},
            {path: 'posts', model: 'Post', populate: {path: 'user', model: 'User', select: 'profileImg username _id role', populate: {path: 'role', model: 'Role'}}},
            {path: 'topic', model: 'Topic', populate: {path: 'threads', model: 'Thread', select: 'title id'}}
            ]).exec();

        await res.json({
            success: true,
            thread: thread
        })

    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}


// Post Section
exports.createPost = async (req, res) => {
    try {
        let post = new Post();

        post.message = req.body.message;
        post.user = req.body.user;
        post.thread = req.body.thread;

        await post.save();

        let thread = await Thread.findOne({_id: req.body.thread});

        thread.latest_post = post._id;
        thread.posts.addToSet(post._id);

        await thread.save();

        await res.json({
            success: true,
            message: 'Successfully saved'
        })
    } catch (err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.deletePost = async (req, res) => {
    try {
        await Post.findOneAndDelete({_id: req.params.id}).exec();

        res.json({
            success: true,
            message: 'Post Deleted'
        })
    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}
