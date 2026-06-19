const visitanteService = require('../services/visitanteService');

class VisitanteController {
  async register(req, res, next) {
    try {
      const { nome, email, senha, cidade } = req.body;
      const novoVisitante = await visitanteService.register({ nome, email, senha, cidade });
      res.status(201).json(novoVisitante);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const result = await visitanteService.login(email, senha);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const visitante = await visitanteService.getProfile(req.visitanteId);
      res.status(200).json(visitante);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { nome, cidade, foto } = req.body;
      const atualizado = await visitanteService.updateProfile(req.visitanteId, { nome, cidade, foto });
      res.status(200).json(atualizado);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VisitanteController();
