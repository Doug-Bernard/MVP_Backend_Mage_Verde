const express = require('express');
const atracaoController = require('../controllers/atracaoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas públicas
router.get('/', atracaoController.list);
router.get('/:id', atracaoController.findById);

// Rotas protegidas (apenas admin)
router.post('/', authMiddleware, atracaoController.create);
router.put('/:id', authMiddleware, atracaoController.update);
router.delete('/:id', authMiddleware, atracaoController.delete);

module.exports = router;
