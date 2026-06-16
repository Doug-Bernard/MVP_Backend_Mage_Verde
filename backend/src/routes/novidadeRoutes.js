const express = require('express');
const novidadeController = require('../controllers/novidadeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas públicas
router.get('/', novidadeController.list);

// Rotas protegidas (apenas admin)
router.post('/', authMiddleware, novidadeController.create);
router.put('/:id', authMiddleware, novidadeController.update);
router.delete('/:id', authMiddleware, novidadeController.delete);

module.exports = router;
