const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');

const utilisateurCtrl = require('../controllers/utilisateurs');

router.post('/signup', multer, utilisateurCtrl.signup);
router.post('/login', utilisateurCtrl.login);
router.delete('/delete', utilisateurCtrl.deleteUser);
router.post('/', utilisateurCtrl.getUser);
router.get('/', utilisateurCtrl.getAllUser);
router.get('/admin/:id', utilisateurCtrl.isAdmin);

module.exports = router;