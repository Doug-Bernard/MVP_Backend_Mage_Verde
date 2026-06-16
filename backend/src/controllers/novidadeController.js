const novidadeService = require('../services/novidadeService');

class NovidadeController {
  async create(req, res, next) {
    try {
      const { titulo, descricao } = req.body;
      const novaNovidade = await novidadeService.create({ titulo, descricao });
      res.status(201).json(novaNovidade);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const novidades = await novidadeService.list();
      res.status(200).json(novidades);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { titulo, descricao } = req.body;
      const novidadeAtualizada = await novidadeService.update(id, { titulo, descricao });
      res.status(200).json(novidadeAtualizada);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const response = await novidadeService.delete(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NovidadeController();
