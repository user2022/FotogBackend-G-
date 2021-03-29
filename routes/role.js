const router = require('express').Router();
const roleCont = require('../controllers/roleCont');
const verifyToken = require('../middleware/verify-token');

// Create
router.post('/role', verifyToken, roleCont.createNew);

// Update
router.put('/role/:id', verifyToken, roleCont.updateRole);

// Get all
router.get('/role', roleCont.getAll);

module.exports = router;
