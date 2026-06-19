const express = require('express');
const visitanteController = require('../controllers/visitanteController');
const visitanteAuthMiddleware = require('../middlewares/visitanteAuthMiddleware');

const router = express.Router();

router.post('/register', visitanteController.register);
router.post('/login', visitanteController.login);

router.get('/profile', visitanteAuthMiddleware, visitanteController.getProfile);
router.put('/profile', visitanteAuthMiddleware, visitanteController.updateProfile);

module.exports = router;
