const prisma = require('../config/prisma');

class ComentarioService {
  async create(data, visitanteId) {
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

    const atracao = await prisma.atracao.findUnique({
      where: { id: parsedAtracaoId },
    });

    if (!atracao) {
      const error = new Error('Atração não encontrada.');
      error.status = 404;
      throw error;
    }

    const novoComentario = await prisma.comentario.create({
      data: {
        nomeUsuario,
        comentario,
        atracaoId: parsedAtracaoId,
        visitanteId: visitanteId || null,
      },
      include: {
        visitante: {
          select: { id: true, nome: true, foto: true },
        },
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

    const comentarios = await prisma.comentario.findMany({
      where: { atracaoId: parsedAtracaoId },
      include: {
        visitante: {
          select: { id: true, nome: true, foto: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comentarios;
  }

  async update(id, visitanteId, data) {
    const comentarioId = parseInt(id, 10);
    if (isNaN(comentarioId)) {
      const error = new Error('ID de comentário inválido.');
      error.status = 400;
      throw error;
    }

    const comentarioExistente = await prisma.comentario.findUnique({
      where: { id: comentarioId },
    });

    if (!comentarioExistente) {
      const error = new Error('Comentário não encontrado.');
      error.status = 404;
      throw error;
    }

    if (comentarioExistente.visitanteId !== visitanteId) {
      const error = new Error('Você só pode editar seus próprios comentários.');
      error.status = 403;
      throw error;
    }

    const { comentario } = data;
    if (!comentario) {
      const error = new Error('O campo comentario é obrigatório.');
      error.status = 400;
      throw error;
    }

    const atualizado = await prisma.comentario.update({
      where: { id: comentarioId },
      data: { comentario },
      include: {
        visitante: {
          select: { id: true, nome: true, foto: true },
        },
      },
    });

    return atualizado;
  }

  async delete(id, visitanteId) {
    const comentarioId = parseInt(id, 10);
    if (isNaN(comentarioId)) {
      const error = new Error('ID de comentário inválido.');
      error.status = 400;
      throw error;
    }

    const comentarioExistente = await prisma.comentario.findUnique({
      where: { id: comentarioId },
    });

    if (!comentarioExistente) {
      const error = new Error('Comentário não encontrado.');
      error.status = 404;
      throw error;
    }

    if (comentarioExistente.visitanteId && comentarioExistente.visitanteId !== visitanteId) {
      const error = new Error('Você só pode excluir seus próprios comentários.');
      error.status = 403;
      throw error;
    }

    await prisma.comentario.delete({
      where: { id: comentarioId },
    });

    return { message: 'Comentário excluído com sucesso.' };
  }
}

module.exports = new ComentarioService();
