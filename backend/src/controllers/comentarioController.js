const comentarioService = require('../services/comentarioService');

class ComentarioController {
  async create(req, res, next) {
    try {
      const { nomeUsuario, comentario, atracaoId } = req.body;
      const novoComentario = await comentarioService.create({ nomeUsuario, comentario, atracaoId });
      res.status(201).json(novoComentario);
    } catch (error) {
      next(error);
    }
  }

  async listByAtracaoId(req, res, next) {
    try {
      const { atracaoId } = req.params;
      const comentarios = await comentarioService.listByAtracaoId(atracaoId);
      res.status(200).json(comentarios);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const response = await comentarioService.delete(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ComentarioController();
