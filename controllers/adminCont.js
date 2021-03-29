const User = require('../models/User');
const {Post} = require('../models/Forum');

// All API stuff for administrators

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        let admin = await User.findOne({_id: req.decoded._id}).populate('role').exec(); // Getting logged in user
        if (admin.role.power <= 9) return await res.status(403).json({success: false, message: 'You do not have permission to use this resource'}); // Validating the users role

        let users = await User.find().populate('role').exec(); // Get all users

        await res.json({
            success: true,
            users: users
        })
    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// Get all users created in the past month
exports.getMonthlyUsers = async (req, res) => {
    try {
        let week = new Date();
        week.setDate(week.getDate() - 7); // Getting date for last 7 days

        let users = await User.find({created_at: {$gte: week}}).populate('role').exec(); // Gets users that are created a week ago

        await res.json({
            success: true,
            users: users
        })
    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// Update User
exports.updateRole = async (req, res) => {
    try {
        let admin = await User.findOne({_id: req.decoded._id}).populate('role').exec(); // Getting logged in user
        if (admin.role.power <= 9) return await res.status(403).json({success: false, message: 'You do not have permission to view this resource'});

        let user = await User.findOne({_id: req.params.id}).exec();

        user.role = req.body.role;

        await user.save();

        await res.json({
            success: true,
            message: 'Successfully saved'
        })
    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// Get all forum posts
exports.getForumPosts = async (req, res) => {
    try {
        let admin = await User.findOne({_id: req.decoded._id}).populate('role').exec(); // Getting logged in user
        if (admin.role.power <= 9) return await res.status(403).json({success: false, message: 'You do not have permission to view this resource'});

        let posts = await Post.find();

        await res.json({
            success: true,
            posts: posts
        })
    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}
