require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Configurações Globais de Middlewares
app.use(cors()); // Permite conexões do frontend rodando em outras portas/domínios
app.use(express.json()); // Habilita requisições com corpo formatado em JSON

// Rotas da API montadas na raiz (ex: /auth, /atracoes, etc.)
app.use('/', routes);

// Rota de status da API
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'API Online', timestamp: new Date() });
});

// Middleware Global de Tratamento de Erros (deve ser o último)
app.use(errorMiddleware);

module.exports = app;
