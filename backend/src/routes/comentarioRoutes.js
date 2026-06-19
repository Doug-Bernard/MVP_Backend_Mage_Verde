const express = require('express');
const comentarioController = require('../controllers/comentarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const visitanteAuthMiddleware = require('../middlewares/visitanteAuthMiddleware');
const optionalVisitanteAuth = require('../middlewares/optionalVisitanteAuth');

const router = express.Router();

router.get('/:atracaoId', comentarioController.listByAtracaoId);
router.post('/', optionalVisitanteAuth, comentarioController.create);

router.put('/:id', visitanteAuthMiddleware, comentarioController.update);
router.delete('/:id', authMiddleware, comentarioController.delete);

module.exports = router;
