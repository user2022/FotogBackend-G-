const router = require('express').Router();
const adminCont = require('../controllers/adminCont');
const verifyToken = require('../middleware/verify-token');

// GET all users
router.get('/admin/users', verifyToken, adminCont.getAllUsers);

// GET all users created within the last week
router.get('/admin/userWeekly', verifyToken, adminCont.getMonthlyUsers);

// PUT - Update user's role
router.put('/admin/role/user/:id', verifyToken, adminCont.updateRole);

// GET all forum posts
router.get('/admin/forumPosts', verifyToken, adminCont.getForumPosts);


module.exports = router;
