const prisma = require('../config/prisma');

class NovidadeService {
  async create(data) {
    const { titulo, descricao } = data;

    if (!titulo || !descricao) {
      const error = new Error('Os campos titulo e descricao são obrigatórios.');
      error.status = 400;
      throw error;
    }

    const novaNovidade = await prisma.novidade.create({
      data: {
        titulo,
        descricao,
      },
    });

    return novaNovidade;
  }

  async list() {
    // Listar novidades ordenadas pelas mais recentes
    const novidades = await prisma.novidade.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return novidades;
  }

  async update(id, data) {
    const novidadeId = parseInt(id, 10);
    if (isNaN(novidadeId)) {
      const error = new Error('ID de novidade inválido.');
      error.status = 400;
      throw error;
    }

    // Verificar se existe
    const novidadeExistente = await prisma.novidade.findUnique({
      where: { id: novidadeId },
    });

    if (!novidadeExistente) {
      const error = new Error('Novidade não encontrada.');
      error.status = 404;
      throw error;
    }

    const { titulo, descricao } = data;

    const updateData = {};
    if (titulo) updateData.titulo = titulo;
    if (descricao) updateData.descricao = descricao;

    const novidadeAtualizada = await prisma.novidade.update({
      where: { id: novidadeId },
      data: updateData,
    });

    return novidadeAtualizada;
  }

  async delete(id) {
    const novidadeId = parseInt(id, 10);
    if (isNaN(novidadeId)) {
      const error = new Error('ID de novidade inválido.');
      error.status = 400;
      throw error;
    }

    // Verificar se existe
    const novidadeExistente = await prisma.novidade.findUnique({
      where: { id: novidadeId },
    });

    if (!novidadeExistente) {
      const error = new Error('Novidade não encontrada.');
      error.status = 404;
      throw error;
    }

    await prisma.novidade.delete({
      where: { id: novidadeId },
    });

    return { message: 'Novidade excluída com sucesso.' };
  }
}

module.exports = new NovidadeService();
