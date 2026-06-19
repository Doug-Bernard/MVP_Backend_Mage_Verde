const jwt = require('jsonwebtoken');

function optionalVisitanteAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return next();
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return next();
  }

  const jwtSecret = process.env.JWT_SECRET || 'portal_turismo_ecologico_super_secret_key_12345!';

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return next();
    }

    if (decoded.tipo === 'visitante') {
      req.visitanteId = decoded.id;
      req.visitanteEmail = decoded.email;
    }

    return next();
  });
}

module.exports = optionalVisitanteAuth;
