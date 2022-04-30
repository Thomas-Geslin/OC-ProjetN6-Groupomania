const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const postCtrl = require('../controllers/posts');

router.post('/create', multer, postCtrl.postCreate);
router.get('/:q?', postCtrl.getAllPosts);
router.delete('/delete', auth, postCtrl.deletePost);

module.exports = router;