const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const { nome, email, senha } = req.body;
      const novoAdmin = await authService.register(nome, email, senha);
      res.status(201).json(novoAdmin);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const result = await authService.login(email, senha);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
