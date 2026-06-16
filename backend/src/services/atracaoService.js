const prisma = require('../config/prisma');

class AtracaoService {
  async create(data) {
    const { nome, descricao, tipo, localizacao, imagem } = data;

    if (!nome || !descricao || !tipo || !localizacao) {
      const error = new Error('Os campos nome, descricao, tipo e localizacao são obrigatórios.');
      error.status = 400;
      throw error;
    }

    const tipoNormalizado = tipo.toUpperCase();
    if (!['TRILHA', 'CACHOEIRA', 'EVENTO'].includes(tipoNormalizado)) {
      const error = new Error('Tipo inválido. Deve ser TRILHA, CACHOEIRA ou EVENTO.');
      error.status = 400;
      throw error;
    }

    // Criar a atração
    const novaAtracao = await prisma.atracao.create({
      data: {
        nome,
        descricao,
        tipo: tipoNormalizado,
        localizacao,
        imagem: imagem || '',
      },
    });

    return novaAtracao;
  }

  async list(tipoFilter) {
    const where = {};
    if (tipoFilter) {
      where.tipo = tipoFilter.toUpperCase();
    }

    // Listar atrações incluindo sua disponibilidade e a agregação das avaliações para retornar a média
    const atracoes = await prisma.atracao.findMany({
      where,
      include: {
        disponibilidade: true,
        avaliacoes: {
          select: {
            nota: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mapeia as atrações para incluir a média formatada de notas na listagem
    return atracoes.map((atracao) => {
      const totalAvaliacoes = atracao.avaliacoes.length;
      const somaNotas = atracao.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
      const mediaAvaliacao = totalAvaliacoes > 0 ? (somaNotas / totalAvaliacoes) : 0;

      // Remove array de avaliações cruas para simplificar o retorno
      const { avaliacoes, ...dadosAtracao } = atracao;

      return {
        ...dadosAtracao,
        mediaAvaliacao: Number(mediaAvaliacao.toFixed(1)),
        totalAvaliacoes,
      };
    });
  }

  async findById(id) {
    const atracaoId = parseInt(id, 10);
    if (isNaN(atracaoId)) {
      const error = new Error('ID inválido.');
      error.status = 400;
      throw error;
    }

    const atracao = await prisma.atracao.findUnique({
      where: { id: atracaoId },
      include: {
        disponibilidade: true,
        comentarios: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!atracao) {
      const error = new Error('Atração não encontrada.');
      error.status = 404;
      throw error;
    }

    // Calcular média das notas
    const agregacao = await prisma.avaliacao.aggregate({
      where: { atracaoId },
      _avg: {
        nota: true,
      },
      _count: {
        nota: true,
      },
    });

    const mediaAvaliacao = agregacao._avg.nota ? Number(agregacao._avg.nota.toFixed(1)) : 0;
    const totalAvaliacoes = agregacao._count.nota;

    return {
      ...atracao,
      mediaAvaliacao,
      totalAvaliacoes,
    };
  }

  async update(id, data) {
    const atracaoId = parseInt(id, 10);
    if (isNaN(atracaoId)) {
      const error = new Error('ID inválido.');
      error.status = 400;
      throw error;
    }

    // Verificar se existe
    const atracaoExistente = await prisma.atracao.findUnique({
      where: { id: atracaoId },
    });

    if (!atracaoExistente) {
      const error = new Error('Atração não encontrada.');
      error.status = 404;
      throw error;
    }

    const { nome, descricao, tipo, localizacao, imagem } = data;

    const dataUpdate = {};
    if (nome) dataUpdate.nome = nome;
    if (descricao) dataUpdate.descricao = descricao;
    if (localizacao) dataUpdate.localizacao = localizacao;
    if (imagem !== undefined) dataUpdate.imagem = imagem;

    if (tipo) {
      const tipoNormalizado = tipo.toUpperCase();
      if (!['TRILHA', 'CACHOEIRA', 'EVENTO'].includes(tipoNormalizado)) {
        const error = new Error('Tipo inválido. Deve ser TRILHA, CACHOEIRA ou EVENTO.');
        error.status = 400;
        throw error;
      }
      dataUpdate.tipo = tipoNormalizado;
    }

    const atracaoAtualizada = await prisma.atracao.update({
      where: { id: atracaoId },
      data: dataUpdate,
    });

    return atracaoAtualizada;
  }

  async delete(id) {
    const atracaoId = parseInt(id, 10);
    if (isNaN(atracaoId)) {
      const error = new Error('ID inválido.');
      error.status = 400;
      throw error;
    }

    // Verificar se existe
    const atracaoExistente = await prisma.atracao.findUnique({
      where: { id: atracaoId },
    });

    if (!atracaoExistente) {
      const error = new Error('Atração não encontrada.');
      error.status = 404;
      throw error;
    }

    // Deleta a atração. O cascade configurado no schema prisma cuida de deletar:
    // disponibilidade, comentarios e avaliacoes automaticamente.
    await prisma.atracao.delete({
      where: { id: atracaoId },
    });

    return { message: 'Atração excluída com sucesso.' };
  }
}

module.exports = new AtracaoService();
