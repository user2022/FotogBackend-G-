const router = require('express').Router();
const photoCont = require('../controllers/photoCont');
const Upload = require('../middleware/upload-photo');
const verifyToken = require('../middleware/verify-token');

// Create
// router.post('/photo', Upload.single("image"), photoCont.createNew);
router.post('/photo', Upload.fields([{name: 'image', maxCount: 1}, {name: 'compressed_img', maxCount: 1}]), photoCont.createNew);
// Get one
router.get('/photo/:id', photoCont.getOne);
// Get all
router.get('/photo', photoCont.getAll);

// Like Photo
router.post('/like/:id', photoCont.likePhoto);

// Delete photo
router.delete('/photo/:id', verifyToken, photoCont.deletePhoto);

module.exports = router;
