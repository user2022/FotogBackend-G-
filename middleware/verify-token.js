const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    let checkBearer = "Bearer ";

    // If token exists
    if (token) {
        // If token starts with bearer, remove it
        if (token.startsWith(checkBearer)) {
            token = token.slice(checkBearer.length, token.length);
        }

        // verify token
        jwt.verify(token, process.env.SECRET, (err, decoded) => {

            if (err) {
                res.json({ // If token is not valid
                    success: false,
                    message: 'Failed to authenticate'
                })
            } else {
                req.decoded = decoded; //
                next();
            }
        })
    } else {
        res.json({
            success: false,
            message: "No token provided"
        })
    }
};
