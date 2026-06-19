const express = require('express');
const avaliacaoController = require('../controllers/avaliacaoController');
const optionalVisitanteAuth = require('../middlewares/optionalVisitanteAuth');

const router = express.Router();

router.get('/:atracaoId', avaliacaoController.listByAtracaoId);
router.post('/', optionalVisitanteAuth, avaliacaoController.create);

module.exports = router;
