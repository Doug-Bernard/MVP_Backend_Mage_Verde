const express = require('express');

const authRoutes = require('./authRoutes');
const atracaoRoutes = require('./atracaoRoutes');
const disponibilidadeRoutes = require('./disponibilidadeRoutes');
const comentarioRoutes = require('./comentarioRoutes');
const avaliacaoRoutes = require('./avaliacaoRoutes');
const novidadeRoutes = require('./novidadeRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/atracoes', atracaoRoutes);
router.use('/disponibilidade', disponibilidadeRoutes);
router.use('/comentarios', comentarioRoutes);
router.use('/avaliacoes', avaliacaoRoutes);
router.use('/novidades', novidadeRoutes);

module.exports = router;
