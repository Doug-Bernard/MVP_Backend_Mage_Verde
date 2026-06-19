const prisma = require('../config/prisma');

class AvaliacaoService {
  async create(data, visitanteId) {
    const { nomeUsuario, nota, atracaoId } = data;

    const parsedAtracaoId = parseInt(atracaoId, 10);
    if (isNaN(parsedAtracaoId)) {
      const error = new Error('atracaoId inválido.');
      error.status = 400;
      throw error;
    }

    if (!nomeUsuario || nota === undefined) {
      const error = new Error('Os campos nomeUsuario e nota são obrigatórios.');
      error.status = 400;
      throw error;
    }

    const parsedNota = parseInt(nota, 10);
    if (isNaN(parsedNota) || parsedNota < 1 || parsedNota > 5) {
      const error = new Error('A nota deve ser um número inteiro entre 1 e 5.');
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

    if (visitanteId) {
      const existente = await prisma.avaliacao.findFirst({
        where: { atracaoId: parsedAtracaoId, visitanteId },
      });

      if (existente) {
        const atualizada = await prisma.avaliacao.update({
          where: { id: existente.id },
          data: { nota: parsedNota, nomeUsuario },
        });
        return atualizada;
      }
    }

    const novaAvaliacao = await prisma.avaliacao.create({
      data: {
        nomeUsuario,
        nota: parsedNota,
        atracaoId: parsedAtracaoId,
        visitanteId: visitanteId || null,
      },
    });

    return novaAvaliacao;
  }

  async listByAtracaoId(atracaoId) {
    const parsedAtracaoId = parseInt(atracaoId, 10);
    if (isNaN(parsedAtracaoId)) {
      const error = new Error('atracaoId inválido.');
      error.status = 400;
      throw error;
    }

    const avaliacoes = await prisma.avaliacao.findMany({
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

    const agregacao = await prisma.avaliacao.aggregate({
      where: { atracaoId: parsedAtracaoId },
      _avg: { nota: true },
      _count: { nota: true },
    });

    const media = agregacao._avg.nota ? Number(agregacao._avg.nota.toFixed(1)) : 0;
    const total = agregacao._count.nota;

    return {
      avaliacoes,
      mediaAvaliacao: media,
      totalAvaliacoes: total,
    };
  }
}

module.exports = new AvaliacaoService();
