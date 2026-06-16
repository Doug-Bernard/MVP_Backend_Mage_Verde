const express = require('express');
const comentarioController = require('../controllers/comentarioController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas públicas
router.get('/:atracaoId', comentarioController.listByAtracaoId);
router.post('/', comentarioController.create);

// Rotas protegidas (apenas admin)
router.delete('/:id', authMiddleware, comentarioController.delete);

module.exports = router;
