const atracaoService = require('../services/atracaoService');

class AtracaoController {
  async create(req, res, next) {
    try {
      const { nome, descricao, tipo, localizacao, imagem } = req.body;
      const novaAtracao = await atracaoService.create({ nome, descricao, tipo, localizacao, imagem });
      res.status(201).json(novaAtracao);
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { tipo } = req.query;
      const atracoes = await atracaoService.list(tipo);
      res.status(200).json(atracoes);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const atracao = await atracaoService.findById(id);
      res.status(200).json(atracao);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nome, descricao, tipo, localizacao, imagem } = req.body;
      const atracaoAtualizada = await atracaoService.update(id, { nome, descricao, tipo, localizacao, imagem });
      res.status(200).json(atracaoAtualizada);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const response = await atracaoService.delete(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AtracaoController();
