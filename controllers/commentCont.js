const Comment = require('../models/Comment');

exports.createNew = async (req, res) => {
    try {
        let comment = new Comment();

        comment.message = req.body.message;
        comment.user = req.body.user;
        comment.photo = req.body.photo;

        await comment.save();

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


