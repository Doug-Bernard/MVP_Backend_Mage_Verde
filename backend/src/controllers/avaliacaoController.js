const avaliacaoService = require('../services/avaliacaoService');

class AvaliacaoController {
  async create(req, res, next) {
    try {
      const { nomeUsuario, nota, atracaoId } = req.body;
      const visitanteId = req.visitanteId || null;
      const novaAvaliacao = await avaliacaoService.create({ nomeUsuario, nota, atracaoId }, visitanteId);
      res.status(201).json(novaAvaliacao);
    } catch (error) {
      next(error);
    }
  }

  async listByAtracaoId(req, res, next) {
    try {
      const { atracaoId } = req.params;
      const result = await avaliacaoService.listByAtracaoId(atracaoId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AvaliacaoController();
