const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.createNew = async (req, res) => {
    try {
        let image = req.files['image'][0];
        // Checking if file is an image
        if (image.mimetype === 'image/jpeg' || image.mimetype === 'image/png') {
            let photo = new Photo();

            photo.title = req.body.title;
            photo.image = req.files['image'][0].linkUrl; // Google cloud url
            photo.compressed_img = req.files['compressed_img'][0].linkUrl;
            photo.description = req.body.description;
            photo.user = req.body.user;
            photo.keywords = req.body.keywords.split(','); // Converting the request string into an array by using built in JS split method

            await photo.save();

            await res.json({
                success: true,
                message: 'Successfully saved',
                url_id: photo.id
            })
        } else {
            res.json({ // If uploaded file isn't an image
                success: false,
                message: 'Uploaded file is not an image'
            })
        }

    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.getOne = async (req, res) => {
    try {
        // Finding single photo and populating the user field with the correct user data that matches user's object ID
        let photo = await Photo.findOneAndUpdate({id: req.params.id}, {
            $inc: {'views': 1} // increments the view value by 1 when this api request is called
        }).populate({
            path: 'user',
            select: 'username _id profileImg firstName lastName',
            populate: { // Populating the role object within the user
                path: 'role',
                model: 'Role'
            }
        }).exec();

        // Finding all comments that match the photo _id so I have all the comments that are related to that specific photo // Sorting by date so will be displayed by most recent
        let comments = await Comment.find({photo: photo._id}).populate('user', 'username _id profileImg firstName lastName').sort({created_at: -1}).exec();

        if (comments.length > 0) photo.comments = comments; // If comments exist, append them onto the photo.comments array
        // Otherwise, it will simply be an empty array

        await res.json({
            success: true,
            photo: photo
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Get all photos
exports.getAll = async (req, res) => {
    try {
        // Getting all photos and getting the attached user details by populating the object - then sorting by most views
        let photos = await Photo.find().populate('user', 'username _id profileImg firstName lastName').sort({views: -1}).exec();

        await res.json({
            success: true,
            photos: photos
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Allows a user to like or remove their like from a photo
exports.likePhoto = async (req, res) => {
    try {
        let photo = await Photo.findOneAndUpdate({_id: req.params.id}).exec();

        // Check if the photo.likes array includes the current user
        if (photo.likes.includes(req.body.user)) {
            await photo.likes.pull(req.body.user); // Remove the current user

            await photo.save(); // Save the user's updated object

            res.json({
                success: true,
                message: 'Disliked photo'
            })
        } else {
            await photo.likes.addToSet(req.body.user); // Add user to liked array

            await photo.save();

            res.json({
                success: true,
                message: 'Liked photo',
            })
        }

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


// DELETE photo
exports.deletePhoto = async (req, res) => {
    try {
        let admin = await User.findOne({_id: req.decoded._id}).populate('role').exec(); // Getting logged in user
        if (admin.role.power <= 9) return await res.status(403).json({success: false, message: 'You do not have permission to delete this resource'});

        await Photo.findOneAndDelete({_id: req.params.id}).exec();

        res.json({
            success: true,
            message: 'Photo deleted'
        })

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


