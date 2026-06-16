const express = require('express');
const disponibilidadeController = require('../controllers/disponibilidadeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas públicas
router.get('/:atracaoId', disponibilidadeController.findByAtracaoId);

// Rotas protegidas (apenas admin)
router.post('/', authMiddleware, disponibilidadeController.define);
router.put('/:id', authMiddleware, disponibilidadeController.update);

module.exports = router;
