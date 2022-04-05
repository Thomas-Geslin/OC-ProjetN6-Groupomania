const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/posts');

router.post('/create', postCtrl.postCreate);
router.get('/', postCtrl.getAllPosts);

module.exports = router;