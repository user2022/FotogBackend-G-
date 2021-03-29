const User = require('../models/User');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const {Post} = require('../models/Forum');


// Profile section
exports.getProfile = async (req, res) => {
    try {
        let user = await User.findOne({username: req.params.username})
                .select('_id username firstName lastName profileImg displayFullName role photos comments posts') // Query for what data I want sent to the API
                .populate('role')
                .exec();
        let photos = await Photo.find({user: user._id}).sort({created_at: -1}).exec();
        let comments = await Comment.find({user: user._id}).populate('photo', '_id id title').sort({created_at: -1}).exec();
        let posts = await Post.find({user: user._id}).populate('thread', 'id title').sort({created_at: -1}).exec();

        if (photos.length > 0) user.photos = photos; // If the user has submitted any photos, add them
        if (comments.length > 0) user.comments = comments;
        if (posts.length > 0) user.posts = posts;

        await res.json({
            success: true,
            user: user
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Settings section
exports.updateProfilePicture = async (req, res) => {
    try {
        await User.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                profileImg: req.file.linkUrl
            }
        });

        await res.json({
            success: true,
            message: 'User successfully updated'
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
