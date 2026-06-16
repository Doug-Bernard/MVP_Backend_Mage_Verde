const prisma = require('../config/prisma');

class ComentarioService {
  async create(data) {
    const { nomeUsuario, comentario, atracaoId } = data;

    const parsedAtracaoId = parseInt(atracaoId, 10);
    if (isNaN(parsedAtracaoId)) {
      const error = new Error('atracaoId inválido.');
      error.status = 400;
      throw error;
    }

    if (!nomeUsuario || !comentario) {
      const error = new Error('Os campos nomeUsuario e comentario são obrigatórios.');
      error.status = 400;
      throw error;
    }

    // Verificar se a atração existe
    const atracao = await prisma.atracao.findUnique({
      where: { id: parsedAtracaoId },
    });

    if (!atracao) {
      const error = new Error('Atração não encontrada.');
      error.status = 404;
      throw error;
    }

    // Criar comentário
    const novoComentario = await prisma.comentario.create({
      data: {
        nomeUsuario,
        comentario,
        atracaoId: parsedAtracaoId,
      },
    });

    return novoComentario;
  }

  async listByAtracaoId(atracaoId) {
    const parsedAtracaoId = parseInt(atracaoId, 10);
    if (isNaN(parsedAtracaoId)) {
      const error = new Error('atracaoId inválido.');
      error.status = 400;
      throw error;
    }

    // Listar comentários ordenados pelos mais recentes
    const comentarios = await prisma.comentario.findMany({
      where: { atracaoId: parsedAtracaoId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comentarios;
  }

  async delete(id) {
    const comentarioId = parseInt(id, 10);
    if (isNaN(comentarioId)) {
      const error = new Error('ID de comentário inválido.');
      error.status = 400;
      throw error;
    }

    // Verificar se o comentário existe
    const comentarioExistente = await prisma.comentario.findUnique({
      where: { id: comentarioId },
    });

    if (!comentarioExistente) {
      const error = new Error('Comentário não encontrado.');
      error.status = 404;
      throw error;
    }

    await prisma.comentario.delete({
      where: { id: comentarioId },
    });

    return { message: 'Comentário excluído com sucesso.' };
  }
}

module.exports = new ComentarioService();
