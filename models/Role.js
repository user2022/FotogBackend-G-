const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: {type: String, required: true},
    power: {type: Number, required: true}, // Will be used to determine what the role can and can't do, power value 10 would be used for an admin, 5 for moderator, 1 for member
    // for example if the user's role power is 5 or > 5 they would be able to delete a post
    bgCol: {type: String, required: true}, // Will be a colour code for the background colour when the rank is being displayed on a user's post or profile
    textCol: {type: String, required: true}

})

module.exports = mongoose.model('Role', roleSchema);
