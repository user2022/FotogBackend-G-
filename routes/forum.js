const router = require('express').Router();
const forumCont = require('../controllers/forumCont');

// Category
router.post('/category', forumCont.createCategory);
router.get('/category', forumCont.getAllCategory);

// Topic
router.post('/topic', forumCont.createTopic);
router.get('/topic/:id', forumCont.getOneTopic);
router.get('/topic', forumCont.getNew);

// Thread
router.post('/thread', forumCont.createThread);
router.get('/thread/:id', forumCont.getOneThread);

// Post
router.post('/post', forumCont.createPost);
router.delete('/post/:id', forumCont.deletePost);

module.exports = router;
