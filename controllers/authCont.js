const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sign up route
exports.signUp  = async (req, res) => {
  if (!req.body.email || !req.body.password) { // Check if an email or password has been sent
      await res.json({
          success: false,
          message: 'Please enter an email or password'
      })
  } else {
      try {
          let newUser = new User();
          newUser.username = req.body.username;
          newUser.email = req.body.email;
          newUser.password = req.body.password;
          newUser.firstName = req.body.firstName;
          newUser.lastName = req.body.lastName;
          newUser.profileImg = 'https://storage.googleapis.com/fotog-project/default.jpg';

          await newUser.save();

          let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
              expiresIn: 604800 // 1 week
          });

          await res.json({
              success: true,
              token: token,
              message: 'Successfully created a new user'
          });


      } catch(err) {
          await res.status(500).json({
              success: false,
              message: err.message,
          })
      }
  }
};

// Profile
exports.profile = async (req, res) => {
    try {
        let foundUser = await User.findOne({_id: req.decoded._id}).populate('role').exec();
        if (foundUser) {
            await res.json({
                success: true,
                user: foundUser
            })
        }
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

// login
exports.logIn = async (req, res) => {
    try {
        let foundUser = await User.findOne({email: req.body.email});
        if (!foundUser) {
            res.status(403).json({
                success: false,
                message: 'Authentication failed, user not found'
            })
        } else {
            // Check password
            if (foundUser.comparePassword(req.body.password)) {
                let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
                    expiresIn: 604800 // 1 week
                });

                // If correct send the token to the client
                await res.json({
                    success: true,
                    token: token
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: 'Authentication failed, wrong password'
                })
            }
        }
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message,
            error: err
        })
    }
};

