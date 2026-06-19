const jwt = require('jsonwebtoken');

function visitanteAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'portal_turismo_ecologico_super_secret_key_12345!';

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    if (!decoded.tipo || decoded.tipo !== 'visitante') {
      return res.status(401).json({ error: 'Token inválido para esta funcionalidade.' });
    }

    req.visitanteId = decoded.id;
    req.visitanteEmail = decoded.email;

    return next();
  });
}

module.exports = visitanteAuthMiddleware;
