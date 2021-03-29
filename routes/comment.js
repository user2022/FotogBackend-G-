const router = require('express').Router();
const commentCont = require('../controllers/commentCont');

// Create
router.post('/comment', commentCont.createNew);

module.exports = router;
