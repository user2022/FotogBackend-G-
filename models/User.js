const mongoose = require('mongoose');
const bcrypt = require ('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, trim: true, minLength: 4, maxLength: 20},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true, trim: true, minLength: 6},
    photos: {type: Array, required: true, default: []},
    comments: {type: Array, required: true, default: []},
    posts: {type: Array, required: true, default: []},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    totalLikes: {type: Number, default: 0},
    profileImg: {type: String, required: true},
    displayFullName: {type: Boolean, default: true},
    created_at: {type: Date, default: () => Date.now()},
    location: {type: String, required: false},
    bio: {type: String, required: false}, // biography
    role: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true, default: '602ea7efbb0ff84f70a11d8c'} // 602ea7efbb0ff84f70a11d8c = member role
});



// Before saving user object..
userSchema.pre('save', function (next) {
    let user = this;
    if (this.isModified('password') || this.isNew) { // isModified checks if the document is modified, isNew checks if the document is new
        // Generate 10 random characters using the users password to create a hash
        bcrypt.genSalt(10, (err, salt) => { // Adding random data to the hash input to guarantee a unique output
            if (err) return next(err);

            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) return next(err);

                user.password = hash; // Store to users password
                next();
            })
        })
    } else {
        return next();
    }
});

// Compares password of encrypted hash
userSchema.methods.comparePassword = function (password, next) {
    let user = this;
    // Checking if the hashed password matches the user password
    return bcrypt.compareSync(password, user.password); // returns true or false
};

module.exports = mongoose.model('User', userSchema);
