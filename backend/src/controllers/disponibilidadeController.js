const disponibilidadeService = require('../services/disponibilidadeService');

class DisponibilidadeController {
  async define(req, res, next) {
    try {
      const { atracaoId, status, horarioAbertura, horarioFechamento, observacao } = req.body;
      const disponibilidade = await disponibilidadeService.define({
        atracaoId,
        status,
        horarioAbertura,
        horarioFechamento,
        observacao,
      });
      res.status(201).json(disponibilidade);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { status, horarioAbertura, horarioFechamento, observacao } = req.body;
      const disponibilidadeAtualizada = await disponibilidadeService.update(id, {
        status,
        horarioAbertura,
        horarioFechamento,
        observacao,
      });
      res.status(200).json(disponibilidadeAtualizada);
    } catch (error) {
      next(error);
    }
  }

  async findByAtracaoId(req, res, next) {
    try {
      const { atracaoId } = req.params;
      const disponibilidade = await disponibilidadeService.findByAtracaoId(atracaoId);
      res.status(200).json(disponibilidade);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DisponibilidadeController();
