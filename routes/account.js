const router = require('express').Router();
const accountCount = require('../controllers/accountCont');
const Upload = require('../middleware/upload-photo');

// Profile Section
router.get('/profile/:username', accountCount.getProfile);

// Account Section
router.put('/user/:id', Upload.single("profileImg"), accountCount.updateProfilePicture);

module.exports = router;
