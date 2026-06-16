const express = require('express');
const avaliacaoController = require('../controllers/avaliacaoController');

const router = express.Router();

// Rotas públicas (qualquer visitante do portal pode avaliar)
router.get('/:atracaoId', avaliacaoController.listByAtracaoId);
router.post('/', avaliacaoController.create);

module.exports = router;
