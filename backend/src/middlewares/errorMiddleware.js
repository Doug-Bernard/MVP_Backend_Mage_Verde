function errorMiddleware(err, req, res, next) {
  console.error('Erro capturado pelo Middleware:', err);

  // Tratamento específico de erros conhecidos do Prisma (ex: registro duplicado, não encontrado, etc.)
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflito de dados: um registro com este valor já existe.',
      fields: err.meta?.target || []
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado no banco de dados.'
    });
  }

  // Erro padrão (Internal Server Error)
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor.';

  res.status(status).json({
    error: message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorMiddleware;
