const router = require('express').Router();
const authCont = require('../controllers/authCont');
const verifyToken = require('../middleware/verify-token');

// Sign up
router.post('/auth/signup', authCont.signUp);

// Profile
router.get('/auth/user', verifyToken, authCont.profile);

// Login
router.post('/auth/login', authCont.logIn);

module.exports = router;
