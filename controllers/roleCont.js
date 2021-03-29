const Role = require('../models/Role');
const User = require('../models/User');

exports.createNew = async (req, res) => {
    try {
        let admin = await User.findOne({_id: req.decoded._id}).populate('role').exec(); // Getting logged in user
        if (admin.role.power <= 9) return await res.status(403).json({success: false, message: 'You do not have permission to create a resource'}); // Validating the users role

        let role = new Role();

        role.roleName = req.body.roleName;
        role.power = req.body.power;
        role.bgCol = req.body.bgCol;
        role.textCol = req.body.textCol;

        await role.save();

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

exports.updateRole = async (req, res) => {
    try {
        let admin = await User.findOne({_id: req.decoded._id}).populate('role').exec(); // Getting logged in user
        if (admin.role.power <= 9) return await res.status(403).json({success: false, message: 'You do not have permission to modify this resource'}); // Validating the users role

        let role = await Role.findOne({_id: req.params.id}).exec();

        role.roleName = req.body.roleName;
        role.power = req.body.power;
        role.bgCol = req.body.bgCol;
        role.textCol = req.body.textCol;

        await role.save();

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

exports.getAll = async (req, res) => {
    try {
        let roles = await Role.find();

        await res.json({
            success: true,
            roles: roles
        })
    } catch(err) {
        await res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}
